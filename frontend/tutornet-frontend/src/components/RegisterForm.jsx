import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  password: "",
  agreeToTerms: false,
};

function RegisterForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

function handleGoToLogin() {
  navigate("/login");
}

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms and Conditions.";
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

  function handleRoleChange(selectedRole) {
    setRole(selectedRole);
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
      role,
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    console.log("Registration form submitted:", payload);

    setSubmitMessage("Account created successfully. Front-end form is working.");
    setErrors({});
    setFormData(initialForm);
    setRole("student");
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="role-toggle">
        <button
          type="button"
          className={`role-button ${role === "student" ? "active" : ""}`}
          onClick={() => handleRoleChange("student")}
        >
          I am a Student
        </button>

        <button
          type="button"
          className={`role-button ${role === "tutor" ? "active" : ""}`}
          onClick={() => handleRoleChange("tutor")}
        >
          I am a Tutor
        </button>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "input error-input" : "input"}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input error-input" : "input"}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input error-input" : "input"}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          <span>I agree to Terms and Conditions</span>
        </label>
        {errors.agreeToTerms && (
          <p className="error-text checkbox-error">{errors.agreeToTerms}</p>
        )}
      </div>

      <button type="submit" className="submit-button">
        Create Account
      </button>

      <p className="register-footer-text">
  Already have an account?
</p>

<button
  type="button"
  className="go-login-button"
  onClick={handleGoToLogin}
>
  Login
</button>

      {submitMessage && <p className="success-text">{submitMessage}</p>}
    </form>
  );
}

export default RegisterForm;