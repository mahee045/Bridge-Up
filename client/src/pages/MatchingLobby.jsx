import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MatchingLobby.scss";

export default function MatchingLobby() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [message, setMessage] = useState("Looking for a match…");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchParams] = useSearchParams();
  const [noMatchFound, setNoMatchFound] = useState(false);

  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const userRole = searchParams.get("role");

  const tips = [
    "💬 Be ready to introduce yourself!",
    "🎯 Mention what you’re hoping to get out of the session!",
    "💡 You can ask about career paths, tools, or mindset.",
  ];

  // Fetch current user interests
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}`);
        const data = await res.json();
        setUserInterests(data.interests || []);
      } catch (error) {
        console.error("Failed to fetch user interests:", error);
      }
    }

    if (userId) fetchUser();
  }, [userId]);

  // Fetch potential matches
  useEffect(() => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/match?userId=${userId}`);
        const data = await res.json();
        if (data.length === 0) {
          setNoMatchFound(true);
          setMessage("😞 No matches found. Please click Cancel.");
        } else {
          setMatches(data);
          setMessage("Matches found");
        }
      } catch (err) {
        console.error(err);
        setMessage("Network error—check your server.");
      }
    }, 3000);
  }, [navigate, userId]);

  // Handle cancel
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

  // Compute sorted matches based on shared interests
  const sortedMatches = [...matches]
    .map(match => {
      const shared = match.interests.filter(interest =>
        userInterests.includes(interest)
      );
      return { ...match, sharedInterests: shared };
    })
    .sort((a, b) => b.sharedInterests.length - a.sharedInterests.length);

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
          <p className="subtitle">
            {noMatchFound
              ? "No one is available right now."
              : "Hang tight! We’re finding someone for you."}
          </p>

          {!noMatchFound && (
            <div className="tips-box">
              <h3>Tips while you wait:</h3>
              <ul>
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleCancel} className="cancel-btn">
            Cancel & Go Back
          </button>
        </>
      ) : (
        <div className="matches-list">
          <h2 className="title">✨Your Matches✨</h2>

          {sortedMatches.map((match, i) => (
            <div
              key={match.id || `match-${i}`}
              className="match-card"
              onClick={() => setSelectedMatch(match)}
              style={{ cursor: "pointer", border: "1px solid #ccc", padding: 10, margin: 8 }}
            >
              <p>
                <strong>{match.role === "mentor" ? "Mentor Name:" : "Mentee Name:"}</strong> {match.name}
              </p>
              <p><em>💡{match.sharedInterests.length} Shared Interest{match.sharedInterests.length !== 1 ? "s" : ""}</em></p>
              <p>Matching interests:</p>
              <ul>
                {match.interests.map((interest, idx) => (
                  <li key={`${interest}-${idx}`}>
                    {match.sharedInterests.includes(interest) ? (
                      <strong>❤️{interest}</strong>
                    ) : (
                      interest
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

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
              <button
                className="join-btn"
                onClick={() =>
                  navigate(
                    `/chat?userId=${userId}&partnerId=${selectedMatch.user_id}&userName=${userName}&userRole=${userRole}&partnerName=${selectedMatch.name}&partnerRole=${selectedMatch.role}`
                  )
                }
              >
                Join Chat
              </button>

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
