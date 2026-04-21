import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

const availableCourses = [
  {
    id: 1,
    title: "A-Level Physics Foundations",
    tutor: "Alex Smith",
    description:
      "Core physics concepts explained in a clear and structured way for A-Level students.",
    difficulty: "Intermediate",
    price: "£35 / lesson",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "GCSE Maths Problem Solving",
    tutor: "Sarah Lee",
    description:
      "A practical course focused on exam-style maths questions, logic, and confidence building.",
    difficulty: "Beginner",
    price: "£28 / lesson",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Mechanics and Motion",
    tutor: "Alex Smith",
    description:
      "Targeted support for mechanics, motion graphs, forces, and calculations.",
    difficulty: "Advanced",
    price: "£40 / lesson",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Intro to Algebra",
    tutor: "Maya Patel",
    description:
      "An approachable algebra course for students who want stronger foundations.",
    difficulty: "Beginner",
    price: "£25 / lesson",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  },
];

function AllCourses() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <main className="courses-page">
      <div className="courses-layout">
        <aside className="courses-sidebar">
          <div className="courses-sidebar-top">
            <nav className="courses-sidebar-nav">
              <button
                className="courses-sidebar-link"
                onClick={() => navigate("/dashboard/student")}
              >
                Dashboard
              </button>

              <button className="courses-sidebar-link active">
                All Courses
              </button>

              <button
                className="courses-sidebar-link"
                onClick={() => navigate("/student/profile")}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="courses-sidebar-footer">
            <div className="courses-sidebar-role-box">
              <span className="courses-sidebar-role-label">Current role</span>
              <button className="courses-sidebar-role-button">Student</button>
            </div>

            <button
              className="courses-sidebar-logout-button"
              onClick={() => navigate("/login")}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="courses-main">
          <header className="courses-header">
            <div>
              <h1 className="courses-page-title">All Courses</h1>
              <p className="courses-page-subtitle">
                Browse available courses and choose what you want to learn next.
              </p>
            </div>

            <div className="courses-header-brand">
              <img
                src={logoSmall}
                alt="Tutornet logo"
                className="courses-header-logo"
              />
            </div>
          </header>

          <section className="courses-toolbar">
            <div className="courses-count-box">
              <span className="courses-count-label">Available courses</span>
              <span className="courses-count-value">{availableCourses.length}</span>
            </div>

            <button
              className="courses-secondary-button"
              onClick={() => alert("Filters are not connected yet.")}
            >
              Filter
            </button>
          </section>

          <section className="courses-grid">
            {availableCourses.map((course) => (
              <article key={course.id} className="course-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-card-image"
                />

                <div className="course-card-content">
                  <div className="course-card-top">
                    <span className="course-badge">{course.difficulty}</span>
                    <span className="course-price">{course.price}</span>
                  </div>

                  <h2 className="course-title">{course.title}</h2>
                  <p className="course-description">{course.description}</p>

                  <div className="course-meta-grid">
                    <div className="course-meta-item">
                      <span className="course-meta-label">Tutor</span>
                      <span className="course-meta-value">{course.tutor}</span>
                    </div>

                    <div className="course-meta-item">
                      <span className="course-meta-label">Level</span>
                      <span className="course-meta-value">{course.difficulty}</span>
                    </div>
                  </div>

                  <div className="course-card-actions">
                    <button
                      className="courses-secondary-button"
                      onClick={() => setSelectedCourse(course)}
                    >
                      View
                    </button>

                    <button
                      className="courses-primary-button small"
                      onClick={() => alert("Enroll flow is not connected yet.")}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {selectedCourse && (
            <section className="selected-course-box">
              <div className="selected-course-header">
                <h2 className="selected-course-title">Selected course</h2>

                <button
                  className="courses-close-button"
                  onClick={() => setSelectedCourse(null)}
                >
                  Close
                </button>
              </div>

              <div className="selected-course-grid">
                <div className="selected-course-item">
                  <span className="selected-course-label">Title</span>
                  <span className="selected-course-value">{selectedCourse.title}</span>
                </div>

                <div className="selected-course-item">
                  <span className="selected-course-label">Tutor</span>
                  <span className="selected-course-value">{selectedCourse.tutor}</span>
                </div>

                <div className="selected-course-item">
                  <span className="selected-course-label">Difficulty</span>
                  <span className="selected-course-value">
                    {selectedCourse.difficulty}
                  </span>
                </div>

                <div className="selected-course-item">
                  <span className="selected-course-label">Price</span>
                  <span className="selected-course-value">{selectedCourse.price}</span>
                </div>

                <div className="selected-course-item full">
                  <span className="selected-course-label">Description</span>
                  <span className="selected-course-value">
                    {selectedCourse.description}
                  </span>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

export default AllCourses;