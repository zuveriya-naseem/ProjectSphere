import { createContext, useState, useContext, useEffect } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // user: { name, role: 'admin'|'student', team?: string }
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // tasks created by teacher/admin
  // task: { id, title, description, team, dueDate, progress, status, fileUrl, remarks, grade }
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // persist user & tasks
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // CRUD-ish helpers
  const addTask = (task) => setTasks((prev) => [...prev, task]);

  const markSubmitted = (taskId, fileUrl) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, fileUrl, progress: 100, status: "Submitted" }
          : t
      )
    );
  };

  const updateTaskMeta = (taskId, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));
  };

  return (
    <ProjectContext.Provider
      value={{ user, setUser, tasks, addTask, markSubmitted, updateTaskMeta }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
