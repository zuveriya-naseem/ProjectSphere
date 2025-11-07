import {
  Container, Typography, Grid, Paper, Box, TextField, Button, Divider
} from "@mui/material";
import { useState } from "react";
import { useProjectContext } from "../context/ProjectContext";
import ProjectCard from "../components/ProjectCard";

export default function AdminDashboard() {
  const { tasks, addTask, updateTaskMeta } = useProjectContext();
  const [form, setForm] = useState({ title: "", description: "", team: "", dueDate: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.team) return;
    addTask({
      id: Date.now(),
      ...form,
      progress: 0,
      status: "Not Submitted",
      fileUrl: "",
      remarks: "",
      grade: "",
    });
    setForm({ title: "", description: "", team: "", dueDate: "" });
  };

  const handleSaveFeedback = (id, remarks, grade) => {
    updateTaskMeta(id, { remarks, grade });
  };

  // simple activity split
  const submitted = tasks.filter((t) => t.progress === 100);
  const pending = tasks.filter((t) => t.progress < 100);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Teacher Dashboard — Assign & Review
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Assign New Work</Typography>
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField label="Task Title" name="title" value={form.title} onChange={handleChange} required />
          <TextField label="Description" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
          <TextField label="Team" name="team" placeholder="Team Alpha / Team Beta..." value={form.team} onChange={handleChange} required />
          <TextField label="Due Date" name="dueDate" type="date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={handleChange} />
          <Button type="submit" variant="contained">Assign</Button>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>All Tasks & Activity</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {tasks.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <ProjectCard project={t} />
              <Divider sx={{ my: 1 }} />
              <Box display="flex" gap={1} flexDirection="column">
                <TextField
                  label="Remarks"
                  defaultValue={t.remarks}
                  onBlur={(e) => handleSaveFeedback(t.id, e.target.value, t.grade)}
                  multiline
                  rows={2}
                />
                <TextField
                  label="Grade"
                  defaultValue={t.grade}
                  onBlur={(e) => handleSaveFeedback(t.id, t.remarks, e.target.value)}
                  sx={{ maxWidth: 200 }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>At a Glance</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">Pending Submissions</Typography>
            {pending.length === 0 ? <Typography>No pending tasks 🎉</Typography> :
              pending.map((p) => <Typography key={p.id}>• {p.title} — {p.team}</Typography>)}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">Submitted</Typography>
            {submitted.length === 0 ? <Typography>No submissions yet.</Typography> :
              submitted.map((s) => <Typography key={s.id}>• {s.title} — {s.team}</Typography>)}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
