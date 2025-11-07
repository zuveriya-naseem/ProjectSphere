import { useProjectContext } from "../context/ProjectContext";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { useState } from "react";

export default function TeamSelector() {
  const { user, setUser } = useProjectContext();
  const [team, setTeam] = useState(user?.team || "");
  const teams = ["Team Alpha", "Team Beta", "Team Delta"];

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, team };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6">Select Your Team</Typography>
      <TextField
        select
        label="Team"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        sx={{ mt: 2, minWidth: 240 }}
      >
        {teams.map((t) => (
          <MenuItem key={t} value={t}>{t}</MenuItem>
        ))}
      </TextField>
      <Button onClick={handleSave} variant="contained" sx={{ ml: 2 }}>
        Save
      </Button>
    </Box>
  );
}
