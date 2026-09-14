
import React, { useState } from "react";
import "./Register.css";
import heroImage from "../../assets/hero-image.jpg";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Register = ({
  onClose,
  onSwitchToLogin,
  showWelcomeModal,
  setShowWelcomeModal,
}) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      });

      setShowModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    onClose?.();
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="register-page">
      {/* Main content */}
      <main className="register-main">
        {onClose && (
          <button
            type="button"
            className="page-close"
            onClick={onClose}
            aria-label="Back to home"
          >
            &times;
          </button>
        )}

        <div className="register-image">
          <img
            src={heroImage}
            alt="Woman relaxing on a sofa in a bright, plant-filled room"
          />
        </div>

        <div className="register-form-container">
          <h1>Create Account</h1>

          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } password-toggle`}
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex="0"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              ></i>
            </div>

            {error && <p className="form-error">{error}</p>}

          

            {/* Sign Up button */}
            <button
              type="submit"
              className="btn-secondary sign-up-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up…" : "Sign Up"}
            </button>
          </form>

          <p className="alt-action">
            Already Have An Account?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin?.();
              }}
            >
              Log In
            </a>
          </p>

          <div className="divider">
            <span>Or</span>
          </div>

          <div className="social-icons">
            <i
              className="fa-brands fa-apple"
              aria-label="Continue with Apple"
            ></i>

            <i
              className="fa-brands fa-google"
              aria-label="Continue with Google"
            ></i>

            <i
              className="fa-brands fa-facebook-f"
              aria-label="Continue with Facebook"
            ></i>
          </div>

          <p className="terms-text">
            By Clicking Register Now You Agree To{" "}
            <Link to="/terms-conditions">Terms &amp; Conditions</Link> And{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="modal-overlay" onClick={closeWelcomeModal}>
          <div
            className="modal-box welcome-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close"
              onClick={closeWelcomeModal}
              aria-label="Close"
            >
              &times;
            </button>

            <h2>Welcome To Modimal</h2>

            <p className="welcome-subtitle">
              Elegance In Simplicity, Earth&apos;s Harmony
            </p>

            <h3>Is It Your First Experience On Modimal?</h3>

            <button
              className="btn-primary"
              onClick={closeWelcomeModal}
            >
              Create Your Own Style
            </button>
          </div>
        </div>
      )}

      {/* Verify Email Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>

            <h2>Verify Your Email Address</h2>

            <p>
              We&apos;ve Sent An Email To{" "}
              <strong>
                {formData.email || "Nina@Gmail.Com"}
              </strong>{" "}
              To Verify Your Email Address And Activate Your Account.
              The Link In The Email Will Expire In 24 Hours.
            </p>

            <a
              href="/resend-verification"
              className="resend-link"
            >
              Click Here{" "}
              <span>
                If You Did Not Receive An Email Or Would Like To
                Change The Email Address You Registered With
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;