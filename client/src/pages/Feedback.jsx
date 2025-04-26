<<<<<<< Updated upstream
import React, { useState } from "react";

function Feedback() {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
=======
import React, { useState, useEffect } from "react";

function Feedback({ onSubmit, sessionId }) {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [fromUserId, setFromUserId] = useState(null); // <-- NEW

  useEffect(() => {
    // Pull user ID from localStorage when component loads
    const userId = localStorage.getItem("userId");
    if (userId) {
      setFromUserId(userId);
    } else {
      console.error("⚠️ No userId found in localStorage");
    }
  }, []);

  const handleSubmit = async () => {
>>>>>>> Stashed changes
    if (!rating || !comments.trim()) {
      alert("Please fill out all fields.");
      return;
    }

<<<<<<< Updated upstream
    console.log("📩 Feedback submitted:", { rating, comments });

    // replace with api call
    alert("Thanks for your feedback!");
  };

  return (
    <div>
      <h2>Session Feedback</h2>
=======
    if (!fromUserId) {
      alert("User ID missing. Please log in again.");
      return;
    }

    const feedbackData = {
      session_id: sessionId,
      rating: Number(rating),
      message: comments,
      from_user_id: Number(fromUserId), // <-- will use the dynamic ID here
    };

    console.log("📩 Submitting feedback:", feedbackData);

    try {
      const response = await fetch("http://localhost:3001/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        alert("Thanks for your feedback!");
        if (onSubmit) {
          onSubmit(); // Go back or move to next step
        }
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="feedback-page">
      <h2>Session Feedback</h2>

>>>>>>> Stashed changes
      <label>How was your session?</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="">Select</option>
        <option value="5">🌟 Excellent</option>
        <option value="4">👍 Good</option>
        <option value="3">🙂 Okay</option>
        <option value="2">😕 Meh</option>
        <option value="1">👎 Poor</option>
      </select>

      <div>
        <label>Additional Comments</label>
        <textarea
<<<<<<< Updated upstream
          placeholder="What went well? What can improve?"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Submit Feedback</button>
=======
          placeholder="What went well? What could improve?"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
        />
      </div>

      <button onClick={handleSubmit} className="submit-btn">
        Submit Feedback
      </button>
>>>>>>> Stashed changes
    </div>
  );
}

export default Feedback;
