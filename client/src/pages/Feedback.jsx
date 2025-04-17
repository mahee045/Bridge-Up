import React, { useState } from "react";

function Feedback() {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    if (!rating || !comments.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("📩 Feedback submitted:", { rating, comments });

    // replace with api call
    alert("Thanks for your feedback!");
  };

  return (
    <div>
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
          placeholder="What went well? What can improve?"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
}

export default Feedback;
