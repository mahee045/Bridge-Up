import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.scss";
import { removeFromMatchQueue } from "../api/user";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Extract relevant URL parameters: IDs and user names
  const userId = searchParams.get("userId");
  const partnerId = searchParams.get("partnerId");
  const userName = searchParams.get("userName");
  const partnerName = searchParams.get("partnerName");

  // Local state for message list and input field
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Helper function to determine consistent room naming convention
  function getRoomName(id1, id2) {
    return [id1, id2].sort().join("-");
  }

  // Establish socket connection and manage message listening
  useEffect(() => {
    if (!userId || !partnerId) {
      console.error("Missing userId or partnerId. Cannot establish room.");
      return;
    }

    socketRef.current = io("http://localhost:3001");

    const room = getRoomName(userId, partnerId);

    socketRef.current.emit("join_room", room);

    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup connection on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, partnerId]);

  // Ensure chat scrolls automatically to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending new message
  const handleSend = () => {
    if (input.trim() === "") return; // Prevent empty messages

    const room = getRoomName(userId, partnerId);

    const messageData = {
      room,
      sender: userId,
      text: input,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send_message", messageData);
    setInput("");
  };

  // Manage ending session and cleaning up queue participation
  const handleEndSession = async () => {
    const queueId = localStorage.getItem("queueId");
    if (queueId) {
      try {
        await removeFromMatchQueue(queueId);
        localStorage.removeItem("queueId");
      } catch (err) {
        console.error("Failed to remove from match queue", err);
      }
    }
    navigate(`/feedback?from_user_id=${userId}&partner_user_id=${partnerId}`);
  };

  // Format timestamps for human-readable chat bubbles
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    return formattedTime;
  }

  return (
    <div className="chat-page">
      <h2>Chat Room</h2>

      {/* Display usernames instead of system IDs */}
      <div>
        <p><strong>Mentor:</strong> {userName}</p>
        <p><strong>Mentee:</strong> {partnerName}</p>
      </div>

      {/* Message history list */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.system ? "system" : (msg.sender === userId ? "you" : "partner")}`}
            >
              {/* System messages vs. user-generated content */}
              {msg.system ? (
                <em>{msg.text}</em>
              ) : (
                <>
                  <strong>{msg.sender === userId ? "You" : partnerName}:</strong> {msg.text}
                  <div className="timestamp">
                    {msg.timestamp && formatTimestamp(msg.timestamp)}
                  </div>
                </>
              )}
            </div>
          ))
        )}
        {/* Reference to keep scroll at bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field and send button */}
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="chat-input-box"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend} className="send-btn">
          Send
        </button>
      </div>

      {/* End session button */}
      <button
        onClick={handleEndSession}
        style={{
          marginTop: "20px",
          padding: "0.7em 2em",
          borderRadius: "8px",
          background: "#f59e0b",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        End Session
      </button>
    </div>
  );
}
