import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SideMenu from "../../dashboard/modern/components/SideMenu";
import NewTaskForm from "./components/NewTaskForm";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
// Reusing the existing projects fetch util so the "belongs to a project"
// dropdown/filter can list the user's real projects. Adjust the import
// path if your projects page lives somewhere else.
import fetchUserProjectsUtil from "../../projects/modern/utils/fetchUserProjectsUtil";
import getNewAccessTokenUtil from "./utils/getNewAccessTokenUtil";
import createNewTaskUtil from "./utils/createNewTaskUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";
import { MdOutlineRadioButtonChecked } from "react-icons/md";

import "./Tasks.css";

const taskStates = {
  labels: {
    1: "To do",
    2: "Doing",
    3: "Done",
  },
  classes: {
    1: "to-do",
    2: "doing",
    3: "done",
  },
};

export default function TasksPageModern({
  user,
  userId,
  setAuthentication,
  setPreviewModernUI,
}) {
  const navigate = useNavigate();
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    action: "",
  });

  const [userTasks, setUserTasks] = useState([]);
  const [fetchTasks, setFetchTasks] = useState(false);
  const [userTasksFetched, setUserTasksFetched] = useState(0);

  // Used to populate the project dropdown in the New Task form and to
  // resolve task.project -> project name for the table's "Project" column
  // (same lookup as the dashboard TasksTable).
  const [userProjects, setUserProjects] = useState([]);
  const [userProjectsFetched, setUserProjectsFetched] = useState(0);

  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [filtersPopupVisible, setFiltersPopupVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filteredTasksList, setFilteredTasksList] = useState([]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskFormVisible, setNewTaskFormVisible] = useState(false);
  const [createNewTask, setCreateNewTask] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [newTask, setNewTask] = useState({});

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [deleteTask, setDeleteTask] = useState({
    taskId: "",
    delete: false,
  });
  const [taskDeleted, setTaskDeleted] = useState(0);

  const { token, sessionId } = JSON.parse(sessionStorage.getItem("authUser"));
  const displayedTasks =
    filtersApplied > 0 ? filteredTasksList : userTasks;
  const hasSelectedTasks = selectedTaskIds.length > 0;
  const allDisplayedTasksSelected =
    displayedTasks.length > 0 &&
    displayedTasks.every((task) => selectedTaskIds.includes(task.task_id));

  useEffect(() => {
    fetchUserTasksUtil(
      user,
      userId,
      token,
      sessionId,
      tries,
      setTries,
      tokenValidated,
      setTokenValidated,
      newAccessToken,
      setNewAccessToken,
      setUserTasks,
      setUserTasksFetched,
    );
  }, [fetchTasks, newTaskCreated]);

  // One-off fetch to populate the project picker. Reuses the same
  // fetchUserProjectsUtil the Projects page already relies on.
  useEffect(() => {
    fetchUserProjectsUtil(
      user,
      userId,
      token,
      sessionId,
      tries,
      setTries,
      tokenValidated,
      setTokenValidated,
      newAccessToken,
      setNewAccessToken,
      setUserProjects,
      setUserProjectsFetched,
    );
  }, []);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getNewAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        setFetchTasks,
        setCreateNewTask,
        deleteTask,
        setDeleteTask,
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (deleteTask.delete) {
      deleteTaskUtil(
        deleteTask.taskId,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        taskDeleted,
        setTaskDeleted,
        deleteTask,
        setDeleteTask,
        newAccessToken,
        setNewAccessToken,
      );
    }
  }, [deleteTask]);

  useEffect(() => {
    if (taskDeleted > 0) {
      setDeleteQueue((queue) => {
        const remaining = queue.slice(1);
        if (remaining.length > 0) {
          setDeleteTask({ taskId: remaining[0], delete: true });
        } else {
          setSelectedTaskIds([]);
          setFetchTasks((prev) => !prev);
        }
        return remaining;
      });
    }
  }, [taskDeleted]);

  useEffect(() => {
    if (newTaskCreated > 0) {
      setNewTaskFormVisible(false);
      setTimeout(() => {
        setShowNewTaskForm(false);
      }, 250);
    }
  }, [newTaskCreated]);

  useEffect(() => {
    if (createNewTask) {
      createNewTaskUtil(
        newTask,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        newTaskCreated,
        setNewTaskCreated,
        setCreateNewTask,
      );
    }
  }, [createNewTask]);

  useEffect(() => {
    if (filtersApplied > 0) {
      const { state, scope } = filters;
      const filteredList = userTasks.filter((task) => {
        const matchesState = state ? task.state === state : true;
        const matchesScope =
          scope === "standalone"
            ? !task.project
            : scope === "project"
              ? Boolean(task.project)
              : true;
        return matchesState && matchesScope;
      });
      setFilteredTasksList(filteredList);
    }
  }, [filtersApplied]);

  const getProjectName = (taskProjectId) => {
    const match = userProjects.filter(
      (project) => project.project_id === taskProjectId,
    );
    return match.length > 0 ? match[0].name : "";
  };

  const openFiltersPopup = () => {
    setShowFiltersPopup(true);
    setTimeout(() => {
      setFiltersPopupVisible(true);
    }, 250);
  };

  const closeFiltersPopup = () => {
    setFiltersPopupVisible(false);
    setTimeout(() => {
      setShowFiltersPopup(false);
    }, 250);
  };

  const updateFilters = (type, value) => {
    if (type === "state") {
      setFilters({ ...filters, state: Number(value) });
    } else if (type === "scope") {
      setFilters({ ...filters, scope: value });
    }
  };

  const applyFilters = () => {
    setFiltersApplied(filtersApplied + 1);
    closeFiltersPopup();
  };

  const clearFilters = () => {
    setFiltersApplied(0);
    setFilters({});
    setFilteredTasksList([]);
    closeFiltersPopup();
  };

  const openNewTaskForm = () => {
    setShowNewTaskForm(true);
    setTimeout(() => {
      setNewTaskFormVisible(true);
    }, 250);
  };

  const closeNewTaskForm = () => {
    setNewTaskFormVisible(false);
    setNewTask({});
    setTimeout(() => {
      setShowNewTaskForm(false);
    }, 250);
  };

  const createNewTaskFn = () => {
    setNewTask({
      ...newTask,
      assigned_to: userId,
      updated_by: userId,
      created_by: userId,
    });
    setCreateNewTask(true);
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const toggleSelectAllTasks = () => {
    const displayedTaskIds = displayedTasks.map((task) => task.task_id);

    if (allDisplayedTasksSelected) {
      setSelectedTaskIds((prev) =>
        prev.filter((id) => !displayedTaskIds.includes(id)),
      );
    } else {
      setSelectedTaskIds((prev) => [
        ...new Set([...prev, ...displayedTaskIds]),
      ]);
    }
  };

  const deleteSelectedTasks = () => {
    if (!hasSelectedTasks) {
      return;
    }

    setDeleteQueue(selectedTaskIds);
    setDeleteTask({
      taskId: selectedTaskIds[0],
      delete: true,
    });
  };

  return (
    <div className="tasks-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          setPreviewModernUI={setPreviewModernUI}
          recentWork={[]}
          setAuthentication={setAuthentication}
        />
        <main
          className={
            filtersPopupVisible || showNewTaskForm ? "popup-open" : ""
          }
        >
          <h2 className="page-title poppins-bold">My Tasks</h2>
          <div className="tasks-actions">
            <button
              className="filter-tasks poppins-medium"
              onClick={() => openFiltersPopup()}
            >
              Filter
            </button>
            <div className="tasks-actions-right">
              <button
                className={
                  "delete-tasks poppins-medium" +
                  (!hasSelectedTasks ? " feature-disabled" : "")
                }
                onClick={() => deleteSelectedTasks()}
                disabled={!hasSelectedTasks}
              >
                Delete
              </button>
              <button
                className="create-new-task poppins-medium"
                onClick={() => openNewTaskForm()}
              >
                Create new
              </button>
            </div>
          </div>
          {showFiltersPopup ? (
            <div
              className={
                "filters-popup" + (filtersPopupVisible ? " visible" : "")
              }
            >
              <button
                className="close-popup poppins-semibold"
                onClick={() => closeFiltersPopup()}
              >
                Close
              </button>
              <div className="state-section poppins-regular">
                <label htmlFor="task-states" className="task-states-label">
                  State
                </label>
                <div className="task-states">
                  <div className="to-do-section">
                    <input
                      type="radio"
                      name="task-state"
                      value="1"
                      id="to-do"
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="to-do" className="to-do-label">
                      To do
                    </label>
                  </div>
                  <div className="doing-section">
                    <input
                      type="radio"
                      name="task-state"
                      value="2"
                      id="doing"
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="doing" className="doing-label">
                      Doing
                    </label>
                  </div>
                  <div className="done-section">
                    <input
                      type="radio"
                      name="task-state"
                      value="3"
                      id="done"
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="done" className="done-label">
                      Done
                    </label>
                  </div>
                </div>
              </div>
              <div className="scope-section poppins-regular">
                <label htmlFor="task-scope" className="task-scope-label">
                  Project
                </label>
                <div className="task-scope">
                  <div>
                    <input
                      type="radio"
                      name="task-scope"
                      value="all"
                      id="scope-all"
                      defaultChecked
                      onChange={(e) => updateFilters("scope", e.target.value)}
                    />
                    <label htmlFor="scope-all">All</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="task-scope"
                      value="project"
                      id="scope-project"
                      onChange={(e) => updateFilters("scope", e.target.value)}
                    />
                    <label htmlFor="scope-project">Belongs to a project</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="task-scope"
                      value="standalone"
                      id="scope-standalone"
                      onChange={(e) => updateFilters("scope", e.target.value)}
                    />
                    <label htmlFor="scope-standalone">Standalone</label>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button
                  className="clear-filters poppins-semibold"
                  onClick={() => clearFilters()}
                >
                  Clear
                </button>
                <button
                  className="apply-filters poppins-semibold"
                  onClick={() => applyFilters()}
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          {showNewTaskForm ? (
            <NewTaskForm
              newTaskFormVisible={newTaskFormVisible}
              closeNewTaskForm={closeNewTaskForm}
              newTask={newTask}
              setNewTask={setNewTask}
              createNewTaskFn={createNewTaskFn}
              projects={userProjects}
            />
          ) : (
            ""
          )}
          <section className="tasks-section">
            {userTasksFetched ? (
              <table className="tasks poppins-regular">
                <thead>
                  <tr>
                    <th className="poppins-semibold select-column">
                      <input
                        type="checkbox"
                        checked={allDisplayedTasksSelected}
                        onChange={() => toggleSelectAllTasks()}
                        disabled={displayedTasks.length === 0}
                      />
                    </th>
                    <th className="poppins-semibold">Name</th>
                    <th className="poppins-semibold">State</th>
                    <th className="poppins-semibold">Project</th>
                    <th className="poppins-semibold">Assigned to</th>
                    <th className="poppins-semibold">Description</th>
                    <th className="poppins-semibold">Updated</th>
                    <th className="poppins-semibold">Updated by</th>
                    <th className="poppins-semibold">Created</th>
                    <th className="poppins-semibold">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map((task) => {
                    return (
                      <tr
                        key={task.task_id}
                        onClick={() => navigate(`/auth/${user}/modern/task/${task.task_id}`)}
                      >
                        <td className="select-column">
                          <div>
                            <input
                              type="checkbox"
                              checked={selectedTaskIds.includes(
                                task.task_id,
                              )}
                              onChange={() =>
                                toggleTaskSelection(task.task_id)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <span
                              className={taskStates.classes[task.state]}
                            >
                              <MdOutlineRadioButtonChecked />
                            </span>
                            {task.name}
                          </div>
                        </td>
                        <td>
                          <span
                            className={
                              "poppins-semibold " +
                              taskStates.classes[task.state]
                            }
                          >
                            {taskStates.labels[task.state]}
                          </span>
                        </td>
                        <td>
                          {task.project ? (
                            <span className="project-badge has-project">
                              {getProjectName(task.project)}
                            </span>
                          ) : (
                            <span className="project-badge standalone">
                              N/A
                            </span>
                          )}
                        </td>
                        <td>{task.assigned_to === userId ? "Me" : ""}</td>
                        <td className="description">{task.description}</td>
                        <td>{new Date(task.updated_on).toLocaleString()}</td>
                        <td>{task.updated_by === userId ? "Me" : ""}</td>
                        <td>{new Date(task.created_on).toLocaleString()}</td>
                        <td>{task.created_by === userId ? "Me" : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
