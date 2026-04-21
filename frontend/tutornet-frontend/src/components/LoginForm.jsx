import { useState } from "react";
import googleIcon from "../assets/google-icon.png";
import { useNavigate } from "react-router-dom";


const initialForm = {
  email: "",
  password: "",
  rememberMe: false,
};

function LoginForm() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitMessage("");
      return;
    }

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
      rememberMe: formData.rememberMe,
    };

    console.log("Login form submitted:", payload);

    setSubmitMessage("Login form works. Back-end is not connected yet.");
    setErrors({});
  }

  function handleForgotPassword() {
    alert("Forgot password flow is not connected yet.");
  }

  function handleGoogleLogin() {
    alert("Google sign-in is not connected yet.");
  }

function handleGoToRegister() {
  navigate("/register");
}

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form-group">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "login-input login-error-input" : "login-input"}
        />
        {errors.email && <p className="login-error-text">{errors.email}</p>}
      </div>

      <div className="login-row">
        <div className="login-password-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "login-input login-error-input" : "login-input"}
          />
          {errors.password && <p className="login-error-text">{errors.password}</p>}
        </div>

        <button
          type="button"
          className="forgot-password-button"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      <div className="remember-row">
        <label className="remember-label">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Remember me</span>
        </label>
      </div>

      <button type="submit" className="login-submit-button">
        Login
      </button>

      <div className="login-divider" />

      <div className="login-footer">
        <p className="login-footer-text">Don't have an account?</p>

        <button
          type="button"
          className="go-register-button"
          onClick={handleGoToRegister}
        >
          Create account
        </button>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
        >
          <img src={googleIcon} alt="Google" className="google-icon" />
        </button>
      </div>

      {submitMessage && <p className="login-success-text">{submitMessage}</p>}
    </form>
  );
}

export default LoginForm;