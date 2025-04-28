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

  // Generate a unique room name for two users
  function getRoomName(id1, id2) {
    return [id1, id2].sort().join("-");
  }

  useEffect(() => {
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

  const handleSend = () => {
    if (input.trim() === "") return;
    const room = getRoomName(userId, partnerId);
    const messageData = { room, sender: userId, text: input };
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
    navigate(`/feedback?from_user_id=${userId}`);
  };
  

  return (
    <div className="chat-page">
      <h2>Chat Room</h2>
      <div>
        <p>Your User ID: {userId}</p>
        <p>Partner's User ID: {partnerId}</p>
      </div>
      {/* Messages list */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <strong>{msg.sender === userId ? "You" : "Partner"}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>
      {/* Message input box */}
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message…"
          className="chat-input-box"
        />
        <button onClick={handleSend} className="send-btn">Send</button>
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






