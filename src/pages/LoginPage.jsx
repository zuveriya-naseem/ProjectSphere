import React, { useState } from "react";
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
    name: "",
    role: "student",
    team: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, role, team, password } = credentials;

    if (!name || !password || (role === "student" && !team)) {
      setError("All required fields must be filled.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const validPasswords = {
      admin: "teacher123",
      student: "student123",
    };

    if (password !== validPasswords[role]) {
      setError(
        role === "admin"
          ? "Invalid password for Teacher. Try: teacher123"
          : "Invalid password for Student. Try: student123"
      );
      return;
    }

    // 🧠 user object now includes team for students
    const userObject =
      role === "student"
        ? { name, role, team }
        : { name, role, team: "All Teams" };

    setUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));

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

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Your Name"
            value={credentials.name}
            onChange={handleChange("name")}
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

          {/* Team only required for students */}
          {credentials.role === "student" && (
            <TextField
              label="Team Name *"
              placeholder="e.g. Team Alpha"
              value={credentials.team}
              onChange={handleChange("team")}
              fullWidth
              required
            />
          )}

          <TextField
            label="Password"
            type="password"
            value={credentials.password}
            onChange={handleChange("password")}
            fullWidth
            required
            helperText={
              credentials.role === "admin"
                ? 'Demo Teacher password: "teacher123"'
                : 'Demo Student password: "student123"'
            }
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
        </Box>
      </Paper>
    </Box>
  );
}
