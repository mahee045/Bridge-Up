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

  // Extract relevant URL parameters
  const userId = searchParams.get("userId");
  const partnerId = searchParams.get("partnerId");
  const userName = searchParams.get("userName");
  const partnerName = searchParams.get("partnerName");
  const userRole = searchParams.get("userRole");
  const partnerRole = searchParams.get("partnerRole");

  // Determine actual mentor and mentee
  const mentorName = userRole === "mentor" ? userName : partnerName;
  const menteeName = userRole === "mentee" ? userName : partnerName;

  // Local state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Helper to create consistent room name
  function getRoomName(id1, id2) {
    return [id1, id2].sort().join("-");
  }

  // Set up socket connection
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

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, partnerId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send new message
  const handleSend = () => {
    if (input.trim() === "") return;

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

  // End session + cleanup
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

  // Format timestamps
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${
      hours >= 12 ? "PM" : "AM"
    }`;
    return formattedTime;
  }

  return (
    <div className="chat-page">
      <h2>Chat Room</h2>

      <div>
        <p><strong>Mentor:</strong> {mentorName}</p>
        <p><strong>Mentee:</strong> {menteeName}</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.system ? "system" : msg.sender === userId ? "you" : "partner"}`}
            >
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
        <div ref={messagesEndRef} />
      </div>

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
