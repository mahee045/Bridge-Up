import React from "react";
import "./PageStyles.scss";

function FAQs() {
  return (
    <div className="page-container">
      <h1>Frequently Asked Questions</h1>
      <p>Have questions about how BridgeUp works? Find answers to the most commonly asked questions here. 
         Still curious? Reach out to us anytime!</p>
         <div className="faq-list">
        
        <h3>1. How do I become a mentor or mentee on BridgeUp?</h3>
        <p>Simply choose whether you’d like to be a mentor or a mentee and complete your profile. Once matched, you’ll be guided into a session.</p>

        <h3>2. Is there a cost to use BridgeUp?</h3>
        <p>BridgeUp is free to use. Our goal is to make mentorship accessible to everyone, regardless of their background or experience level.</p>

        <h3>3. How are mentors and mentees matched?</h3>
        <p>We use a combination of shared interests, professional goals, and availability to match mentors with mentees for the most productive sessions.</p>

        <h3>4. What topics can I discuss during a session?</h3>
        <p>You can discuss career goals, personal development, networking, industry insights, or even resume feedback. It’s your time—make it count!</p>

        <h3>5. How long is each mentorship session?</h3>
        <p>Sessions typically last around 20–30 minutes, but the length can vary depending on the user availability.</p>

        <h3>6. Can I cancel a session?</h3>
        <p>You can cancel a session. Please try to notify the other party in advance out of respect for their time.</p>

        <h3>7. Is my information and conversation private?</h3>
        <p>Yes. Your information is secure, and your conversations are private between you and your match. We don’t share personal details publicly.</p>

        <h3>8. What if my mentor/mentee is unresponsive or inappropriate?</h3>
        <p>You can report any issues directly through the platform. We take user safety seriously and will review concerns immediately.</p>

        <h3>9. Do I need to prepare for a mentorship session?</h3>
        <p>A little preparation helps! Think of a few questions or topics you'd like to discuss, and be ready to introduce yourself briefly.</p>

        <h3>10. Can I leave feedback after a session?</h3>
        <p>Absolutely. After each session, you’ll be prompted to provide feedback to help improve the platform and user experience.</p>

      </div>
    </div>
  );
}

export default FAQs;
