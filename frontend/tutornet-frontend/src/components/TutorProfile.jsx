import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

function TutorProfile() {
  const navigate = useNavigate();

  const tutor = {
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@tutornet.com",
    subject: "Physics",
    bio: "Experienced tutor focused on helping students understand concepts clearly and build confidence step by step.",
    rating: "4.9 / 5.0",
    experience: "4 years",
    location: "London, UK",
    lessonsCompleted: 128,
  };

  return (
    <main className="profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-top">
            <nav className="profile-sidebar-nav">
              <button
                className="profile-sidebar-link"
                onClick={() => navigate("/dashboard/tutor")}
              >
                Dashboard
              </button>

              <button
                className="profile-sidebar-link"
                onClick={() => navigate("/tutor/courses")}
              >
                My Courses
              </button>

              <button className="profile-sidebar-link active">
                Profile
              </button>
            </nav>
          </div>

          <div className="profile-sidebar-footer">
            <div className="profile-sidebar-role-box">
              <span className="profile-sidebar-role-label">Current role</span>
              <button className="profile-sidebar-role-button">Tutor</button>
            </div>

            <button
              className="profile-sidebar-logout-button"
              onClick={() => navigate("/login")}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="profile-main">
          <header className="profile-header">
            <h1 className="profile-page-title">Tutor Profile</h1>

            <div className="profile-header-brand">
              <img
                src={logoSmall}
                alt="Tutornet logo"
                className="profile-header-logo"
              />
            </div>
          </header>

          <section className="profile-content-grid">
            <article className="profile-main-card">
              <div className="profile-hero">
                <div className="profile-avatar-large">A</div>

                <div>
                  <h2 className="profile-name-large">
                    {tutor.firstName} {tutor.lastName}
                  </h2>
                  <p className="profile-role-text">{tutor.subject} Tutor</p>
                  <p className="profile-rating-text">Rating: {tutor.rating}</p>
                </div>
              </div>

              <div className="profile-info-section">
                <h3 className="profile-section-title">About</h3>
                <p className="profile-bio">{tutor.bio}</p>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{tutor.email}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Subject</span>
                  <span className="profile-info-value">{tutor.subject}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Experience</span>
                  <span className="profile-info-value">{tutor.experience}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Location</span>
                  <span className="profile-info-value">{tutor.location}</span>
                </div>
              </div>
            </article>

            <aside className="profile-side-card">
              <h3 className="profile-section-title">Overview</h3>

              <div className="profile-stat-list">
                <div className="profile-stat-item">
                  <span className="profile-stat-label">Lessons completed</span>
                  <span className="profile-stat-value">{tutor.lessonsCompleted}</span>
                </div>

                <div className="profile-stat-item">
                  <span className="profile-stat-label">Rating</span>
                  <span className="profile-stat-value">{tutor.rating}</span>
                </div>

                <div className="profile-stat-item">
                  <span className="profile-stat-label">Main subject</span>
                  <span className="profile-stat-value">{tutor.subject}</span>
                </div>
              </div>

              <div className="profile-action-group">
                <button className="profile-action-button">Edit profile</button>
                <button className="profile-secondary-button">Change password</button>
              </div>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}

export default TutorProfile;