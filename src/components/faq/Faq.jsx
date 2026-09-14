import { useState } from "react";
import { Link } from "react-router-dom";
import "./Faq.css";

const FAQ_DATA = [
  {
    question: "How Do I Contact Your Customer Service?",
    answer:
      "Our Modimal Customer Service Team Is Available Monday Through Friday, 9 AM - 5 PM ET, Excluding Holidays. You Can Reach Us Via Email At Hello@Modimal.Com (Preferred And Our Fastest Response), Via Chat Using The Icon In The Right Bottom Cornern Of Our Website, Or Via Voicemail At +1(929) 460-3208. We Will Make Sure To Get Back To You Within 24 Business Hours.",
  },
  {
    question: "When Will My Order Ship?",
    answer:
      "Orders Are Typically Processed Within 1-2 Business Days. Once Shipped, You Will Receive A Confirmation Email With Tracking Information So You Can Follow Your Package Every Step Of The Way.",
  },
  {
    question: "Can I Cancel Or Modify My Order?",
    answer:
      "You Can Cancel Or Modify Your Order Within 12 Hours Of Placing It By Contacting Our Customer Service Team. Once An Order Has Entered Processing, We Are Unable To Make Changes.",
  },
  {
    question: "What Are My Shipping Options?",
    answer:
      "We Offer Standard, Expedited, And Express Shipping At Checkout. Delivery Times And Rates Vary By Destination And Will Be Calculated Before You Complete Your Purchase.",
  },
  {
    question: "What Type Of Payment Methods Do You Offer?",
    answer:
      "We Accept All Major Credit And Debit Cards, PayPal, Apple Pay, And Google Pay. All Transactions Are Processed Securely At Checkout.",
  },
  {
    question: "Which Size Will Fit Me Best?",
    answer:
      'We Offer Product And Body Measurements On Each Of Our Products Pages, Just Click On "Size Guide" To Find Your Best Fit. Measuring Guides Are Included.',
  },
  {
    question: "How Do I Take Care Of My Modimal Pieces?",
    answer:
      "Care Instructions Are Listed On The Label Of Each Garment As Well As On Its Product Page. In General, We Recommend Gentle, Cold-Water Washing And Air Drying To Preserve Fabric Quality.",
  },
  {
    question: "Where And How Do You Manufacture Your Products?",
    answer:
      "Our Products Are Manufactured In Small, Independently Owned Facilities That Meet Our Standards For Ethical Labor Practices And Environmental Responsibility.",
  },
  {
    question: "How Do You Find And Evaluate Your Suppliers?",
    answer:
      "We Vet Every Supplier Through An On-Site Assessment Covering Labor Conditions, Material Sourcing, And Environmental Impact Before We Begin Working With Them, And We Re-Evaluate Regularly.",
  },
  {
    question: "How Do Your Suppliers Support Their Workers?",
    answer:
      "Our Partner Facilities Provide Fair Wages, Safe Working Conditions, And Reasonable Hours In Line With International Labor Standards, Which We Monitor Through Ongoing Audits.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-page">
      <nav className="faq-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <span className="faq-breadcrumb-sep">/</span>
        <span className="faq-breadcrumb-current">FAQs</span>
      </nav>

      <h1 className="faq-heading">FAQs</h1>

      <div className="faq-list">
        {FAQ_DATA.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="faq-item" key={item.question}>
              <button
                className={`faq-question ${isOpen ? "is-open" : ""}`}
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  {isOpen ? "\u2212" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Faq;