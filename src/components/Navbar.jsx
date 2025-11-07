import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Navbar({ toggleMode, mode }) {
  const { user, setUser } = useProjectContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        my: 1,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand / App Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.6,
            userSelect: "none",
            cursor: "pointer",
            color: mode === "light" ? "#1e293b" : "#e2e8f0",
          }}
          onClick={() => navigate("/")}
        >
          ProjectSphere
        </Typography>

        {/* Right Section - Nav Links + Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/student">
            Student
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Teacher
          </Button>

          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout ({user.name} • {user.role})
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
          )}

          {/* Theme Toggle Icon */}
          <Tooltip
            title={
              mode === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"
            }
          >
            <IconButton
              color="inherit"
              onClick={toggleMode}
              sx={{
                transition: "transform 0.3s ease",
                "&:hover": { transform: "rotate(25deg)" },
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
