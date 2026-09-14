
import React, { useState } from "react";
import "./Login.css";
import heroImage from "../../assets/hero-image.jpg";
import { useAuth } from "../../context/AuthContext";

const Login = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      await login({
        email: formData.email,
        password: formData.password,
      });

      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {/* Main content */}
      <main className="login-main">
        <div className="login-image">
          <img
            src={heroImage}
            alt="Woman relaxing on a sofa in a bright, plant-filled room"
          />
        </div>

        <div className="login-form-container">
          <h1>Log In</h1>

          <form onSubmit={handleSubmit} className="login-form">
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

            <a href="/forgot-password" className="forgot-link">
              Forgot Your Password?
            </a>

            {error && <p className="form-error">{error}</p>}

            
             {/* Sign In button */}
          <button
            type="button"
            className="btn-secondary sign-in-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In…" : "Sign In"}
          </button>
          </form>

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

         

          <p className="alt-action">
            New To Modimal?{" "}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister?.();
              }}
            >
              Create An Account
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;