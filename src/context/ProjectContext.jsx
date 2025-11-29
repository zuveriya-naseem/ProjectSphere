import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);

  // tasks = [{id, title, submitted: false, file: null}]
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  return (
    <ProjectContext.Provider value={{ user, setUser, tasks, setTasks }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjectContext = () => useContext(ProjectContext);
