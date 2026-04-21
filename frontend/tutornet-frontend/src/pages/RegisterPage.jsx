import RegisterForm from "../components/RegisterForm";
import "../styles/RegisterPage.css";
import illustration from "../assets/register-illustration.png";
import logo from "../assets/logo_small.png";

function RegisterPage() {
  return (
    <main className="register-page">
      <div className="register-background">
        <img
          src={illustration}
          alt="Tutoring platform illustration"
          className="background-illustration"
        />

        <div className="register-card">
          <div className="brand">
            <img src={logo} alt="Tutornet logo" className="brand-logo-img" />
            <span className="brand-name">TUTORNET</span>
          </div>

          <h1 className="register-title">Connect. Learn. Grow.</h1>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;