import React from "react";
import "./PageStyles.scss";

function AboutUs() {
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>About Us</h1>
        <p>
          <strong>BridgeUp</strong> is built on the belief that mentorship can change lives. Our mission is to connect individuals in meaningful ways and help them grow both personally and professionally through supportive mentorship relationships.
        </p>

        <p>
          This platform was created by three aspiring web developers  <strong>Mariam</strong>, <strong>Hajirah</strong>, and <strong>Maheerah</strong> as their final project at the <strong>Lighthouse Labs Web Development Bootcamp</strong>. With little to no prior coding experience, they entered the program with determination and curiosity.
        </p>

        <p>
          What helped them succeed? Mentorship. With the support of dedicated mentors available throughout the bootcamp and the support of the <strong>Women in Tech</strong> program by <strong>IDRF</strong>, they were able to overcome challenges, learn fast, and build something meaningful.
        </p>

        <p>
          BridgeUp is not just a product, it is a reflection of the journey that mentorship made possible. It’s built by mentees, inspired by mentors, and designed to pass it forward.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
