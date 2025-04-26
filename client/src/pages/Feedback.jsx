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
    if (!rating || !comments.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    if (!fromUserId) {
      alert("User ID missing. Please log in again.");
      return;
    }

    const feedbackData = {
      session_id: sessionId,
      rating: Number(rating),
      message: comments,
      from_user_id: Number(fromUserId), // <-- will use dynamic ID here
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
          placeholder="What went well? What could improve?"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
        />
      </div>

      <button onClick={handleSubmit} className="submit-btn">
        Submit Feedback
      </button>
    </div>
  );
}

export default Feedback;
