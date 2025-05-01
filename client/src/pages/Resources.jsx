import React from "react";
import "./PageStyles.scss";

function Resources() {
  return (
    <div className="page-container">
      <h1>Resources</h1>
      <p>
        Explore curated resources to support your mentorship journey. Whether you're a mentor or a mentee, these career tips, growth strategies, and learning materials will guide you through every step.
      </p>

      <div className="resource-section">
        <h2>🌱 Getting Started with Mentorship</h2>
        <ul>
          <li>
            <a
              href="https://www.forbes.com/sites/forbescoachescouncil/2021/04/19/13-ways-to-become-an-exceptional-mentor/"
              target="_blank"
              rel="noopener noreferrer"
            >
              13 Ways to Become an Exceptional Mentor – Forbes
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/pulse/how-make-most-your-mentorship-program-anthony-liew/"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Make the Most of Your Mentorship – LinkedIn
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>🎯 Setting Goals and Measuring Progress</h2>
        <ul>
          <li>
            <a
              href="https://hbr.org/2020/01/the-right-way-to-hold-people-accountable"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Right Way to Set Goals and Be Accountable – Harvard Business Review
            </a>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/blog/productivity/smart-goals"
              target="_blank"
              rel="noopener noreferrer"
            >
              Setting SMART Goals: Examples and Templates – Atlassian
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>💼 Career Growth and Skill Development</h2>
        <ul>
          <li>
            <a
              href="https://www.coursera.org/articles/how-to-set-career-goals"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Set Meaningful Career Goals – Coursera
            </a>
          </li>
          <li>
            <a
              href="https://www.themuse.com/advice/20-things-every-professional-should-know-how-to-do-by-age-30"
              target="_blank"
              rel="noopener noreferrer"
            >
              20 Skills to Master in Your Career – The Muse
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>🧠 Communication and Relationship Building</h2>
        <ul>
          <li>
            <a
              href="https://www.mindtools.com/CommSkll/ActiveListening.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Active Listening Techniques – MindTools
            </a>
          </li>
          <li>
            <a
              href="https://www.toastmasters.org/resources/public-speaking-tips"
              target="_blank"
              rel="noopener noreferrer"
            >
              Public Speaking Tips – Toastmasters
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Resources;
