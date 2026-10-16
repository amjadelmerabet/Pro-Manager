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
import { RiAlarmWarningFill } from "react-icons/ri";
import { FaArrowDown, FaArrowUp, FaFire, FaRegSnowflake } from "react-icons/fa";

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

const taskPriorities = {
  labels: {
    1: "High",
    2: "Medium",
    3: "Low",
  },
  classes: {
    1: "high",
    2: "medium",
    3: "low",
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
  const [filtersCleared, setFiltersCleared] = useState(0);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskFormVisible, setNewTaskFormVisible] = useState(false);
  const [createNewTask, setCreateNewTask] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [newTask, setNewTask] = useState({ state: 1 });

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [deleteTask, setDeleteTask] = useState({
    taskId: "",
    delete: false,
  });
  const [taskDeleted, setTaskDeleted] = useState(0);
  const [sortBy, setSortBy] = useState({ type: 1 });
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [sortingPopupVisible, setSortingPopupVisible] = useState(false);
  const [sortingApplied, setSortingApplied] = useState(0);
  const [sortedList, setSortedList] = useState([]);
  const [filteredAndSortedList, setFilteredAndSortedList] = useState([]);

  const { token, sessionId } = JSON.parse(sessionStorage.getItem("authUser"));
  const displayedTasks =
    filtersApplied > 0
      ? sortingApplied > 0
        ? filteredAndSortedList
        : filteredTasksList
      : sortingApplied > 0
        ? sortedList
        : userTasks;
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
      userTasksFetched,
      setUserTasksFetched,
    );
  }, [fetchTasks, newTaskCreated, taskDeleted]);

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

  // BUG: When both filters and sorting are applied and you either create a new task or delete an existing task, the list of tasks doesn't update.

  useEffect(() => {
    if (filtersApplied > 0) {
      const { state, scope } = filters;
      const filteredList =
        sortingApplied > 0
          ? sortedList.filter((task) => {
              const matchesState = state ? task.state === state : true;
              const matchesScope =
                scope === "standalone"
                  ? !task.project
                  : scope === "project"
                    ? Boolean(task.project)
                    : true;
              return matchesState && matchesScope;
            })
          : userTasks.filter((task) => {
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
      if (sortingApplied > 0) {
        setFilteredAndSortedList(filteredList);
      }
    }
  }, [filtersApplied, userTasksFetched]);

  const getProjectName = (taskProjectId) => {
    const match = userProjects.filter(
      (project) => project.project_id === taskProjectId,
    );
    return match.length > 0 ? match[0].name : "";
  };

  useEffect(() => {
    if (sortingApplied > 0 || filtersCleared > 0) {
      sortList(userTasks, setSortedList);
      sortList(filteredTasksList, setFilteredAndSortedList);
    }
  }, [sortingApplied, filtersCleared, userTasksFetched]);

  const sortList = (list, setSortedList) => {
    const { type, by } = sortBy;
    const sortedTempList = [...list];
    switch (by) {
      case "state":
        if (type === 1) {
          sortedTempList.sort((a, b) => a.state - b.state);
        } else {
          sortedTempList.sort((a, b) => b.state - a.state);
        }
        break;
      case "priority":
        if (type === 1) {
          sortedTempList.sort((a, b) => a.priority - b.priority);
        } else {
          sortedTempList.sort((a, b) => b.priority - a.priority);
        }
        break;
      case "created":
        if (type === 1) {
          sortedTempList.sort(
            (a, b) =>
              new Date(a.created_on).getTime() -
              new Date(b.created_on).getTime(),
          );
        } else {
          sortedTempList.sort(
            (a, b) =>
              new Date(b.created_on).getTime() -
              new Date(a.created_on).getTime(),
          );
        }
        break;
      default:
        if (type === 1) {
          sortedTempList.sort(
            (a, b) =>
              new Date(a.updated_on).getTime() -
              new Date(b.updated_on).getTime(),
          );
        } else {
          sortedTempList.sort(
            (a, b) =>
              new Date(b.updated_on).getTime() -
              new Date(a.updated_on).getTime(),
          );
        }
        break;
    }
    setSortedList(sortedTempList);
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
    setTimeout(() => {
      setFiltersCleared(0);
    }, 50);
    closeFiltersPopup();
  };

  const clearFilters = () => {
    setFiltersApplied(0);
    setFilters({});
    setFilteredTasksList([]);
    setFiltersCleared(filtersCleared + 1);
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

  const truncateShortDescription = (description, maxWords = 16) => {
    let descWords = description.split(" ").length;
    if (descWords <= maxWords) {
      return description;
    } else {
      let descArr = description.split(" ");
      let newDesc = "";
      for (let i = 0; i < maxWords; i++) {
        newDesc += descArr[i];
        if (i < maxWords - 1) {
          newDesc += " ";
        } else {
          newDesc += " ...";
        }
      }
      return newDesc;
    }
  };

  const openSortingPopup = () => {
    setShowSortingPopup(true);
    setTimeout(() => {
      setSortingPopupVisible(true);
    }, 250);
  };

  const closeSortingPopup = () => {
    setSortingPopupVisible(false);
    setTimeout(() => {
      setShowSortingPopup(false);
    }, 250);
  };

  const updateSortBy = (sortByValue) => {
    setSortBy({ ...sortBy, by: sortByValue });
  };

  const updateSortByType = (sortByType) => {
    setSortBy({ ...sortBy, type: sortByType });
  };

  const applySort = () => {
    setSortingApplied(sortingApplied + 1);
    closeSortingPopup();
  };

  const clearSort = () => {
    setSortingApplied(0);
    setSortBy({ type: 1 });
    setSortedList([]);
  };

  return (
    <div className="tasks-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          setPreviewModernUI={setPreviewModernUI}
          useLocalRecentWork={true}
          setAuthentication={setAuthentication}
        />
        <main
          className={
            filtersPopupVisible || showNewTaskForm || sortingPopupVisible
              ? "popup-open"
              : ""
          }
        >
          <h2 className="page-title poppins-bold">My Tasks</h2>
          <div className="tasks-actions">
            <div className="tasks-actions-left">
              <button
                className={
                  "filter-tasks poppins-medium" +
                  (filtersApplied > 0 ? " active-filters" : "")
                }
                onClick={() => openFiltersPopup()}
              >
                Filter
              </button>
              <button
                className={
                  "sort-tasks poppins-medium" +
                  (sortingApplied > 0 ? " active-sort" : "")
                }
                onClick={() => openSortingPopup()}
              >
                Sort
              </button>
            </div>
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
              <div>
                <div className="state-section poppins-regular">
                  <label
                    htmlFor="task-state-label"
                    className="task-states-label poppins-medium"
                  >
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
                        checked={
                          Object.keys(filters).indexOf("state") !== -1
                            ? filters.state === 1
                              ? true
                              : false
                            : false
                        }
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
                        checked={
                          Object.keys(filters).indexOf("state") !== -1
                            ? filters.state === 2
                              ? true
                              : false
                            : false
                        }
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
                        checked={
                          Object.keys(filters).indexOf("state") !== -1
                            ? filters.state === 3
                              ? true
                              : false
                            : false
                        }
                        onChange={(e) => updateFilters("state", e.target.value)}
                      />
                      <label htmlFor="done" className="done-label">
                        Done
                      </label>
                    </div>
                  </div>
                </div>
                <div className="scope-section poppins-regular">
                  <label
                    htmlFor="task-scope"
                    className="task-scope-label poppins-medium"
                  >
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
                        checked={
                          Object.keys(filters).indexOf("scope") === -1
                            ? true
                            : filters.scope === "all"
                              ? true
                              : false
                        }
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
                        checked={
                          Object.keys(filters).indexOf("scope") !== -1
                            ? filters.scope === "project"
                              ? true
                              : false
                            : false
                        }
                        onChange={(e) => updateFilters("scope", e.target.value)}
                      />
                      <label htmlFor="scope-project">
                        Belongs to a project
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="task-scope"
                        value="standalone"
                        id="scope-standalone"
                        checked={
                          Object.keys(filters).indexOf("scope") !== -1
                            ? filters.scope === "standalone"
                              ? true
                              : false
                            : false
                        }
                        onChange={(e) => updateFilters("scope", e.target.value)}
                      />
                      <label htmlFor="scope-standalone">Standalone</label>
                    </div>
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
          {showSortingPopup ? (
            <div
              className={
                "sorting-popup" + (sortingPopupVisible ? " visible" : "")
              }
            >
              <button
                className="close-popup poppins-semibold"
                onClick={() => closeSortingPopup()}
              >
                Close
              </button>
              <div>
                <div className="poppins-regular">
                  <label
                    htmlFor="sort-by-label"
                    className="sort-by-label poppins-medium"
                  >
                    Sort by
                  </label>
                  <div className="sorting-choices">
                    <select
                      name="sort-by"
                      className="sort-by poppins-regular"
                      value={
                        Object.keys(sortBy).indexOf("by") !== -1
                          ? sortBy.by
                          : "default"
                      }
                      onChange={(e) => updateSortBy(e.target.value)}
                    >
                      <option value="default" defaultChecked>
                        Default
                      </option>
                      <option value="state">State</option>
                      <option value="priority">Priority</option>
                      <option value="updated">Updated</option>
                      <option value="created">Created</option>
                    </select>
                  </div>
                </div>
                <div className="poppins-regular">
                  <label
                    htmlFor="sort-by-type-label"
                    className="sort-by-type-label poppins-medium"
                  >
                    Sort by type
                  </label>
                  <div>
                    <div>
                      <input
                        type="radio"
                        name="sort-by-type"
                        value="1"
                        id="a-to-z"
                        onChange={(e) =>
                          updateSortByType(Number(e.target.value))
                        }
                        checked={
                          Object.keys(sortBy).indexOf("type") !== -1
                            ? sortBy.type === 1
                              ? true
                              : false
                            : true
                        }
                      />
                      <label htmlFor="a-to-z">A to Z</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="sort-by-type"
                        value="2"
                        id="z-to-a"
                        onChange={(e) =>
                          updateSortByType(Number(e.target.value))
                        }
                        checked={
                          Object.keys(sortBy).indexOf("type") !== -1
                            ? sortBy.type === 2
                              ? true
                              : false
                            : false
                        }
                      />
                      <label htmlFor="z-to-a">Z to A</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button
                  className="apply-sort poppins-semibold"
                  onClick={() => applySort()}
                >
                  Apply
                </button>
                <button
                  className="clear-sort poppins-semibold"
                  onClick={() => clearSort()}
                >
                  Clear
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
                      <div>
                        <input
                          type="checkbox"
                          checked={allDisplayedTasksSelected}
                          onChange={() => toggleSelectAllTasks()}
                          disabled={displayedTasks.length === 0}
                        />
                      </div>
                    </th>
                    <th className="poppins-semibold">Name</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "state"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        State
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "state" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "priority"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        Priority
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "priority" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Project</th>
                    <th className="poppins-semibold">Assigned to</th>
                    <th className="poppins-semibold">Description</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1
                          ? sortBy.by === "updated"
                            ? " sorted-by"
                            : ""
                          : " sorted-by")
                      }
                    >
                      <div>
                        Updated
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "updated" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : sortingApplied > 0 ? (
                          <span>
                            {sortBy.type === 1 ? (
                              <FaArrowUp />
                            ) : (
                              <FaArrowDown />
                            )}
                          </span>
                        ) : (
                          <span>
                            <FaArrowDown />
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Updated by</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "created"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        Created
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "created" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map((task) => {
                    return (
                      <tr
                        key={task.task_id}
                        onClick={() =>
                          navigate(`/auth/${user}/modern/task/${task.task_id}`)
                        }
                      >
                        <td className="select-column">
                          <div>
                            <input
                              type="checkbox"
                              checked={selectedTaskIds.includes(task.task_id)}
                              onChange={() => toggleTaskSelection(task.task_id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </td>
                        <td className="task-name">
                          <div>
                            <span className={taskStates.classes[task.state]}>
                              <MdOutlineRadioButtonChecked />
                            </span>
                            {task.name}
                          </div>
                        </td>
                        <td className="state">
                          <span
                            className={
                              "poppins-medium " + taskStates.classes[task.state]
                            }
                          >
                            {taskStates.labels[task.state]}
                          </span>
                        </td>
                        <td
                          className={
                            "poppins-medium priority " +
                            taskPriorities.classes[task.priority]
                          }
                        >
                          <div>
                            <span>
                              {task.priority === 1 ? (
                                <RiAlarmWarningFill />
                              ) : task.priority === 2 ? (
                                <FaFire />
                              ) : (
                                <FaRegSnowflake />
                              )}
                            </span>
                            {taskPriorities.labels[task.priority]}
                          </div>
                        </td>
                        <td className="parent-project">
                          {task.project ? (
                            <span className="project-badge has-project">
                              {getProjectName(task.project)}
                            </span>
                          ) : (
                            <span className="project-badge standalone">
                              N.A.
                            </span>
                          )}
                        </td>
                        <td>{task.assigned_to === userId ? "Me" : ""}</td>
                        <td className="description">
                          {truncateShortDescription(task.short_description)}
                        </td>
                        <td>
                          {new Date(task.updated_on).toLocaleString("fr")}
                        </td>
                        <td>{task.updated_by === userId ? "Me" : ""}</td>
                        <td>
                          {new Date(task.created_on).toLocaleString("fr")}
                        </td>
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
