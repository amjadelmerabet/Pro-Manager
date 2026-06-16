import { useEffect, useState } from "react";

// Components
import SideMenu from "./components/SideMenu";

// Utils
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
import getNewAccessTokenUtil from "./utils/getNewAccessTokenUtil";
import updatedMessageUtil from "../../../../utils/updatedMessageUtil";
import updateProjectUtil from "./utils/updateProjectUtil";

// Icons
import { MdOutlineRadioButtonChecked } from "react-icons/md";

import "./Dashboard.css";
import deleteProjectUtil from "./utils/deleteProjectUtil";
import createNewProjectUtil from "./utils/createNewProjectUtil";
import createNewTaskUtil from "./utils/createNewTaskUtil";
import updateTaskUtil from "./utils/updateTaskUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";

const projectStates = {
  labels: {
    1: "Not started",
    2: "In progress",
    3: "Completed",
  },
  classes: {
    1: "not-started",
    2: "in-progress",
    3: "completed",
  },
};

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

export default function DashboardPageModern({
  user,
  userId,
  previewModernUI,
  setPreviewModernUI,
}) {
  const [selectedTable, setSelectedTable] = useState("projects");
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tries, setTries] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [reportsStats, setReportsStats] = useState({
    projects: {
      closeToDeadline: 0,
      overdue: 0,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
    },
    tasks: {
      today: 0,
      inbox: 0,
      toDo: 0,
      doing: 0,
      done: 0,
    },
  });
  const [userProjects, setUserProjects] = useState([]);
  const [fetchUserProjects, setFetchUserProjects] = useState(0);
  const [userProjectsFetched, setUserProjectsFetched] = useState(false);
  const [userTasks, setUserTasks] = useState([]);
  const [fetchUserTasks, setFetchUserTasks] = useState(0);
  const [userTasksFetched, setUserTasksFetched] = useState(false);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [projectPopupVisible, setProjectPopupVisible] = useState(false);
  const [popupProject, setPopupProject] = useState({});
  const [projectUpdates, setProjectUpdates] = useState({});
  const [updateProject, setUpdateProject] = useState({
    projectId: "",
    update: false,
  });
  const [projectUpdated, setProjectUpdated] = useState(0);
  const [loadingRecentWork, setLoadingRecentWork] = useState({
    list: [],
    ready: false,
  });
  const [recentWork, setRecentWork] = useState([]);
  const [deleteProject, setDeleteProject] = useState({
    projectId: "",
    delete: false,
  });
  const [projectDeleted, setProjectDeleted] = useState(0);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectFormVisible, setNewProjectFormVisible] = useState(false);
  const [createNewProject, setCreateNewProject] = useState(false);
  const [newProjectCreated, setNewProjectCreated] = useState(0);
  const [newProject, setNewProject] = useState({});
  const [showNewTaskForm, setShowNewTaskFrom] = useState(false);
  const [newTaskFromVisible, setNewTaskFormVisible] = useState(false);
  const [createNewTask, setCreateNewTask] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [newTask, setNewTask] = useState({ priority: 2 });
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [taskPopupVisible, setTaskPopupVisible] = useState(false);
  const [popupTask, setPopupTask] = useState({});
  const [taskUpdates, setTaskUpdates] = useState({});
  const [updateTask, setUpdateTask] = useState({
    taskId: "",
    update: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(0);
  const [deleteTask, setDeleteTask] = useState({
    taskId: "",
    delete: false,
  });
  const [taskDeleted, setTaskDeleted] = useState(false);

  const { token, sessionId } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    fetchUserProjectsUtil(
      user,
      userId,
      token,
      sessionId,
      tokenValidated,
      setTokenValidated,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      reportsStats,
      setReportsStats,
      setUserProjectsFetched,
      setUserProjects,
    );
  }, [
    fetchUserProjects,
    projectUpdated,
    newProjectCreated,
    newTaskCreated,
    taskUpdated,
  ]);

  useEffect(() => {
    if (projectDeleted > 0) {
      closeProjectPopup();
      setTimeout(() => {
        fetchUserProjectsUtil(
          user,
          userId,
          token,
          sessionId,
          tokenValidated,
          setTokenValidated,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          reportsStats,
          setReportsStats,
          setUserProjectsFetched,
          setUserProjects,
        );
      }, 250);
    }
  }, [projectDeleted]);

  useEffect(() => {
    if (taskDeleted > 0) {
      closeTaskPopup();
      setTimeout(() => {
        fetchUserTasksUtil(
          user,
          userId,
          token,
          sessionId,
          tokenValidated,
          setTokenValidated,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          reportsStats,
          setReportsStats,
          setUserTasksFetched,
          setUserTasks,
        );
      }, 250);
    }
  }, [taskDeleted]);

  useEffect(() => {
    if (fetchUserTasks > 0 || userProjectsFetched) {
      if (userProjectsFetched && showProjectPopup) {
        const project = userProjects.filter((project) => {
          if (project.project_id === popupProject.project_id) {
            return project;
          }
        });
        setPopupProject(project[0]);
      }
      fetchUserTasksUtil(
        user,
        userId,
        token,
        sessionId,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        reportsStats,
        setReportsStats,
        setUserTasksFetched,
        setUserTasks,
      );
    }
  }, [fetchUserTasks, userProjectsFetched]);

  // useEffect(() => {
  //   if (userProjectsFetched) {
  //     setLoadingRecentWork({ ...recentWork, list: [...userProjects] });
  //   }
  // }, [userProjectsFetched]);

  useEffect(() => {
    if (userTasksFetched) {
      if (showTaskPopup) {
        const task = userTasks.filter((task) => {
          if (task.task_id === popupTask.task_id) {
            return task;
          }
        });
        setPopupTask(task[0]);
      }
      setLoadingRecentWork({
        ready: true,
        list: [...userProjects, ...userTasks],
      });
    }
  }, [userTasksFetched]);

  useEffect(() => {
    if (newProjectCreated > 0) {
      setNewProjectFormVisible(false);
      setTimeout(() => {
        setShowNewProjectForm(false);
      }, 250);
    }
  }, [newProjectCreated]);

  useEffect(() => {
    if (newTaskCreated > 0) {
      setNewTaskFormVisible(false);
      setTimeout(() => {
        setShowNewTaskFrom(false);
      }, 250);
    }
  }, [newTaskCreated]);

  useEffect(() => {
    if (loadingRecentWork.ready) {
      setUserProjectsFetched(false);
      setUserTasksFetched(false);
      const orderedRecentWork = loadingRecentWork.list.sort((work1, work2) => {
        return (
          new Date(work2.updated_on).getTime() -
          new Date(work1.updated_on).getTime()
        );
      });
      let finalList = orderedRecentWork
        .slice(0, 5)
        .map((recentWork) => recentWork.name);
      setRecentWork(finalList);
    }
  }, [loadingRecentWork]);

  useEffect(() => {
    if (createNewProject) {
      createNewProjectUtil(
        newProject,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        newProjectCreated,
        setNewProjectCreated,
        setCreateNewProject,
      );
    }
  }, [createNewProject]);

  useEffect(() => {
    if (updateProject.update) {
      updateProjectUtil(
        updateProject.projectId,
        { ...projectUpdates, updated_by: userId },
        user,
        token,
        sessionId,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        projectUpdated,
        setProjectUpdated,
        updateProject,
        setUpdateProject,
      );
    }
  }, [updateProject]);

  useEffect(() => {
    if (deleteProject.delete) {
      deleteProjectUtil(
        deleteProject.projectId,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        projectDeleted,
        setProjectDeleted,
        deleteProject,
        setDeleteProject,
        newAccessToken,
        setNewAccessToken,
      );
    }
  }, [deleteProject]);

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
    if (updateTask.update) {
      updateTaskUtil(
        { ...taskUpdates, updated_by: userId },
        user,
        sessionId,
        token,
        updateTask.taskId,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        taskUpdated,
        setTaskUpdated,
        updateTask,
        setUpdateTask,
      );
    }
  }, [updateTask]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getNewAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        fetchUserProjects,
        setFetchUserProjects,
        fetchUserTasks,
        setFetchUserTasks,
        updateProject,
        setUpdateProject,
        deleteProject,
        setDeleteProject,
        updateTask,
        setUpdateTask,
        deleteTask,
        setDeleteTask,
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (deleteTask.delete) {
      deleteTaskUtil(
        deleteTask.taskId,
        token,
        user,
        sessionId,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        taskDeleted,
        setTaskDeleted,
        deleteTask,
        setDeleteTask,
      );
    }
  }, [deleteTask]);

  const showTable = (table) => {
    setSelectedTable(table);
  };

  const openProjectPopup = (projectId) => {
    const project = userProjects.filter((project) => {
      if (project.project_id === projectId) {
        return project;
      }
    });
    setPopupProject(project[0]);
    setProjectUpdates({
      ...projectUpdates,
      description: project[0].description,
    });
    setShowProjectPopup(true);
    setTimeout(() => {
      setProjectPopupVisible(true);
    }, 250);
  };

  const closeProjectPopup = () => {
    setProjectPopupVisible(false);
    setTimeout(() => {
      setShowProjectPopup(false);
    }, 250);
    setPopupProject({});
  };

  const updateProjectDescription = (description) => {
    setProjectUpdates({
      ...projectUpdates,
      description: description,
    });
  };

  const saveUpdates = () => {
    let save = false;
    Object.keys(projectUpdates).forEach((key) => {
      if (projectUpdates[key] !== popupProject[key]) {
        save = true;
      }
    });
    if (save) {
      setUpdateProject({ projectId: popupProject.project_id, update: true });
    }
  };

  const updateProjectState = (state) => {
    setProjectUpdates({
      ...projectUpdates,
      state: state,
    });
    setUpdateProject({ projectId: popupProject.project_id, update: true });
  };

  const deleteProjectFn = () => {
    setDeleteProject({ projectId: popupProject.project_id, delete: true });
  };

  const openNewProjectForm = () => {
    setShowNewProjectForm(true);
    setTimeout(() => {
      setNewProjectFormVisible(true);
    }, 250);
  };

  const closeNewProjectForm = () => {
    setNewProjectFormVisible(false);
    setNewProject({});
    setTimeout(() => {
      setShowNewProjectForm(false);
    }, 250);
  };

  const createNewProjectFn = () => {
    setNewProject({
      ...newProject,
      owner: userId,
      updated_by: userId,
      created_by: userId,
    });
    setCreateNewProject(true);
  };

  const openNewTaskForm = () => {
    setShowNewTaskFrom(true);
    setTimeout(() => {
      setNewTaskFormVisible(true);
    }, 250);
  };

  const closeNewTaskForm = () => {
    setNewTaskFormVisible(false);
    setNewTask({});
    setTimeout(() => {
      setShowNewTaskFrom(false);
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

  const openTaskPopup = (taskId) => {
    const task = userTasks.filter((userTask) => {
      if (userTask.task_id === taskId) {
        return userTask;
      }
    });
    setPopupTask(task[0]);
    setTaskUpdates({
      ...taskUpdates,
      short_description: task[0].short_description,
      description: task[0].description,
    });
    setShowTaskPopup(true);
    setTimeout(() => {
      setTaskPopupVisible(true);
    }, 250);
  };

  const closeTaskPopup = () => {
    setTaskPopupVisible(false);
    setTimeout(() => {
      setShowTaskPopup(false);
    }, 250);
  };

  const updateTaskState = (state) => {
    setTaskUpdates({
      ...taskUpdates,
      state: state,
    });
    setUpdateTask({ taskId: popupTask.task_id, update: true });
  };

  const deleteTaskFn = () => {
    setDeleteTask({ taskId: popupTask.task_id, delete: true });
  };

  return (
    <div className="dashboard-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          previewModernUI={previewModernUI}
          setPreviewModernUI={setPreviewModernUI}
          recentWork={recentWork}
        />
        <main
          className={
            "poppins-regular" +
            (projectPopupVisible ||
            taskPopupVisible ||
            showNewProjectForm ||
            showNewTaskForm
              ? " popup-open"
              : "")
          }
        >
          <h2 className="page-title poppins-bold">My Dashboard</h2>
          <div>
            <section>
              <div className="top-section">
                <div className="dashboard-reports">
                  <div className="section projects">
                    <div className="section-title poppins-bold">Projects</div>
                    <div className="section-reports">
                      <div
                        className={
                          "dashboard-report" +
                          (reportsStats.projects.closeToDeadline > 0
                            ? " close-to-deadline attention"
                            : "")
                        }
                      >
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Close to deadline
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.projects.closeToDeadline}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "dashboard-report" +
                          (reportsStats.projects.overdue > 0
                            ? " overdue attention"
                            : "")
                        }
                      >
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Overdue
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.projects.overdue}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Not started
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.projects.notStarted}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            In progress
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.projects.inProgress}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report completed">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Completed
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.projects.completed}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="section tasks">
                    <div className="section-title poppins-bold">Tasks</div>
                    <div className="section-reports">
                      <div className="dashboard-report today">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Today
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.tasks.today}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Inbox
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.tasks.inbox}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            To do
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.tasks.toDo}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Doing
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.tasks.doing}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-report done">
                        <div className="report-container">
                          <div className="report-title poppins-medium">
                            Done
                          </div>
                          <div className="value poppins-bold">
                            {reportsStats.tasks.done}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-section">
                <div className="controls poppins-medium">
                  <div
                    className={
                      "poppins-medim" +
                      (selectedTable === "projects" ? " selected" : "")
                    }
                    onClick={() => showTable("projects")}
                  >
                    Projects
                  </div>
                  <div
                    className={
                      "poppins-medim" +
                      (selectedTable === "tasks" ? " selected" : "")
                    }
                    onClick={() => showTable("tasks")}
                  >
                    Tasks
                  </div>
                </div>
                {selectedTable === "tasks" ? (
                  <table className="tasks-table">
                    <thead>
                      <tr>
                        <th className="poppins-medium">Name</th>
                        <th className="poppins-medium">State</th>
                        <th className="poppins-medium">Priority</th>
                        <th className="poppins-medium">Assignee</th>
                        <th className="poppins-medium">Project</th>
                        <th className="poppins-medium">Updated</th>
                        <th className="poppins-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTasks.map((userTask, index) => {
                        const updated = new Date(
                          userTask.updated_on,
                        ).toLocaleString();
                        const created = new Date(
                          userTask.created_on,
                        ).toLocaleString();
                        const project = userProjects.filter((project) => {
                          if (project.project_id === userTask.project) {
                            return project;
                          }
                        });
                        return (
                          <tr
                            key={index}
                            onClick={() => openTaskPopup(userTask.task_id)}
                          >
                            <td>{userTask.name}</td>
                            <td>
                              <span
                                className={
                                  "poppins-semibold " +
                                  taskStates.classes[userTask.state]
                                }
                              >
                                {taskStates.labels[userTask.state]}
                              </span>
                            </td>
                            <td>{taskPriorities.labels[userTask.priority]}</td>
                            <td>
                              {userTask.assigned_to === userId ? "Me" : ""}
                            </td>
                            <td>{project.length > 0 ? project[0].name : ""}</td>
                            <td>{updated}</td>
                            <td>{created}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th className="poppins-medium">Name</th>
                        <th className="poppins-medium">State</th>
                        <th className="poppins-medium">Owner</th>
                        <th className="poppins-medium">Deadline</th>
                        <th className="poppins-medium">Updated</th>
                        <th className="poppins-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProjects.map((userProject, index) => {
                        const deadline = new Date(
                          userProject.deadline,
                        ).toLocaleString();
                        const updated = new Date(
                          userProject.updated_on,
                        ).toLocaleString();
                        const created = new Date(
                          userProject.created_on,
                        ).toLocaleString();
                        return (
                          <tr
                            key={index}
                            onClick={() =>
                              openProjectPopup(userProject.project_id)
                            }
                          >
                            <td>
                              <div>
                                <span
                                  className={
                                    projectStates.classes[userProject.state]
                                  }
                                >
                                  <MdOutlineRadioButtonChecked />
                                </span>
                                {userProject.name}
                              </div>
                            </td>
                            <td>
                              <span
                                className={
                                  "poppins-semibold " +
                                  projectStates.classes[userProject.state]
                                }
                              >
                                {projectStates.labels[userProject.state]}
                              </span>
                            </td>
                            <td>{userProject.owner === userId ? "Me" : ""}</td>
                            <td>{deadline}</td>
                            <td>{updated}</td>
                            <td>{created}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="quick-actions">
                <button
                  className="new-task poppins-medium"
                  onClick={() => openNewTaskForm()}
                >
                  New task
                </button>
                <button
                  className="new-project poppins-medium"
                  onClick={() => openNewProjectForm()}
                >
                  New project
                </button>
              </div>
            </section>
            <section>
              <div className="recent-activities">
                <h3 className="section-title poppins-medium">
                  Recent Activities
                </h3>
              </div>
            </section>
            {showProjectPopup ? (
              <div
                className={
                  "project-popup" + (projectPopupVisible ? " visible" : "")
                }
              >
                <div className="project-header">
                  <div
                    className={
                      "project-state poppins-semibold " +
                      projectStates.classes[popupProject.state]
                    }
                  >
                    {projectStates.labels[popupProject.state]}
                  </div>
                  <h3 className="project-name poppins-semibold">
                    {popupProject.name}
                  </h3>
                </div>
                <div className="project-info">
                  <div className="owner">
                    Owned by {popupProject.owner === userId ? "Me" : ""}
                  </div>
                  <div className="updated">
                    Updated{" "}
                    {updatedMessageUtil(new Date(popupProject.updated_on))}
                  </div>
                </div>
                <div className="project-details">
                  <div className="description-label poppins-medium">
                    Description
                  </div>
                  <textarea
                    className="description poppins-regular"
                    value={projectUpdates.description}
                    onChange={(e) => updateProjectDescription(e.target.value)}
                  />
                </div>
                <div className="project-tasks">
                  <h3 className="title">Tasks</h3>
                  <table className="project-tasks-table">
                    <thead>
                      <tr>
                        <th className="poppins-medium">Name</th>
                        <th className="poppins-medium">State</th>
                        <th className="poppins-medium">Assignee</th>
                        <th className="poppins-medium">Updated</th>
                        <th className="poppins-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTasks.map((task, index) => {
                        if (task.project === popupProject.project_id) {
                          const updated = new Date(
                            task.updated_on,
                          ).toLocaleString();
                          const created = new Date(
                            task.created_on,
                          ).toLocaleString();
                          return (
                            <tr className="project-task" key={index}>
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
                              <td>{task.assigned_to === userId ? "Me" : ""}</td>
                              <td>{updated}</td>
                              <td>{created}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="actions">
                  <div className="project-actions">
                    {popupProject.state === 1 ? (
                      <button
                        className="action poppins-regular"
                        onClick={() => updateProjectState(2)}
                      >
                        Start
                      </button>
                    ) : (
                      ""
                    )}
                    {popupProject.state !== 1 ? (
                      <button
                        className="action poppins-regular"
                        onClick={() => updateProjectState(1)}
                      >
                        Reset
                      </button>
                    ) : (
                      ""
                    )}
                    {popupProject.state !== 3 ? (
                      <button
                        className="action poppins-regular"
                        onClick={() => updateProjectState(3)}
                      >
                        Complete
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <button
                      className="action poppins-regular delete"
                      onClick={() => deleteProjectFn()}
                    >
                      Delete
                    </button>
                    <button
                      className={
                        "action poppins-regular save" +
                        (Object.keys(projectUpdates).length !== 0
                          ? " enable-save"
                          : "")
                      }
                      onClick={() => saveUpdates()}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <button
                  className="close-popup poppins-semibold"
                  onClick={() => closeProjectPopup()}
                >
                  Close
                </button>
              </div>
            ) : showTaskPopup ? (
              <div
                className={"task-popup" + (taskPopupVisible ? " visible" : "")}
              >
                <div className="task-header">
                  <div
                    className={
                      "task-state poppins-semibold " +
                      taskStates.classes[popupTask.state]
                    }
                  >
                    {taskStates.labels[popupTask.state]}
                  </div>
                  <div className="task-name poppins-semibold">
                    {popupTask.name}
                  </div>
                </div>
                <div className="task-info poppins-regular">
                  <div className="assigned-to">
                    Assigned to {popupTask.assigned_to === userId ? "Me" : ""}
                  </div>
                  <div className="updated">
                    Updated {updatedMessageUtil(new Date(popupTask.updated_on))}
                  </div>
                </div>
                <div className="task-details">
                  <div className="short-description-section">
                    <label
                      htmlFor="short-description"
                      className="short-description-label poppins-medium"
                    >
                      Short description
                    </label>
                    <input
                      type="text"
                      name="short-description"
                      className="short-description poppins-regular"
                      value={popupTask.short_description}
                      onChange={() => console.log("Test")}
                    />
                  </div>
                  <div className="description-section">
                    <label
                      htmlFor="description"
                      className="description-label poppins-medium"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="description poppins-regular"
                      value={popupTask.description}
                      onChange={() => console.log("Test")}
                    />
                  </div>
                </div>
                <div className="actions">
                  <div className="task-actions">
                    {popupTask.state === 1 ? (
                      <button
                        className="action start poppins-regular"
                        onClick={() => updateTaskState(2)}
                      >
                        Start
                      </button>
                    ) : (
                      ""
                    )}
                    {popupTask.state !== 1 ? (
                      <button
                        className="action reset poppins-regular"
                        onClick={() => updateTaskState(1)}
                      >
                        Reset
                      </button>
                    ) : (
                      ""
                    )}
                    {popupTask.state !== 3 ? (
                      <button
                        className="action finish poppins-regular"
                        onClick={() => updateTaskState(3)}
                      >
                        Finish
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  {popupTask.project ? (
                    <div className="project poppins-medium">
                      Project:{" "}
                      <span className="parent-project">
                        {
                          userProjects.filter(
                            (project) =>
                              project.project_id === popupTask.project,
                          )[0].name
                        }
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <button
                      className="action delete poppins-regular"
                      onClick={() => deleteTaskFn()}
                    >
                      Delete
                    </button>
                    <button className="action save poppins-regular">
                      Save
                    </button>
                  </div>
                </div>
                <button
                  className="close-popup poppins-semibold"
                  onClick={() => closeTaskPopup()}
                >
                  Close
                </button>
              </div>
            ) : (
              ""
            )}
            {showNewProjectForm ? (
              <div
                className={
                  "new-project-form poppins-regular" +
                  (newProjectFormVisible ? " visible" : "")
                }
              >
                <button
                  className="close-form poppins-semibold"
                  onClick={() => closeNewProjectForm()}
                >
                  Close
                </button>
                <h2 className="form-title poppins-bold">New Project</h2>
                <div>
                  <div className="project-name-section">
                    <label
                      htmlFor="project-name"
                      className="project-name-label poppins-medium"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="project-name"
                      className="project-name poppins-regular"
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="project-deadline-section">
                    <label
                      htmlFor="project-deadline"
                      className="project-deadline-label poppins-medium"
                    >
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="project-deadline"
                      className="project-deadline poppins-regular"
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          deadline: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="project-description-section">
                    <label
                      htmlFor="project-description"
                      className="project-description-label poppins-medium"
                    >
                      Description
                    </label>
                    <textarea
                      name="project-description"
                      className="project-description poppins-regular"
                      rows="12"
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className="create-project poppins-semibold"
                    onClick={() => createNewProjectFn()}
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : showNewTaskForm ? (
              <div
                className={
                  "new-task-form poppins-regular" +
                  (newTaskFromVisible ? " visible" : "")
                }
              >
                <button
                  className="close-form poppins-semibold"
                  onClick={() => closeNewTaskForm()}
                >
                  Close
                </button>
                <h2 className="form-title poppins-bold">New Task</h2>
                <div>
                  <div className="task-name-section">
                    <label
                      htmlFor="task-name"
                      className="task-name-label poppins-medium"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="task-name"
                      className="task-name poppins-regular"
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="task-priority-section">
                    <label
                      htmlFor="task-priority"
                      className="task-priority-label poppins-medium"
                    >
                      Priority
                    </label>
                    <div>
                      <div className="high-priority">
                        <input
                          type="radio"
                          name="task-priority"
                          className="task-priority poppins-regular"
                          value="1"
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              priority: Number(e.target.value),
                            })
                          }
                        />
                        <label
                          htmlFor="task-priority"
                          className="high-priority-label poppins-regular"
                        >
                          High
                        </label>
                      </div>
                      <div className="medium-priority">
                        <input
                          type="radio"
                          name="task-priority"
                          className="task-priority poppins-regular"
                          value="2"
                          defaultChecked
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              priority: Number(e.target.value),
                            })
                          }
                        />
                        <label
                          htmlFor="task-priority"
                          className="medium-priority-label poppins-regular"
                        >
                          Medium
                        </label>
                      </div>
                      <div className="low-priority">
                        <input
                          type="radio"
                          name="task-priority"
                          className="task-priority poppins-regular"
                          value="3"
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              priority: Number(e.target.value),
                            })
                          }
                        />
                        <label
                          htmlFor="task-priority"
                          className="low-priority-label poppins-regular"
                        >
                          Low
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="task-short-description-section">
                    <label
                      htmlFor="task-short-description"
                      className="task-short-description-label poppins-medium"
                    >
                      Short description
                    </label>
                    <input
                      type="text"
                      name="task-short-description"
                      className="task-short-description poppins-regular"
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          short_description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="task-description-section">
                    <label
                      htmlFor="task-description"
                      className="task-description-label poppins-medium"
                    >
                      Description
                    </label>
                    <textarea
                      type="text"
                      name="task-description"
                      className="task-description poppins-regular"
                      rows="12"
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>
                  <button
                    className="create-task poppins-semibold"
                    onClick={() => createNewTaskFn()}
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
