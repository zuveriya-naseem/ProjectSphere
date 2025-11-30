import React, { useState } from "react";
import { useProjectContext } from "../context/ProjectContext";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Snackbar,
  Grid,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export default function StudentDashboard() {
  const { user, tasks, setTasks } = useProjectContext();
  const [snack, setSnack] = useState(false);

  const handleSnackClose = () => setSnack(false);

  const handleFileUpload = (taskId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;

      const prevSubmissions = t.submissions || [];
      // tag submission with current user's email
      const existingIndex = prevSubmissions.findIndex(
        (s) => s.email === user?.email
      );

      let newSubmissions;
      const newSubmission = {
        email: user?.email,
        name: user?.name,
        fileName: file.name,
        submittedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // update existing submission by same user
        newSubmissions = [...prevSubmissions];
        newSubmissions[existingIndex] = newSubmission;
      } else {
        newSubmissions = [...prevSubmissions, newSubmission];
      }

      return {
        ...t,
        submitted: true,
        fileName: file.name,
        submissions: newSubmissions,
      };
    });

    setTasks(updated);
    setSnack(true);
    event.target.value = "";
  };

  const openFileDialog = (taskId) => {
    const input = document.getElementById(`file-input-${taskId}`);
    if (input) input.click();
  };

  const teamName = user?.team || "";
  const teamTasks =
    teamName && teamName !== "All Teams"
      ? tasks.filter((t) => t.team === teamName)
      : tasks;

  // 🔹 Dynamic team members from registered users
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const teamMembers = allUsers.filter(
    (u) => u.role === "student" && u.team === teamName
  );

  const totalTeamTasks = teamTasks.length || 0;

  // compute contribution per member based on how many tasks they submitted
  const memberStats = teamMembers.map((m) => {
    const submittedCount = teamTasks.reduce((count, task) => {
      const subs = task.submissions || [];
      const didSubmit = subs.some((s) => s.email === m.email);
      return count + (didSubmit ? 1 : 0);
    }, 0);

    const percentage =
      totalTeamTasks === 0
        ? 0
        : Math.round((submittedCount / totalTeamTasks) * 100);

    return {
      ...m,
      submittedCount,
      percentage,
    };
  });

  return (
    <MotionBox
      sx={{ p: 3 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: "700" }}>
        Student Dashboard
      </Typography>

      {/* Hero section */}
      <Paper
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(45,212,191,0.15))",
          boxShadow: "0 20px 40px rgba(15,23,42,0.9)",
        }}
        elevation={10}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Hi {user?.name || "Student"} 👋
          </Typography>
          {teamName && teamName !== "All Teams" && (
            <Typography sx={{ fontWeight: 500, mb: 1 }}>
              You are in <strong>{teamName}</strong>. Tasks below are assigned
              to your team.
            </Typography>
          )}
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Upload your work files for each assigned task. Your submissions are
            tracked per member so your teacher can see individual
            contributions.
          </Typography>
        </Box>

        <Box
          component="img"
          src="https://source.unsplash.com/featured/?students,project"
          alt="Students working"
          sx={{
            width: 220,
            height: 140,
            borderRadius: 3,
            objectFit: "cover",
            display: { xs: "none", md: "block" },
          }}
        />
      </Paper>

      {/* Tasks section */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        Your Team Tasks
      </Typography>

      {teamTasks.length === 0 && (
        <Typography sx={{ opacity: 0.7, mb: 2 }}>
          No tasks assigned to <strong>{teamName}</strong> yet.
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {teamTasks.map((task) => (
          <Grid item xs={12} md={8} key={task.id}>
            <input
              id={`file-input-${task.id}`}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(task.id, e)}
            />

            <MotionPaper
              whileHover={{ scale: 1.02, translateY: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: task.submitted ? "#10b981" : "#1e293b",
                color: "white",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                borderRadius: "16px",
              }}
              elevation={5}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                  Team: {task.team || "Not set"} • Due:{" "}
                  {task.dueDate || "Not set"}
                </Typography>
                {task.fileName && (
                  <Typography sx={{ fontSize: 12, opacity: 0.9, mt: 0.5 }}>
                    Last uploaded file: <strong>{task.fileName}</strong>
                  </Typography>
                )}
              </Box>

              {task.submitted ? (
                <Chip
                  label="Submitted ✔"
                  color="success"
                  sx={{ bgcolor: "rgba(22,163,74,0.9)", color: "white" }}
                />
              ) : (
                <Button
                  variant="contained"
                  onClick={() => openFileDialog(task.id)}
                  sx={{ borderRadius: 999 }}
                >
                  Upload & Submit
                </Button>
              )}
            </MotionPaper>
          </Grid>
        ))}
      </Grid>

      {/* 🧑‍🤝‍🧑 Team panel with contributions */}
      {teamName && memberStats.length > 0 && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            maxWidth: 700,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,118,110,0.7))",
            boxShadow: "0 20px 45px rgba(0,0,0,0.8)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "white" }}
          >
            Your Team: {teamName} — Member Contributions
          </Typography>

          {memberStats.map((m) => (
            <Box
              key={m.email}
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 3,
                bgcolor:
                  m.email === user?.email
                    ? "rgba(15,23,42,0.95)"
                    : "rgba(15,23,42,0.8)",
                border:
                  m.email === user?.email
                    ? "1px solid rgba(56,189,248,0.9)"
                    : "1px solid transparent",
              }}
            >
              <Typography
                sx={{ fontWeight: 600, color: "white", fontSize: 15 }}
              >
                {m.name}{" "}
                {m.email === user?.email && (
                  <Typography
                    component="span"
                    sx={{ fontSize: 11, ml: 1, opacity: 0.8 }}
                  >
                    (You)
                  </Typography>
                )}
              </Typography>

              <Typography
                sx={{ fontSize: 12, opacity: 0.85, color: "white", mb: 0.5 }}
              >
                Tasks submitted: {m.submittedCount} / {totalTeamTasks}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={m.percentage}
                sx={{
                  mt: 0.5,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "rgba(148,163,184,0.5)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    backgroundColor: "#38bdf8",
                  },
                }}
              />
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "rgba(226,232,240,0.9)",
                }}
              >
                Contribution: {m.percentage}%
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      <Snackbar
        open={snack}
        autoHideDuration={2300}
        onClose={handleSnackClose}
        message="Work submitted!"
      />
    </MotionBox>
  );
}
