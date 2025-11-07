import { Container, Typography } from "@mui/material";

export default function ProjectDetails() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold">Project Details</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Coming soon: a detailed page for per-task files, comments, and history.
      </Typography>
    </Container>
  );
}
