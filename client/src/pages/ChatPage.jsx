import React from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import "./ChatPage.scss"; 

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const partnerId = searchParams.get("partnerId");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

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
    </div>
  );
}



