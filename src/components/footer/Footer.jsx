
import "./Footer.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
    // Stores the email entered by the user
    const [email, setEmail] = useState("");

    // Stores whether the user agreed to receive emails
    const [agreed, setAgreed] = useState(false);

    // Allows navigation to different pages
    const navigate = useNavigate();

    // Handles the newsletter form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevents submission if the checkbox is not checked
        if (!agreed) {
            alert("Please agree to receive advertising emails.");
            return;
        }

        alert("Thank you for joining our club!");
    };

    return (
        <footer>

            {/* Newsletter subscription section */}
            <div className="join">
                <h3>Join our club, get 15% off for your Birthday</h3>

                <form onSubmit={handleSubmit}>
                    <div className="email-box">

                        {/* Email input controlled by the email state */}
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Submits the form */}
                        <button type="submit">
                            →
                        </button>
                    </div>

                    {/* Checkbox for email agreement */}
                    <label className="agreement">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />

                        <span>
                            By Submitting your email, you agree to receive
                            advertising emails from Modimal.
                        </span>
                    </label>
                </form>

                {/* Social media icons */}
                <div className="socials">
                    <i className="fa-brands fa-instagram"></i>
                    <i className="fa-brands fa-facebook-f"></i>
                    <i className="fa-brands fa-pinterest-p"></i>
                    <i className="fa-brands fa-tiktok"></i>
                </div>

                {/* Copyright information */}
                <p>
                    <i className="fa-regular fa-copyright"></i>
                    2023 modimal. All Rights Reserved.
                </p>
            </div>

            {/* About Modimal links */}
            <div className="about">
                <h3>About Modimal</h3>

                <ul>
                    {/* Navigates to the New In page */}
                    <li
                        onClick={() => navigate("/new-in")}
                        className="footer-link"
                    >
                        New In
                    </li>

                    {/* Navigates to the Sustainability Mission page */}
                    <li
                        onClick={() =>
                            navigate("/sustainability/mission")
                        }
                        className="footer-link"
                    >
                        Sustainability
                    </li>

                    <li onClick={() =>
                            navigate("/privacy-policy")
                        }
                        className="footer-link">Privacy Policy</li>
                        
                    <li  onClick={() =>
                            navigate("/terms-conditions")
                        }
                        className="footer-link">Terms & Condition</li>
                </ul>
            </div>

            {/* Help and support links */}
            <div className="help">
                <h3>Help & Support</h3>

                <ul>
                    <li onClick={() => navigate("/refund-policy")}
                        className="footer-link">Returns & Refunds</li>

                    {/* Navigates to the FAQs page */}
                    <li
                        onClick={() => navigate("/faqs")}
                        className="footer-link"
                    >
                        FAQs
                    </li>

                    {/* Navigates to the Contact Us page */}
                    <li
                        onClick={() => navigate("/contact-us")}
                        className="footer-link"
                    >
                        Contact Us
                    </li>
                </ul>
            </div>

            {/* Join Up section */}
            <div className="join-up">
                <h3>Join Up</h3>

                <ul>
                    <li>Modimal Club</li>
                    <li>Visit Us</li>
                </ul>

                {/* Message/chat icon */}
                <i className="fa-solid fa-message"></i>
            </div>

        </footer>
    );
}

export default Footer;

