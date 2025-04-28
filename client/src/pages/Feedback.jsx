import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import "./Feedback.scss";

function Feedback() {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [fromUserId, setFromUserId] = useState(null);
  const [partnerUserId, setPartnerUserId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get('from_user_id');
    const partnerId = searchParams.get('partner_user_id');

    if (userId && partnerId) {
      setFromUserId(userId);
      setPartnerUserId(partnerId);
    } else {
      console.error("⚠️ Missing userId or partnerId in URL");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comments.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    if (!fromUserId || !partnerUserId) {
      alert("User IDs missing. Please log in again.");
      return;
    }

    const feedbackData = {
      from_user_id: fromUserId,
      partner_user_id: partnerUserId,
      message: comments,
      rating: Number(rating),
    };

    try {
      const response = await fetch("http://localhost:3001/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error connecting to server.");
    }
  };

  const handleReturnHome = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="feedback-page">
      <h2>Session Feedback</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">How was your session?</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="5">🌟 Excellent</option>
            <option value="4">👍 Good</option>
            <option value="3">🙂 Okay</option>
            <option value="2">😕 Meh</option>
            <option value="1">👎 Poor</option>
          </select>
        </div>

        <div>
          <label htmlFor="comments">Additional Comments</label>
          <textarea
            id="comments"
            placeholder="What went well? What could improve?"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <h3>Thank you for your feedback!</h3>
            <button onClick={handleReturnHome} className="return-home-btn">
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
