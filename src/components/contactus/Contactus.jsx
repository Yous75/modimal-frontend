import { useState } from "react";
import { Link } from "react-router-dom";
import { submitContactMessage } from "../../api/contact";
import "./Contactus.css";

function Contactus() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    orderNumber: "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please confirm you have read and understood the Contact Us Privacy And Policy.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitContactMessage(formData);
      alert("Thank you! Your message has been sent.");
      setFormData({ fullName: "", email: "", subject: "", orderNumber: "", message: "" });
      setAgreed(false);
    } catch (err) {
      setSubmitError("Something went wrong sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contactus">
      {/* Breadcrumb */}
      <div className="contactus-breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <span className="current">Contact Us</span>
      </div>

      {/* Header */}
      <h1 className="contactus-title">Contact Us</h1>

      {/* Intro banner */}
      <div className="contactus-banner">
        <p>
          We Always Love Hearing From Our Customers! Please Do Not Hesitate To Contact Us
          Should You Have Any Questions Regarding Our Products And Sizing Recommendations Or
          Inquiries About Your Current Order.
        </p>
        <p>
          Contact Our Customer Care Team Through The Contact Form Below, Email Us At{" "}
          <a href="mailto:hello@modimal.com">Hello@Modimal.Com</a> Or Live Chat With Us Via Our
          Chat Widget On The Bottom Right Hand Corner Of This Page.
        </p>
        <p>We Will Aim To Respond To You Within 1-2 Business Days.</p>
      </div>

      {/* Form section */}
      <div className="contactus-form-section">
        <h2 className="write-us-heading">
          <i className="fa-regular fa-envelope"></i> Write Us
        </h2>
        <h3 className="your-information">Your Information</h3>

        <form onSubmit={handleSubmit} className="contactus-form">
          <div className="form-field">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Subject
              </option>
              <option value="order">Order Inquiry</option>
              <option value="sizing">Sizing Recommendation</option>
              <option value="returns">Returns & Refunds</option>
              <option value="product">Product Question</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <input
              type="text"
              name="orderNumber"
              placeholder="Order Number"
              value={formData.orderNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <input
              type="text"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <label className="privacy-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I Have Read And Understood The Contact Us Privacy And Policy.</span>
          </label>

          {submitError && <p className="contactus-form-error">{submitError}</p>}

          <div className="submit-row">
            <button type="submit" className="send-btn" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom cards */}
      <div className="contactus-cards">
        <div className="contact-card">
          <i className="fa-regular fa-comment-dots card-icon"></i>
          <h4>Chat With Us</h4>
          <p>We Are Here And Ready To Chat</p>
          <button className="card-btn" type="button">
            Start Chat
          </button>
        </div>

        <div className="contact-card">
          <i className="fa-solid fa-address-card card-icon"></i>
          <h4>Call Us</h4>
          <p>We're Here To Talk To You</p>
          <div className="card-box">+1(929)460-3208</div>
        </div>

        <div className="contact-card">
          <i className="fa-regular fa-envelope card-icon"></i>
          <h4>Email Us</h4>
          <p>You Are Welcome To Send Us An Email</p>
          <a href="mailto:hello@modimal.com" className="card-btn">
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contactus;