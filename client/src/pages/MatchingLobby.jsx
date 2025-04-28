import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./MatchingLobby.scss";

export default function MatchingLobby({ uuid, role, field }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("Looking for a match…");
  const [searchParams, setSearchParams] = useSearchParams(); 
  const userId = searchParams.get('userId');
  const tips = [
    "💬 Be ready to introduce yourself!",
    "🎯 Mention what you’re hoping to get out of the session!",
    "💡 You can ask about career paths, tools, or mindset.",
  ];

  useEffect(() => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/match?userId=${userId}`)
        const data = await res.json();
        setMessage("Matches found")
        setMatches(data)
      } catch (err) {
        setMessage("Network error—check your server.");
      }
    }, 3000)
  }, [navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="matching-lobby">
      {matches.length === 0 ? (
        <>
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
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel & Go Back
          </button>
        </>
      ) : (
        <div>
          <h2>Here are your matches</h2>
          {matches.filter(Boolean).map((match, i) => (
            <div key={match.id || `match-${i}`}>
              <p>{match.name}</p>
              <p>Matching interests:</p>
              <ul>
                {match.interests.map((interest, idx) => (
                  <li key={`${interest}-${idx}`}>{interest}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  navigate(`/chat?userId=${userId}&partnerId=${match.id}`);
                }}
              >
                Join Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
