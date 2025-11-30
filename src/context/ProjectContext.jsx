import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("mode") || "light"
  );

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <ProjectContext.Provider
      value={{ user, setUser, tasks, setTasks, mode, toggleMode }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjectContext = () => useContext(ProjectContext);
