import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

///add emojis to the im a mentor and im a mentee button
//make sure this is usable on multiple screen adjustments
function Landing() {
  const navigate = useNavigate(); // Add this

  const handleSelectRole = (role) => {
    const userId = uuidv4();
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
    console.log("User ID saved:", userId);         // ✅ See this in dev tools
    console.log("Role selected:", role);
    navigate("/profile-form");
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