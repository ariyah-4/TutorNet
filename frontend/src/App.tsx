import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // 1. Import your hook
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseCourses from './pages/BrowseCourses';
import CourseCreate from './pages/CourseCreate';
import CourseDetail from "./pages/CourseDetail.tsx";
import LessonView from "./pages/LessonView.tsx";
import MyLearning from "./pages/MyLearning.tsx";
import MyCourses from "./pages/MyCourses.tsx";
import CreateLesson from "./pages/CreateLesson.tsx";
import EditLesson from "./pages/EditLesson.tsx";
import CreateQuiz from "./pages/CreateQuiz.tsx";
import TakeQuiz from "./pages/TakeQuiz.tsx";

// Placeholder Components
const Dashboard = () => <div>Dashboard - Welcome back!</div>;
const ProfilePage = () => <div>Profile Settings.</div>;

function App() {
  // 2. Destructure the profile from your auth context
  const { profile, loading } = useAuth();

  // 3. Optional: Wait for the profile to load to avoid flickering redirects
  if (loading) return <div className="bg-slate-950 h-screen" />;

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes - All these use the Sidebar Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseCourses />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route
                  path="/create-course"
                  element={profile?.role === 'TUTOR' ? <CourseCreate /> : <Navigate to="/" />}
              />
              <Route
                  path="/course/:courseId/create-lesson"
                  element={profile?.role === 'TUTOR' ? <CreateLesson /> : <Navigate to="/" />}
              />
              <Route
                  path="/course/:courseId/edit-lesson/:lessonId"
                  element={profile?.role === 'TUTOR' ? <EditLesson /> : <Navigate to="/" />}
              />
              <Route
                  path="/course/:courseId/lesson/:lessonId/create-quiz"
                  element={profile?.role === 'TUTOR' ? <CreateQuiz /> : <Navigate to="/" />}
              />
              <Route path="/course/:courseId/lesson/:lessonId/quiz" element={<TakeQuiz />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
            </Route>
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
  );
}

export default App;