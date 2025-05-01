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
              href="https://www.forbes.com/councils/forbescoachescouncil/2025/03/26/how-to-be-a-great-mentor-20-key-actions/"
              target="_blank"
              rel="noopener noreferrer"
            >
              How To Be A Great Mentor: 14 Key Actions – Forbes
            </a>
          </li>
          <li>
            <a
              href="https://phildeluna.com/making-the-most-of-mentorship/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Making The Most Of Mentorship – Phildeluna
            </a>
          </li>
          <li>
            <a
              href="https://www.themuse.com/advice/how-to-find-a-mentor"
              target="_blank"
              rel="noopener noreferrer"
            >
              10 Tips for Finding a Mentor—and Making the Relationship Count – The Muse
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>🎯 Setting Goals and Measuring Progress</h2>
        <ul>
          <li>
            <a
              href="https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals"
              target="_blank"
              rel="noopener noreferrer"
            >
              5 Ways to Set More Achievable Goals – Harvard Business Review
            </a>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/blog/work-management/goal-setting-templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              10 goal setting templates to achieve your goals – Atlassian
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>💼 Career Growth and Skill Development</h2>
        <ul>
          <li>
            <a
              href="https://www.coursera.org/articles/career-goals"
              target="_blank"
              rel="noopener noreferrer"
            >
              What Are Your Career Goals? Tips for Setting Your Goals – Coursera
            </a>
          </li>
          <li>
            <a
              href="https://www.coursera.org/articles/career-goals"
              target="_blank"
              rel="noopener noreferrer"
            >
              SMART goals template – Coursera
            </a>
          </li>
          <li>
            <a
              href="https://www.themuse.com/advice/in-demand-skills"
              target="_blank"
              rel="noopener noreferrer"
            >
              15 In-Demand Skills to Master in Your Career – The Muse
            </a>
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h2>🧠 Communication and Relationship Building</h2>
        <ul>
          <li>
            <a
              href="https://www.verywellmind.com/what-is-active-listening-3024343"
              target="_blank"
              rel="noopener noreferrer"
            >
              Active Listening Techniques – Verywellmind
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
