// src/pages/Session.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Session() {
  const navigate = useNavigate();

  const endSession = () => {
    // session data goes here
    navigate("/feedback");
  };

  return (
    <div>
      <h2>Mentorship Session</h2>
      <p>This is your dedicated session space. Discuss freely!</p>
      {/* will include timer here later */}
      <button onClick={endSession}>End Session</button>
    </div>
  );
}

export default Session;
