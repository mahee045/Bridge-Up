import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Landing.scss";
import mentors from "../assets/mentors.png";



function Landing() {
  const navigate = useNavigate();
  const handleSelectRole = (role) => {
    const uuid = uuidv4(); 
    
    navigate(`/profile-form?role=${role}`);
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="brand">BridgeUp</h1>
        <h2 className="tagline">Instant mentorship moments</h2>
        <p className="subtext">No login required. Choose your role to get matched.</p>

        <div className="role-buttons">
          <button onClick={() => handleSelectRole("mentee")}>I'm a Mentee</button>
          <button onClick={() => handleSelectRole("mentor")}>I'm a Mentor</button>
        </div>
      </div>

      <div className="landing-illustration">
  <img src={mentors} alt="Mentorship illustration" />
</div>

    </div>
  );
}

export default Landing;

