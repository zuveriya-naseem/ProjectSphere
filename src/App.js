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
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Student dashboard (only for logged-in students) */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin/Teacher dashboard (only for logged-in teacher/admin) */}
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
