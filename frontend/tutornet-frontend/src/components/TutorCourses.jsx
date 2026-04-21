import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSmall from "../assets/logo.png";

const tutorCourses = [
  {
    id: 1,
    title: "A-Level Physics Foundations",
    description:
      "Core physics concepts explained in a clear and structured way for A-Level students.",
    difficulty: "Intermediate",
    price: "£35 / lesson",
    lessons: 12,
    students: 18,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "GCSE Maths Problem Solving",
    description:
      "A practical course focused on exam-style maths questions, logic, and confidence building.",
    difficulty: "Beginner",
    price: "£28 / lesson",
    lessons: 10,
    students: 24,
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Mechanics and Motion",
    description:
      "Targeted support for mechanics, motion graphs, forces, and calculations.",
    difficulty: "Advanced",
    price: "£40 / lesson",
    lessons: 8,
    students: 11,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
];

function TutorCourses() {
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
                onClick={() => navigate("/dashboard/tutor")}
              >
                Dashboard
              </button>

              <button className="courses-sidebar-link active">
                My Courses
              </button>

              <button
                className="courses-sidebar-link"
                onClick={() => navigate("/tutor/profile")}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="courses-sidebar-footer">
            <div className="courses-sidebar-role-box">
              <span className="courses-sidebar-role-label">Current role</span>
              <button className="courses-sidebar-role-button">Tutor</button>
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
              <h1 className="courses-page-title">My Courses</h1>
              <p className="courses-page-subtitle">
                Manage your courses and review what students can see.
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
              <span className="courses-count-label">Total courses</span>
              <span className="courses-count-value">{tutorCourses.length}</span>
            </div>

            <button
              className="courses-primary-button"
              onClick={() => alert("Create course form is not connected yet.")}
            >
              Create course
            </button>
          </section>

          <section className="courses-grid">
            {tutorCourses.map((course) => (
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
                      <span className="course-meta-label">Lessons</span>
                      <span className="course-meta-value">{course.lessons}</span>
                    </div>

                    <div className="course-meta-item">
                      <span className="course-meta-label">Students</span>
                      <span className="course-meta-value">{course.students}</span>
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
                      onClick={() => alert("Edit course is not connected yet.")}
                    >
                      Edit
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

export default TutorCourses;