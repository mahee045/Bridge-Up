import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.scss";
import BridgeLogo from "../assets/BridgeLogo.png"; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={BridgeLogo} alt="BridgeUp Logo" className="logo-img" />
        <span className="logo-text">BridgeUp</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/community">Our Community</Link></li>
        <li><Link to="/resources">Resources</Link></li>
        <li><Link to="/faqs">FAQs</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;