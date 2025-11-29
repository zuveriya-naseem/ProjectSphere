import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    team: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validateEmail = (email) => {
    // simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, role, team, password, confirmPassword } = form;

    // basic required checks
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (role === "student" && !team) {
      setError("Team name is required for students.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("users") || "[]");

    const already = existing.find(
      (u) => u.email === email && u.role === role
    );
    if (already) {
      setError("User already exists for this email and role. Please login.");
      return;
    }

    const newUser = {
      name,
      email,
      role,
      team: role === "student" ? team : "All Teams",
      password, // stored only in localStorage (demo only)
    };

    const updated = [...existing, newUser];
    localStorage.setItem("users", JSON.stringify(updated));

    localStorage.setItem(
      "authMessage",
      "Registration successful. Please login."
    );

    setSuccess("Registered successfully! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #020617, #020617 35%, #0b1120 70%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
        >
          Create an Account
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: "center", opacity: 0.8 }}
        >
          Register as a <strong>Student</strong> or <strong>Teacher</strong> to
          use ProjectSphere.
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
            label="Full Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            fullWidth
            required
          />

          <TextField
            select
            label="Role"
            value={form.role}
            onChange={handleChange("role")}
            fullWidth
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="admin">Teacher</MenuItem>
          </TextField>

          {form.role === "student" && (
            <TextField
              label="Team Name"
              placeholder="e.g. Team Alpha"
              value={form.team}
              onChange={handleChange("team")}
              fullWidth
              required
            />
          )}

          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            fullWidth
            required
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
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
            Register
          </Button>

          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ mt: 1 }}
            fullWidth
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
