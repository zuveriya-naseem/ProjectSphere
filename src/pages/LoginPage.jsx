import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { useProjectContext } from "../context/ProjectContext";

export default function LoginPage() {
  const { setUser } = useProjectContext();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    role: "student",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show success message after registration
  useEffect(() => {
    const msg = localStorage.getItem("authMessage");
    if (msg) {
      setSuccess(msg);
      localStorage.removeItem("authMessage");
    }
  }, []);

  const handleChange = (field) => (e) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, role, password } = credentials;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const found = users.find((u) => u.email === email && u.role === role);

    if (!found) {
      setError("User not found. Please register first.");
      return;
    }

    if (found.password !== password) {
      setError("Incorrect password.");
      return;
    }

    const userObj = {
      name: found.name,
      email: found.email,
      role: found.role,
      team: found.team,
    };

    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));

    navigate(role === "admin" ? "/admin" : "/student");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #0f172a, #020617 45%, #111827 80%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
          }}
        >
          ProjectSphere Login
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: "center", opacity: 0.8 }}
        >
          Login as a <strong>Student</strong> or <strong>Teacher</strong> to
          manage group projects.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            value={credentials.email}
            onChange={handleChange("email")}
            fullWidth
            required
          />

          <TextField
            select
            label="Role"
            value={credentials.role}
            onChange={handleChange("role")}
            fullWidth
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="admin">Teacher</MenuItem>
          </TextField>

          <TextField
            label="Password"
            type="password"
            value={credentials.password}
            onChange={handleChange("password")}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 1, borderRadius: 3 }}
            fullWidth
          >
            Login
          </Button>

          <Button
            variant="text"
            onClick={() => navigate("/register")}
            sx={{ mt: 1 }}
            fullWidth
          >
            New user? Create an account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
