import React, { useEffect, useState } from "react";
import { CircularProgress, Paper, Typography, Box } from "@mui/material";

export default function ApiProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setErr("Failed to fetch projects");
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto" }} />;
  if (err) return <Typography sx={{ color: "red" }}>{err}</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Suggested Project Ideas (API)
      </Typography>

      {data.map((item) => (
        <Paper
          key={item.id}
          sx={{
            p: 2,
            mb: 1,
            background: item.completed ? "#0f766e" : "#334155",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

            
          }}
        >
          <Typography>{item.title}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
