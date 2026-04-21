import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

const stats = [
  {
    title: "Total Earnings",
    value: "£2,850.75",
    highlight: true,
  },
  {
    title: "Upcoming Lessons",
    value: "7",
    subtitle: "This week",
  },
  {
    title: "Total Students",
    value: "15",
    subtitle: "Active students",
  },
];

const lessons = [
  {
    date: "April 1",
    time: "2:00 PM",
    subject: "Maths",
    student: "Alex Johnson",
    status: "Confirmed",
  },
  {
    date: "April 2",
    time: "4:30 PM",
    subject: "Physics",
    student: "Ben Smith",
    status: "Confirmed",
  },
  {
    date: "April 8",
    time: "4:30 PM",
    subject: "Physics",
    student: "John Davis",
    status: "Confirmed",
  },
  {
    date: "April 10",
    time: "5:00 PM",
    subject: "Maths",
    student: "Eliza Green",
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

function TutorDashboard() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();

  return (
    <main className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-top">
            <nav className="sidebar-nav">
              <button className="sidebar-link active" onClick={() => navigate("/dashboard/tutor")}>
                Dashboard
              </button>

              <button className="sidebar-link" onClick={() => navigate("/tutor/courses")}>
                My Courses
              </button>

              <button className="sidebar-link" onClick={() => navigate("/tutor/profile")}>
                Profile
              </button>

              <button className="sidebar-link" onClick={() => setSelectedLesson(null)}>
                Settings
              </button>
            </nav>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-role-box">
              <span className="sidebar-role-label">Current role</span>
              <button className="sidebar-role-button">Tutor</button>
            </div>

            <button
              className="sidebar-logout-button"
              onClick={() => navigate("/login")}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Welcome back, Alex</h1>

            <div className="dashboard-brand">
              <img
                src={logoSmall}
                alt="Tutornet logo"
                className="dashboard-brand-logo-img"
              />
            </div>
          </header>

          <section className="dashboard-top-row">
            <div className="stats-grid">
              {stats.map((stat) => (
                <article
                  key={stat.title}
                  className={`stat-card ${stat.highlight ? "highlight" : ""}`}
                >
                  <h2 className="stat-title">{stat.title}</h2>
                  <p className="stat-value">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="stat-subtitle">{stat.subtitle}</p>
                  )}
                </article>
              ))}
            </div>

            <article className="profile-card">
              <div className="profile-avatar">A</div>

              <div className="profile-info">
                <h2 className="profile-name">Alex Smith</h2>
                <p className="profile-subject">Physics Tutor</p>
                <p className="profile-rating">Rating: 4.9 / 5.0</p>
              </div>
            </article>
          </section>

          <section className="dashboard-bottom-row">
            <article className="calendar-card">
              <h2 className="section-title">Calendar</h2>

              <div className="calendar-box">
                <div className="calendar-month">March</div>

                <div className="calendar-grid">
                  {calendarDays.flat().map((day, index) => {
                    const isHeader = index < 7;
                    const isActive = day === "10";

                    return (
                      <div
                        key={`${day}-${index}`}
                        className={`calendar-cell ${
                          isHeader ? "calendar-header-cell" : ""
                        } ${isActive ? "calendar-active-cell" : ""}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="lessons-card">
              <h2 className="section-title">Lesson Management</h2>

              <div className="table-wrapper">
                <table className="lessons-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Subject</th>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lessons.map((lesson) => (
                      <tr key={`${lesson.date}-${lesson.student}`}>
                        <td>{lesson.date}</td>
                        <td>{lesson.time}</td>
                        <td>{lesson.subject}</td>
                        <td>{lesson.student}</td>
                        <td>
                          <span className="status-badge">{lesson.status}</span>
                        </td>
                        <td>
                          <button
                            className="details-button"
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
                <div className="lesson-details-box">
                  <h3 className="lesson-details-title">Selected lesson</h3>
                  <p><strong>Date:</strong> {selectedLesson.date}</p>
                  <p><strong>Time:</strong> {selectedLesson.time}</p>
                  <p><strong>Subject:</strong> {selectedLesson.subject}</p>
                  <p><strong>Student:</strong> {selectedLesson.student}</p>
                  <p><strong>Status:</strong> {selectedLesson.status}</p>

                  <button
                    className="close-details-button"
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

export default TutorDashboard;