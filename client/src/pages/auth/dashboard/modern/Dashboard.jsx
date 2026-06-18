import { useEffect, useState } from "react";

// Components
import SideMenu from "./components/SideMenu";
import DashboardReports from "./components/DashboardReports";
import ProjectsTable from "./components/ProjectsTable";
import TasksTable from "./components/TasksTable";

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
import ProjectPopup from "./components/ProjectPopup";
import TaskPopup from "./components/TaskPopup";
import NewProjectForm from "./components/NewProjectForm";
import NewTaskForm from "./components/NewTaskForm";

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
                <DashboardReports reportsStats={reportsStats} />
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
                  <TasksTable
                    userTasks={userTasks}
                    userProjects={userProjects}
                    openTaskPopup={openTaskPopup}
                    taskStates={taskStates}
                    taskPriorities={taskPriorities}
                    userId={userId}
                  />
                ) : (
                  <ProjectsTable
                    userProjects={userProjects}
                    projectStates={projectStates}
                    openProjectPopup={openProjectPopup}
                    userId={userId}
                  />
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
              <ProjectPopup
                projectPopupVisible={projectPopupVisible}
                projectStates={projectStates}
                popupProject={popupProject}
                userId={userId}
                projectUpdates={projectUpdates}
                updateProjectDescription={updateProjectDescription}
                userTasks={userTasks}
                taskStates={taskStates}
                updateProjectState={updateProjectState}
                deleteProjectFn={deleteProjectFn}
                saveUpdates={saveUpdates}
                closeProjectPopup={closeProjectPopup}
              />
            ) : showTaskPopup ? (
              <TaskPopup
                taskPopupVisible={taskPopupVisible}
                taskStates={taskStates}
                popupTask={popupTask}
                userId={userId}
                updateTaskState={updateTaskState}
                userProjects={userProjects}
                deleteTaskFn={deleteTaskFn}
                closeTaskPopup={closeTaskPopup}
              />
            ) : (
              ""
            )}
            {showNewProjectForm ? (
              <NewProjectForm
                newProjectFormVisible={newProjectFormVisible}
                closeNewProjectForm={closeNewProjectForm}
                newProject={newProject}
                setNewProject={setNewProject}
                createNewProjectFn={createNewProjectFn}
              />
            ) : showNewTaskForm ? (
              <NewTaskForm
                newTaskFromVisible={newTaskFromVisible}
                closeNewTaskForm={closeNewTaskForm}
                newTask={newTask}
                setNewTask={setNewTask}
                createNewTaskFn={createNewTaskFn}
              />
            ) : (
              ""
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
