import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import { useProjectContext } from "./context/ProjectContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProjectDetails from "./pages/ProjectDetails";

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(2px)" },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
export default function App({ toggleMode, mode }) {
  return (
    <Router>
      <Navbar toggleMode={toggleMode} mode={mode} />
      <AnimatedRoutes />
    </Router>
  );
}
