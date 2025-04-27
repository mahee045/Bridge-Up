//controls ChatPage + Feedback Modal
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import Feedback from "../pages/Feedback";

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
  };

  return (
    <div>
      {!sessionEnded ? (
        <>
          <ChatPage />
          <button onClick={endSession}>End Session</button>
        </>
      ) : (
        <Feedback sessionId={sessionId} onSubmit={handleFeedbackSubmit} />
      )}
    </div>
  );
}

export default Session;
