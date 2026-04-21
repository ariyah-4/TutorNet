import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

const stats = [
  {
    title: "Upcoming Lessons",
    value: "5",
    highlight: true,
    subtitle: "This week",
  },
  {
    title: "Assignments Due",
    value: "3",
    subtitle: "To complete",
  },
  {
    title: "Active Tutors",
    value: "2",
    subtitle: "Current tutors",
  },
];

const lessons = [
  {
    date: "April 2",
    time: "4:30 PM",
    subject: "Physics",
    tutor: "Alex Smith",
    status: "Confirmed",
  },
  {
    date: "April 4",
    time: "6:00 PM",
    subject: "Maths",
    tutor: "Sarah Lee",
    status: "Confirmed",
  },
  {
    date: "April 8",
    time: "4:30 PM",
    subject: "Physics",
    tutor: "Alex Smith",
    status: "Confirmed",
  },
];

const calendarDays = [
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ["30", "31", "1", "2", "3", "4", "5"],
  ["6", "7", "8", "9", "10", "11", "12"],
  ["13", "14", "15", "16", "17", "18", "19"],
  ["20", "21", "22", "23", "24", "25", "26"],
  ["27", "28", "29", "30", "31", "1", "2"],
];

function StudentDashboard() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();

  return (
    <main className="student-dashboard-page">
      <div className="student-dashboard-layout">
        <aside className="student-dashboard-sidebar">
          <div className="student-sidebar-top">
            <nav className="student-sidebar-nav">
              <button
                className="student-sidebar-link active"
                onClick={() => navigate("/dashboard/student")}
              >
                Dashboard
              </button>

              <button
                className="student-sidebar-link"
                onClick={() => navigate("/student/courses")}
              >
                All Courses
              </button>

              <button
                className="student-sidebar-link"
                onClick={() => navigate("/student/profile")}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="student-sidebar-footer">
            <div className="student-sidebar-role-box">
              <span className="student-sidebar-role-label">Current role</span>
              <button className="student-sidebar-role-button">Student</button>
            </div>

            <button
              className="student-sidebar-logout-button"
              onClick={() => navigate("/login")}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="student-dashboard-main">
          <header className="student-dashboard-header">
            <h1 className="student-dashboard-title">Welcome back, Sophie</h1>

            <div className="student-dashboard-brand">
              <img
                src={logoSmall}
                alt="Tutornet logo"
                className="student-dashboard-brand-logo-img"
              />
            </div>
          </header>

          <section className="student-top-row">
            <div className="student-stats-grid">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className={`student-stat-card ${stat.highlight ? "highlight" : ""}`}
                >
                  <h2 className="student-stat-title">{stat.title}</h2>
                  <p className="student-stat-value">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="student-stat-subtitle">{stat.subtitle}</p>
                  )}
                </article>
              ))}
            </div>

            <article className="student-profile-card">
              <div className="student-profile-avatar">S</div>
              <div className="student-profile-info">
                <h2 className="student-profile-name">Sophie Carter</h2>
                <p className="student-profile-subject">Student</p>
                <p className="student-profile-rating">Current plan: Standard</p>
              </div>
            </article>
          </section>

          <section className="student-bottom-row">
            <article className="student-calendar-card">
              <h2 className="student-section-title">Calendar</h2>

              <div className="student-calendar-box">
                <div className="student-calendar-month">March</div>

                <div className="student-calendar-grid">
                  {calendarDays.flat().map((day, index) => {
                    const isHeader = index < 7;
                    const isActive = day === "8";

                    return (
                      <div
                        key={`${day}-${index}`}
                        className={`student-calendar-cell ${
                          isHeader ? "student-calendar-header-cell" : ""
                        } ${isActive ? "student-calendar-active-cell" : ""}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="student-lessons-card">
              <h2 className="student-section-title">Upcoming Lessons</h2>

              <div className="student-table-wrapper">
                <table className="student-lessons-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Subject</th>
                      <th>Tutor</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lessons.map((lesson) => (
                      <tr key={`${lesson.date}-${lesson.tutor}`}>
                        <td>{lesson.date}</td>
                        <td>{lesson.time}</td>
                        <td>{lesson.subject}</td>
                        <td>{lesson.tutor}</td>
                        <td>
                          <span className="student-status-badge">
                            {lesson.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="student-details-button"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedLesson && (
                <div className="student-lesson-details-box">
                  <h3 className="student-lesson-details-title">Selected lesson</h3>
                  <p><strong>Date:</strong> {selectedLesson.date}</p>
                  <p><strong>Time:</strong> {selectedLesson.time}</p>
                  <p><strong>Subject:</strong> {selectedLesson.subject}</p>
                  <p><strong>Tutor:</strong> {selectedLesson.tutor}</p>
                  <p><strong>Status:</strong> {selectedLesson.status}</p>

                  <button
                    className="student-close-details-button"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}

export default StudentDashboard;