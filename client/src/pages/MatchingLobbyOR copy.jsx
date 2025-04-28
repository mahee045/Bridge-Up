import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/////NOT THE REAL MATCHING LOBBY 
export default function MatchingLobby({ uuid, role, field }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Looking for a match…");
  const tips = [
    "💬 Be ready to introduce yourself!",
    "🎯 Mention what you’re hoping to get out of the session!",
    "💡 You can ask about career paths, tools, or mindset.",
  ];

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // POST to /match to check if there is a match
        const res = await fetch("http://localhost:3001/match", { //put in api file
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), //empty
        });
        const data = await res.json();

        if (data.matched && data.session_id) {
          setMessage("Match found! Redirecting…");
          setTimeout(() => {
            navigate(`/session/${data.session_id}`);
          }, 1000);
        } else {
          setMessage("Looking for a match…");
        }
      } catch (err) {
        setMessage("Network error—check your server.");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

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

