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

    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            submitted: true,
            fileName: file.name,
          }
        : t
    );

    setTasks(updated);
    setSnack(true);
    event.target.value = "";
  };

  const openFileDialog = (taskId) => {
    const input = document.getElementById(`file-input-${taskId}`);
    if (input) input.click();
  };

  // 🧠 Team-based filtering: show only tasks for this student's team
  const teamName = user?.team || "";
  const filteredTasks =
    teamName && teamName !== "All Teams"
      ? tasks.filter((t) => t.team === teamName)
      : tasks;

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
            "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(45,212,191,0.08))",
        }}
        elevation={8}
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
            Upload your work files for each assigned task. Once submitted, your
            teacher will be able to review them and update your progress.
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

      {filteredTasks.length === 0 && (
        <Typography sx={{ opacity: 0.7, mb: 2 }}>
          No tasks assigned to <strong>{teamName}</strong> yet.
        </Typography>
      )}

      <Grid container spacing={2}>
        {filteredTasks.map((task) => (
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
                    Uploaded file: <strong>{task.fileName}</strong>
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

      <Snackbar
        open={snack}
        autoHideDuration={2300}
        onClose={handleSnackClose}
        message="Work submitted!"
      />
    </MotionBox>
  );
}
