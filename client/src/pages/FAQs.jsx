import React, { useState } from "react";
import "./PageStyles.scss";

const faqData = [
  {
    question: "1. How do I become a mentor or mentee on BridgeUp?",
    answer: "Simply choose whether you’d like to be a mentor or a mentee and complete your profile. Once matched, you’ll be guided into a session.",
  },
  {
    question: "2. Is there a cost to use BridgeUp?",
    answer: "BridgeUp is free to use. Our goal is to make mentorship accessible to everyone, regardless of their background or experience level.",
  },
  {
    question: "3. How are mentors and mentees matched?",
    answer: "We use a combination of shared interests, professional goals, and availability to match mentors with mentees for the most productive sessions.",
  },
  {
    question: "4. What topics can I discuss during a session?",
    answer: "You can discuss career goals, personal development, networking, industry insights, or even resume feedback. It’s your time—make it count!",
  },
  {
    question: "5. How long is each mentorship session?",
    answer: "Sessions typically last around 20–30 minutes, but the length can vary depending on the user availability.",
  },
  {
    question: "6. Can I cancel a session?",
    answer: "You can cancel a session. Please try to notify the other party in advance out of respect for their time.",
  },
  {
    question: "7. Is my information and conversation private?",
    answer: "Yes. Your information is secure, and your conversations are private between you and your match. We don’t share personal details publicly.",
  },
  {
    question: "8. What if my mentor/mentee is unresponsive or inappropriate?",
    answer: "You can report any issues directly through the platform. We take user safety seriously and will review concerns immediately.",
  },
  {
    question: "9. Do I need to prepare for a mentorship session?",
    answer: "A little preparation helps! Think of a few questions or topics you'd like to discuss, and be ready to introduce yourself briefly.",
  },
  {
    question: "10. Can I leave feedback after a session?",
    answer: "Absolutely. After each session, you’ll be prompted to provide feedback to help improve the platform and user experience.",
  },
];

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h1>Frequently Asked Questions</h1>
        <p>Have questions about how BridgeUp works? Find answers to the most commonly asked questions here. Still curious? Reach out to us anytime!</p>

        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span style={{ float: "right", fontWeight: "normal", fontSize: "1.2rem" }}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </h3>
              {openIndex === index && <p>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQs;
