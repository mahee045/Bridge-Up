import React from "react";
import { useNavigate } from "react-router-dom";

///add emojis to the im a mentor and im a mentee button
//make sure this is usable on multiple screen adjustments
function Landing() {
  const navigate = useNavigate(); // Add this

  const handleSelectRole = (role) => {
    navigate(`/profile-form?role=${role}`);
  };

  return (
    <div>
      <h1>BridgeUp</h1>
      <p>Instant mentorship moments — no login needed.</p>
      <button onClick={() => handleSelectRole("mentor")}>I’m a Mentor</button> 
      <button onClick={() => handleSelectRole("mentee")}>I’m a Mentee</button>
    </div>
  );
}
export default Landing;