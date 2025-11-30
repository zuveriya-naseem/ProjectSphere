import RegisterPage from "./pages/RegisterPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // or TeacherDashboard if that's your filename
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App:
 * - Wraps everything in BrowserRouter
 * - Shows Navbar on all pages
 * - Defines routes for login, student, and admin
 * - Uses ProtectedRoute so dashboards require login
 *
 * Props:
 *  - mode, toggleMode come from index.js (for dark/light mode in Navbar)
 */
export default function App({ mode, toggleMode }) {
  return (
    <Router>
      <Navbar mode={mode} toggleMode={toggleMode} />

      <Routes>
        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Registration page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Student dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher/Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}