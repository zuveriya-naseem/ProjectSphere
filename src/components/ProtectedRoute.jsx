import React from "react";
import { Navigate } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";

/**
 * ProtectedRoute:
 * - Redirects to "/" (LoginPage) if no user is logged in
 * - If allowedRole is given, only that role can access the route
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useProjectContext();

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → also send to login
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // All good → show the page
  return children;
}
