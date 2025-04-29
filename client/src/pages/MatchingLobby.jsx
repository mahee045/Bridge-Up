import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MatchingLobby.scss";

export default function MatchingLobby() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("Looking for a match…");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchParams] = useSearchParams();

  // Get the current user's ID and username from the URL parameters
  const userId = searchParams.get('userId');
  const userName = searchParams.get('userName'); // <-- Important to also get the user's own name

  // Helpful tips shown while waiting for a match
  const tips = [
    "💬 Be ready to introduce yourself!",
    "🎯 Mention what you’re hoping to get out of the session!",
    "💡 You can ask about career paths, tools, or mindset.",
  ];

  // Fetch potential matches from the server
  useEffect(() => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/match?userId=${userId}`);
        const data = await res.json();
        setMessage("Matches found");
        setMatches(data);
      } catch (err) {
        console.error(err);
        setMessage("Network error—check your server.");
      }
    }, 3000); // Simulate a 3-second matching wait
  }, [navigate, userId]);

  // Handle cancellation: remove user from match queue and return to home
  const handleCancel = async () => {
    const queueId = localStorage.getItem("queueId");
    if (queueId) {
      try {
        await fetch(`http://localhost:3001/match-queue/${queueId}`, {
          method: "DELETE",
        });
        localStorage.removeItem("queueId");
      } catch (error) {
        console.error("Failed to remove user from queue:", error);
      }
    }
    navigate("/");
  };

  return (
    <div className="matching-lobby">
      {/* Show loading spinner while searching for matches */}
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

          {/* Helpful tips for user while waiting */}
          <div className="tips-box">
            <h3>Tips while you wait:</h3>
            <ul>
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Cancel and go back button */}
          <button onClick={handleCancel} className="cancel-btn">
            Cancel & Go Back
          </button>
        </>
      ) : (
        <div className="matches-list">
          <h2 className="title">Your Matches</h2>

          {/* List all matched users */}
          {matches.filter(Boolean).map((match, i) => (
            <div
              key={match.id || `match-${i}`}
              className="match-card"
              onClick={() => setSelectedMatch(match)} // Open modal on card click
              style={{ cursor: "pointer", border: "1px solid #ccc", padding: 10, margin: 8 }}
            >
              <p>
                <strong>{match.role === "mentor" ? "Mentor Name:" : "Mentee Name:"}</strong> {match.name}
              </p>
              <p>Matching interests:</p>
              <ul>
                {match.interests.map((interest, idx) => (
                  <li key={`${interest}-${idx}`}>{interest}</li>
                ))}
              </ul>

              {/* Direct join button without opening modal */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening the modal if button clicked
                  navigate(`/chat?userId=${userId}&partnerId=${match.user_id}&userName=${userName}&partnerName=${match.name}`);
                }}
              >
                Join Chat
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for selected match details */}
      {selectedMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedMatch.name}</h2>

            <p><strong>Matching Interests:</strong></p>
            <ul>
              {selectedMatch.interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>

            <p><strong>Bio:</strong> {selectedMatch.bio}</p>

            <div className="modal-buttons">
              {/* Join chat via modal */}
              <button
                className="join-btn"
                onClick={() => navigate(`/chat?userId=${userId}&partnerId=${selectedMatch.user_id}&userName=${userName}&partnerName=${selectedMatch.name}`)}
              >
                Join Chat
              </button>

              {/* Close modal */}
              <button
                className="cancel-btn"
                onClick={() => setSelectedMatch(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
