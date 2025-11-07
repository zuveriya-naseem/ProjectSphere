import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";
import { Container, Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function LoginPage() {
  const { setUser } = useProjectContext();
  const [credentials, setCredentials] = useState({ name: "", role: "student" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!credentials.name || !credentials.password) {
    alert("Please fill all fields.");
    return;
  }

  // 🔒 Simple password rules for now
  if (
    (credentials.role === "admin" && credentials.password !== "teacher123") ||
    (credentials.role === "student" && credentials.password !== "student123")
  ) {
    alert("Invalid password! Try again.");
    return;
  }

  // ✅ If everything’s correct, log them in
  setUser(credentials);
  localStorage.setItem("user", JSON.stringify(credentials));

  navigate(credentials.role === "admin" ? "/admin" : "/student");
};


  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }} elevation={8}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          Welcome to ProjectSphere
        </Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>          <TextField
            label="Your Name"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={credentials.password || ""}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />

          <TextField
            select
            label="Role"
            value={credentials.role}
            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
            SelectProps={{ native: true }}
          >
            <option value="student">Student</option>
            <option value="admin">Teacher</option>
          </TextField>
          <Button variant="contained" type="submit">Login</Button>
        </Box>
      </Paper>
    </Container>
  );
}
