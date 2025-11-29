import React from "react";
import { Navigate } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { user } = useProjectContext();

  // not logged in → go to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // logged in but wrong role → also back to login/home
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // allowed → render actual page
  return children;
}
