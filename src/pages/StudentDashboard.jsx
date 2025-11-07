import {
  Container, Typography, Grid, Card, CardContent, LinearProgress, Button, Box
} from "@mui/material";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useProjectContext } from "../context/ProjectContext";
import TeamSelector from "../components/TeamSelector";

export default function StudentDashboard() {
  const { user, tasks, markSubmitted } = useProjectContext();
  const inputs = useRef({}); // per-task file inputs

  const handleChooseFile = (taskId) => {
    if (inputs.current[taskId]) inputs.current[taskId].click();
  };

  const handleUpload = (taskId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fakeUrl = URL.createObjectURL(file); // simulate uploaded URL
    markSubmitted(taskId, fakeUrl); // sets progress to 100 + status Submitted
  };

  const myTasks = tasks.filter((t) => !user?.team || t.team === user.team);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Student Dashboard — Hi {user?.name}
      </Typography>

      <TeamSelector />

      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="h6">Your Team Tasks</Typography>
      </Box>

      <Grid container spacing={2}>
        {myTasks.length === 0 && (
          <Typography sx={{ ml: 2 }}>No tasks yet for your team.</Typography>
        )}

        {myTasks.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">{t.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.description || "No description provided."}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Team: {t.team}</Typography>
                  <Typography variant="body2">Due: {t.dueDate || "—"}</Typography>

                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={t.progress}
                      color={t.progress === 100 ? "success" : "primary"}
                    />
                    <Typography variant="caption">Status: {t.status}</Typography>
                  </Box>

                  {t.progress < 100 ? (
                    <>
                      <input
                        type="file"
                        ref={(el) => (inputs.current[t.id] = el)}
                        style={{ display: "none" }}
                        onChange={(e) => handleUpload(t.id, e)}
                      />
                      <Button sx={{ mt: 2 }} variant="outlined" size="small" onClick={() => handleChooseFile(t.id)}>
                        Upload Work
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
                      File uploaded ✔ (Ready for grading)
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
