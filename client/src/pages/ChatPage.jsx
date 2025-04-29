import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import "./ChatPage.scss"; 
import { removeFromMatchQueue } from "../api/user"; 

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const partnerId = searchParams.get("partnerId");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  function getRoomName(id1, id2) {
    return [id1, id2].sort().join("-");
  }

  useEffect(() => {
    if (!userId || !partnerId) {
      console.error("Missing userId or partnerId");
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
  
    const room = getRoomName(userId, partnerId);
    const messageData = { 
      room, 
      sender: userId, 
      text: input,
      timestamp: Date.now(),  // timestamp when sending
    };
  
    socketRef.current.emit("send_message", messageData);
  
    setInput("");
  };

  //deleting user if they go to feedback form
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
  
  //time stamp function
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
      <div>
        <p><strong>Your User ID:</strong> {userId}</p>
        <p><strong>Partner's User ID:</strong> {partnerId}</p>
      </div>

      {/* Messages list */}
      <div className="chat-messages">
  {messages.length === 0 ? (
    <p className="no-messages">No messages yet.</p>
  ) : (
    messages.map((msg, idx) => (
      <div
        key={idx}
        className={`chat-message ${msg.system ? "system" : (msg.sender === userId ? "you" : "partner")}`}
      >
        {msg.system ? (
          <em>{msg.text}</em>
        ) : (
          <>
            <strong>{msg.sender === userId ? "You" : "Partner"}:</strong> {msg.text}
            {/* Add the timestamp display here */}
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


      {/* Message input box */}
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
  style={{ marginTop: "20px", padding: "0.7em 2em", borderRadius: "8px", background: "#f59e0b", color: "#fff", fontWeight: 600, cursor: "pointer" }}
>
  End Session
</button>
    </div>
  );
}






