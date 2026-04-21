import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

function StudentProfile() {
  const navigate = useNavigate();

  const student = {
    firstName: "Sophie",
    lastName: "Carter",
    email: "sophie.carter@email.com",
    level: "A-Level Student",
    bio: "Focused on improving in Maths and Physics with regular tutoring sessions and structured revision.",
    plan: "Standard",
    location: "London, UK",
    activeCourses: 3,
    activeTutors: 2,
  };

  return (
    <main className="profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-top">
            <nav className="profile-sidebar-nav">
              <button
                className="profile-sidebar-link"
                onClick={() => navigate("/dashboard/student")}
              >
                Dashboard
              </button>

              <button
                className="profile-sidebar-link"
                onClick={() => navigate("/student/courses")}
              >
                All Courses
              </button>

              <button className="profile-sidebar-link active">
                Profile
              </button>
            </nav>
          </div>

          <div className="profile-sidebar-footer">
            <div className="profile-sidebar-role-box">
              <span className="profile-sidebar-role-label">Current role</span>
              <button className="profile-sidebar-role-button">Student</button>
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
            <h1 className="profile-page-title">Student Profile</h1>

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
                <div className="profile-avatar-large">S</div>

                <div>
                  <h2 className="profile-name-large">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="profile-role-text">{student.level}</p>
                  <p className="profile-rating-text">Plan: {student.plan}</p>
                </div>
              </div>

              <div className="profile-info-section">
                <h3 className="profile-section-title">About</h3>
                <p className="profile-bio">{student.bio}</p>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{student.email}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Level</span>
                  <span className="profile-info-value">{student.level}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Plan</span>
                  <span className="profile-info-value">{student.plan}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Location</span>
                  <span className="profile-info-value">{student.location}</span>
                </div>
              </div>
            </article>

            <aside className="profile-side-card">
              <h3 className="profile-section-title">Overview</h3>

              <div className="profile-stat-list">
                <div className="profile-stat-item">
                  <span className="profile-stat-label">Active courses</span>
                  <span className="profile-stat-value">{student.activeCourses}</span>
                </div>

                <div className="profile-stat-item">
                  <span className="profile-stat-label">Active tutors</span>
                  <span className="profile-stat-value">{student.activeTutors}</span>
                </div>

                <div className="profile-stat-item">
                  <span className="profile-stat-label">Current plan</span>
                  <span className="profile-stat-value">{student.plan}</span>
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

export default StudentProfile;