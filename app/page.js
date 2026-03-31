"use client";

import { useEffect, useMemo, useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground";

const QUADRANTS = [
  { key: "high-priority-high-importance", label: "High Priority & High Importance" },
  { key: "high-priority", label: "High Priority" },
  { key: "high-importance", label: "High Importance" },
  { key: "general", label: "General" },
];

function isValidTask(task) {
  return (
    task &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.quadrant === "string" &&
    QUADRANTS.some((quadrant) => quadrant.key === task.quadrant) &&
    (task.status === "todo" || task.status === "done")
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeQuadrant, setActiveQuadrant] = useState("general");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done"),
    [tasks]
  );
  const openTasksCount = tasks.length - completedTasks.length;

  function openAddDialog(quadrantKey) {
    setEditingTaskId(null);
    setActiveQuadrant(quadrantKey);
    setTaskText("");
    setIsDialogOpen(true);
  }

  function openEditDialog(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === "done") return;
    setEditingTaskId(task.id);
    setActiveQuadrant(task.quadrant);
    setTaskText(task.title);
    setIsDialogOpen(true);
  }

  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      if (!response.ok) {
        setTasks([]);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data.filter(isValidTask));
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitTask(event) {
    event.preventDefault();
    const cleanTask = taskText.trim();
    if (!cleanTask) return;

    try {
      if (editingTaskId) {
        const response = await fetch(`/api/tasks/${editingTaskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: cleanTask,
          }),
        });

        if (!response.ok) {
          return;
        }
      } else {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: cleanTask,
            quadrant: activeQuadrant,
          }),
        });

        if (!response.ok) {
          return;
        }
      }

      await loadTasks();
      setIsDialogOpen(false);
    } catch {
      return;
    }
  }

  async function markComplete(taskId) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "done",
        }),
      });

      if (!response.ok) {
        return;
      }

      await loadTasks();
    } catch {
      return;
    }
  }

  async function deleteTask(taskId) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      await loadTasks();
    } catch {
      return;
    }
  }

  return (
    <>
      <AnimatedBackground />
      <div className="bg-orb bg-orb-one" aria-hidden="true" />
      <div className="bg-orb bg-orb-two" aria-hidden="true" />
      <div className="bg-wave" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="navbar">
        <div className="brand">
          <h1>Task Manager</h1>
          <p>Focus with quadrant-based planning</p>
        </div>
        <div className="header-stats" aria-label="Task stats">
          <div className="stat-pill">
            <span>Open</span>
            <strong>{openTasksCount}</strong>
          </div>
          <div className="stat-pill">
            <span>Completed</span>
            <strong>{completedTasks.length}</strong>
          </div>
        </div>
        <nav className="tabs" aria-label="Task views">
          <button
            className={`tab ${activeTab === "board" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("board")}
          >
            Board
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </nav>
      </header>

      <main className="page-shell">
        {activeTab === "board" ? (
          <section className="view active" aria-label="Task quadrants">
            <div className="grid">
              {QUADRANTS.map((quadrant, index) => {
                const openTasks = tasks.filter(
                  (task) => task.quadrant === quadrant.key && task.status !== "done"
                );
                return (
                  <article className="quadrant" key={quadrant.key} style={{ "--i": index + 1 }}>
                    <div className="quadrant-header">
                      <div>
                        <h2>{quadrant.label}</h2>
                        <p className="quadrant-meta">
                          {openTasks.length} open task{openTasks.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <button className="add-btn" type="button" onClick={() => openAddDialog(quadrant.key)}>
                        + Add
                      </button>
                    </div>
                    <ul className="task-list">
                      {isLoading ? (
                        <li className="empty-msg">Loading tasks...</li>
                      ) : openTasks.length === 0 ? (
                        <li className="empty-msg">No tasks yet.</li>
                      ) : (
                        openTasks.map((task) => (
                          <li className="task-item" key={task.id}>
                            <h4>{task.title}</h4>
                            {task.description ? <p>{task.description}</p> : null}
                            <div className="task-actions">
                              <button className="ghost-btn" type="button" onClick={() => openEditDialog(task.id)}>
                                Edit
                              </button>
                              <button className="solid-btn" type="button" onClick={() => markComplete(task.id)}>
                                Mark Complete
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="view active completed-panel" aria-label="Completed tasks">
            <h2 className="completed-title">Completed Tasks</h2>
            <ul className="task-list">
              {isLoading ? (
                <li className="empty-msg">Loading tasks...</li>
              ) : completedTasks.length === 0 ? (
                <li className="empty-msg">No completed tasks yet.</li>
              ) : (
                completedTasks.map((task) => (
                  <li className="task-item" key={task.id}>
                    <h4>{task.title}</h4>
                    {task.description ? <p>{task.description}</p> : null}
                    <div className="task-actions">
                      <button className="ghost-btn delete-btn" type="button" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}
      </main>

      {isDialogOpen && (
        <div className="dialog-overlay" role="dialog" aria-modal="true" aria-label="Task form">
          <form className="task-form" onSubmit={submitTask}>
            <h3>{editingTaskId ? "Edit Task" : "Add Task"}</h3>
            <input
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              type="text"
              placeholder="Task"
              required
              maxLength={120}
            />
            <div className="menu">
              <button className="ghost-btn" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="solid-btn" type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}