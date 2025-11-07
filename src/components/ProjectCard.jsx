import { Card, CardContent, Typography, LinearProgress, Chip, Box } from "@mui/material";

export default function ProjectCard({ project }) {
  const { title, team, progress = 0, status = "Not Submitted", dueDate, grade, remarks } = project || {};

  const statusColor =
    progress === 100 ? "success" : status === "Not Submitted" ? "error" : "warning";

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {team && <Typography variant="body2">Team: {team}</Typography>}
        {dueDate && <Typography variant="body2">Due: {dueDate}</Typography>}

        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} color={progress === 100 ? "success" : "primary"} />
          <Typography variant="caption">Progress: {progress}%</Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Chip size="small" label={status} color={statusColor} />
          {grade && <Chip size="small" label={`Grade: ${grade}`} sx={{ ml: 1 }} />}
        </Box>

        {remarks && (
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            Remarks: {remarks}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
