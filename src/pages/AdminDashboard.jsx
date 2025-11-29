import React, { useState } from "react";
import { useProjectContext } from "../context/ProjectContext";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export default function AdminDashboard() {
  const { tasks, setTasks } = useProjectContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    team: "",
    dueDate: "",
  });

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addTask = () => {
    if (!form.title || !form.team) return;

    const newItem = {
      id: uuid(),
      title: form.title,
      description: form.description,
      team: form.team,
      dueDate: form.dueDate,
      submitted: false,
    };

    setTasks([...tasks, newItem]);
    setForm({ title: "", description: "", team: "", dueDate: "" });
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const startEditing = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, title: editTitle } : t
    );
    setTasks(updated);
    setEditId(null);
  };

  return (
    <MotionBox
      sx={{ p: 3 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        Teacher Dashboard — Assign & Review
      </Typography>

      {/* Hero / form card */}
      <Paper
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(37,99,235,0.08))",
          boxShadow: "0 20px 40px rgba(15,23,42,0.9)",
        }}
        elevation={10}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Assign New Work
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Task Title *"
              fullWidth
              value={form.title}
              onChange={handleChange("title")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={handleChange("description")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Team *"
              placeholder="Team Alpha / Beta"
              fullWidth
              value={form.team}
              onChange={handleChange("team")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={handleChange("dueDate")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ borderRadius: 999 }}
              onClick={addTask}
            >
              ASSIGN
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks list with progress */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        All Tasks & Activity
      </Typography>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task.id} item xs={12} md={7}>
            <MotionPaper
              whileHover={{ scale: 1.02, translateY: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: "#0f172a",
                color: "white",
                boxShadow: "0 20px 45px rgba(15,23,42,0.95)",
              }}
            >
              {/* Title row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {editId === task.id ? (
                  <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    fullWidth
                    variant="standard"
                    sx={{ input: { color: "white" } }}
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {task.title}
                  </Typography>
                )}

                <Box>
                  {editId === task.id ? (
                    <IconButton onClick={() => saveEdit(task.id)}>
                      <SaveIcon sx={{ color: "#60a5fa" }} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => startEditing(task)}>
                      <EditIcon sx={{ color: "#60a5fa" }} />
                    </IconButton>
                  )}
                  <IconButton onClick={() => deleteTask(task.id)}>
                    <DeleteIcon sx={{ color: "#f97373" }} />
                  </IconButton>
                </Box>
              </Box>

              <Typography sx={{ fontSize: 14, opacity: 0.85, mb: 1 }}>
                Team: {task.team || "Not set"} • Due:{" "}
                {task.dueDate || "Not set"}
              </Typography>

              {task.description && (
                <Typography
                  sx={{ fontSize: 14, opacity: 0.8, mb: 1.5 }}
                >
                  {task.description}
                </Typography>
              )}

              {/* Status chips */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={task.submitted ? "Submitted" : "Pending"}
                  color={task.submitted ? "success" : "warning"}
                  sx={{
                    bgcolor: task.submitted ? "#16a34a" : "#f97316",
                    color: "white",
                  }}
                />
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </MotionBox>
  );
}
