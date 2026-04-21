import LoginForm from "../components/LoginForm";
import "../styles/LoginPage.css";
import illustration from "../assets/register-illustration.png";
import logo from "../assets/logo_small.png";

function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-background">
        <img
          src={illustration}
          alt="Tutoring platform illustration"
          className="login-background-illustration"
        />

        <div className="login-card">
          <div className="login-brand">
            <img src={logo} alt="Tutornet logo" className="login-brand-logo-img" />
            <span className="login-brand-name">TUTORNET</span>
          </div>

          <h1 className="login-title">Connect. Learn. Grow.</h1>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}

export default LoginPage;