<<<<<<< Updated upstream
// src/pages/Session.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Session() {
  const navigate = useNavigate();

  const endSession = () => {
    // session data goes here
    navigate("/feedback");
=======
//controls ChatPage + Feedback Modal
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import Feedback from "../pages/feedback";

function Session() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId"); // You can pass this when starting session
  const [sessionEnded, setSessionEnded] = useState(false);

  const endSession = () => {
    setSessionEnded(true);
  };

  const handleFeedbackSubmit = () => {
    navigate("/"); // Redirect to homepage after feedback
>>>>>>> Stashed changes
  };

  return (
    <div>
<<<<<<< Updated upstream
      <h2>Mentorship Session</h2>
      <p>This is your dedicated session space. Discuss freely!</p>
      {/* will include timer here later */}
      <button onClick={endSession}>End Session</button>
=======
      {!sessionEnded ? (
        <>
          <ChatPage />
          <button onClick={endSession}>End Session</button>
        </>
      ) : (
        <Feedback sessionId={sessionId} onSubmit={handleFeedbackSubmit} />
      )}
>>>>>>> Stashed changes
    </div>
  );
}

export default Session;
