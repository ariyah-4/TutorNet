import { useEffect } from 'react'
import { supabase } from './supabaseClient'

import { Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TutorDashboardPage from "./pages/TutorDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import TutorProfilePage from "./pages/tutor/TutorProfilePage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import TutorCoursesPage from "./pages/tutor/TutorCoursesPage";
import AllCoursesPage from "./pages/student/AllCoursesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard/tutor" element={<TutorDashboardPage />} />
      <Route path="/dashboard/student" element={<StudentDashboardPage />} />
      <Route path="/tutor/profile" element={<TutorProfilePage />} />
      <Route path="/student/profile" element={<StudentProfilePage />} />
      <Route path="/tutor/courses" element={<TutorCoursesPage />} />
<Route path="/student/courses" element={<AllCoursesPage />} />
    </Routes>
  );

  useEffect(() => {
  async function connect() {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'tutor@gmail.com',
      password: 'Arya#4444'
    })

    console.log(data, error)
  }

  connect()
}, [])
}

export default App;