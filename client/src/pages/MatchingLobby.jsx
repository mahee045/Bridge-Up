import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchingLobby.scss";

export default function MatchingLobby({ uuid, role, field }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Looking for a match…");
  const tips = [
    "💬 Be ready to introduce yourself!",
    "🎯 Mention what you’re hoping to get out of the session!",
    "💡 You can ask about career paths, tools, or mindset.",
  ];

  useEffect(() => {
    // Interval to poll for match queue status
    const interval = setInterval(async () => {
      try {
        // POST to your backend to join the match queue
        const res = await fetch("http://localhost:3001/match-queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: uuid, role, interests: field.split(",") }),
        });

        // Check for server errors (non-200)
        if (!res.ok) {
          setMessage("Server error—please wait or try again.");
          return;
        }

        const data = await res.json();
        // If your backend responds with a matched session, redirect:
        if (data.matched && data.session_uuid) {
          navigate(`/session/${data.session_uuid}`);
        }
        // Optionally: update message if match not found yet
      } catch (err) {
        setMessage("Network error—check your server.");
      }
    }, 3000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [uuid, role, field, navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="matching-lobby">
      <div className="spinner">
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="spinner-bg" cx="12" cy="12" r="10" strokeWidth="4" />
          <path className="spinner-path" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
      <h2 className="title">{message}</h2>
      <p className="subtitle">Hang tight! We’re finding someone for you.</p>
      <div className="tips-box">
        <h3>Tips while you wait:</h3>
        <ul>
          {tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleCancel} className="cancel-btn">
        Cancel & Go Back
      </button>
    </div>
  );
}
