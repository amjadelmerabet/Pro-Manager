// Hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

// Icons
import { IconContext } from "react-icons/lib";
import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft, FaFire, FaRegSnowflake } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { TbFolder, TbSquareCheck, TbSquarePlus } from "react-icons/tb";
import { RiAlarmWarningFill } from "react-icons/ri";

// Components
import AuthHeader from "../components/AuthHeader";
import { Link } from "react-router";
import NewTaskPopup from "../tasks/components/NewTaskPopup";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserProjectUtil from "./utils/fetchUserProjectUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import updateProjectUtil from "./utils/updateProjectUtil";
import deleteProjectUtil from "./utils/deleteProjectUtil";
import fetchProjectTasksUtil from "./utils/fetchProjectTasksUtil";
import createNewProjectTaskUtil from "./utils/createNewProjectTaskUtil";

// Styles
import "./Project.css";

export default function Project({ user, setAuthentication }) {
  const [projectObject, setProjectObject] = useState({});
  const [projectUpdates, setProjectUpdates] = useState({});
  const [projectUpdated, setProjectUpdated] = useState({
    counter: 0,
    update: false,
  });
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [tries, setTries] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [loadProject, setLoadProject] = useState(0);
  const [updatedsuccessfully, setUpdatedsuccessfully] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [editDescriptionInput, setEditDescriptionInput] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editButtonVisible, setEditButtonVisible] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [loadTasks, setLoadTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [hoveredOverTask, setHoveredOverTask] = useState("");
  const [projectFetched, setProjectFetched] = useState(false);
  const [openNewTaskPopup, setOpenNewTaskPopup] = useState({
    active: false,
    type: "task",
  });
  const [newTask, setNewTask] = useState({});
  const [newTaskToCreate, setNewTaskToCreate] = useState(0);

  const location = useLocation();
  const pathname = location.pathname;
  const array = pathname
    .replace("/auth/", "")
    .replace("/project", "")
    .split("/");
  // const userId = array[0];
  const projectId = array[1];

  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task");
  const view = searchParams.get("view");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    if (
      (!projectUpdated.update && projectUpdated.counter === 0) ||
      loadProject
    ) {
      // fetchProjectAPI();
      fetchUserProjectUtil(
        tokenValidated,
        user,
        token,
        projectId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjectObject,
        setProjectNotFound,
        setTokenValidated,
        setProjectFetched
      );
    }
  }, [updatedsuccessfully, loadProject]);

  useEffect(() => {
    if (loadTasks || projectFetched) {
      fetchProjectTasksUtil(
        projectId,
        token,
        setTasks,
        tokenValidated,
        setTokenValidated,
        user,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken
      );
    }
  }, [loadTasks, projectFetched]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      // getAccessTokenAPI();
      getAccessTokenUtil(
        user,
        setTokenValidated,
        setTries,
        loadProject,
        setLoadProject,
        newAccessToken,
        projectUpdated,
        setProjectUpdated,
        setProjectDeleted,
        setLoadTasks
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (projectUpdated.update) {
      // updateProjectAPI();
      updateProjectUtil(
        tokenValidated,
        user,
        token,
        projectId,
        projectUpdates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedsuccessfully,
        setTokenValidated
      );
    }
  }, [projectUpdated]);

  let navigate = useNavigate();

  useEffect(() => {
    if (projectDeleted) {
      // deleteProjectAPI();
      deleteProjectUtil(
        tokenValidated,
        user,
        token,
        projectId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTokenValidated,
        navigate
      );
    }
  }, [projectDeleted]);

  useEffect(() => {
    if (updatedsuccessfully) {
      setTimeout(() => {
        setProjectUpdated({ counter: 0, update: false });
        setProjectUpdates({});
        setUpdatedsuccessfully(false);
      }, 250);
    }
  }, [updatedsuccessfully]);

  useEffect(() => {
    if (newTaskToCreate > 0) {
      createNewProjectTaskUtil(
        tokenValidated,
        setTokenValidated,
        user,
        token,
        newTask,
        setLoadTasks,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        openNewTaskPopup,
        setOpenNewTaskPopup
      );
    }
  }, [newTaskToCreate]);

  const startProject = () => {
    setProjectUpdates({ state: 2, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
  };

  const completeProject = () => {
    setProjectUpdates({ state: 3, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
  };

  const resetProject = () => {
    setProjectUpdates({ state: 1, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
  };

  const deleteProject = () => {
    setProjectDeleted(true);
  };

  let updated = new Date(projectObject.updated_on);
  let updatedStatus = updatedMessageUtil(updated);

  let projectDeadline = new Date(projectObject.deadline);

  const showEditDescriptionButton = () => {
    setEditButtonVisible(true);
  };

  const hideEditDescriptionButton = () => {
    setEditButtonVisible(false);
  };

  const editDescription = (description) => {
    setEditedDescription(description);
    setEditingDescription(true);
    setEditDescriptionInput(true);
  };

  const updateDescription = () => {
    setProjectUpdates({ description: editedDescription, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
    setEditDescriptionInput(false);
    setEditingDescription(false);
  };

  const cancelDescriptionUpdate = () => {
    setEditingDescription(false);
    setEditDescriptionInput(false);
  };

  const hoverOverTask = (taskId) => {
    setHoveredOverTask(taskId);
  };

  const hoverOverTaskEnded = () => {
    setHoveredOverTask("");
  };

  const createNewTask = (projectId) => {
    setNewTask({
      ...newTask,
      project: projectId,
      assigned_to: user,
      created_by: user,
      updated_by: user,
    });
    setNewTaskToCreate(newTaskToCreate + 1);
  };

  return (
    <div className="project-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="container">
        {Object.keys(projectObject).length === 0 && !projectNotFound ? (
          <div className="loading-project poppins-regular">
            Loading project content ...
          </div>
        ) : !projectNotFound ? (
          <div className="project">
            <div className="project-header">
              <div className="left">
                <h2 className="project-title poppins-bold">
                  <IconContext.Provider
                    value={{
                      style: {
                        color: "var(--primary-color)",
                        fontSize: "28px",
                      },
                    }}
                  >
                    <TbFolder className="project-icon" />
                  </IconContext.Provider>
                  {projectObject.name}
                </h2>
                <h5
                  className={
                    "project-state poppins-semibold" +
                    (projectObject.state === 1
                      ? " not-started"
                      : projectObject.state === 2
                        ? " in-progress"
                        : " completed")
                  }
                >
                  <span
                    className={
                      "state" +
                      (projectObject.state === 1
                        ? " not-started-state"
                        : projectObject.state === 2
                          ? " in-progress-state"
                          : " completed-state")
                    }
                  ></span>
                  {projectObject.state === 1
                    ? "Not started"
                    : projectObject.state === 2
                      ? "In progress"
                      : "Completed"}
                </h5>
              </div>
              <div className="right">
                <div className="project-actions">
                  {projectObject.state !== 1 ? (
                    <button
                      className="reset-project poppins-regular"
                      onClick={() => resetProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: {
                            color: "rgb(45, 180, 245)",
                            fontSize: "24px",
                          },
                        }}
                      >
                        <BiReset />
                      </IconContext.Provider>
                      <span>Reset</span>
                    </button>
                  ) : (
                    ""
                  )}
                  {projectObject.state === 1 ? (
                    <button
                      className="start-project poppins-regular"
                      onClick={() => startProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: {
                            color: "rgb(245, 200, 45)",
                            fontSize: "24px",
                          },
                        }}
                      >
                        <GrFormClock />
                      </IconContext.Provider>
                      <span>Start</span>
                    </button>
                  ) : (
                    ""
                  )}
                  {projectObject.state !== 3 ? (
                    <button
                      className="complete-project poppins-regular"
                      onClick={() => completeProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: { color: "rgb(0, 200, 45)", fontSize: "24px" },
                        }}
                      >
                        <IoCheckmark />
                      </IconContext.Provider>
                      <span>Complete</span>
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    className="delete-project poppins-regular"
                    onClick={() => deleteProject()}
                  >
                    <IconContext.Provider
                      value={{
                        style: { color: "rgb(225, 0, 45)", fontSize: "24px" },
                      }}
                    >
                      <IoClose />
                    </IconContext.Provider>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="project-body">
              <div className="project-info">
                <div className="left">
                  <div className="project-owner poppins-regular">
                    Owned by
                    {projectObject.owner === user
                      ? " you"
                      : projectObject.owner}
                  </div>
                  <div className="project-deadline poppins-regular">
                    {projectObject.deadline
                      ? `Deadline on ${projectDeadline.getMonth()}/${projectDeadline.getDate()}/${projectDeadline.getFullYear()}`
                      : "No deadline"}
                  </div>
                </div>
                <div className="right">
                  <div className="updated poppins-regular">{updatedStatus}</div>
                </div>
              </div>
              <div
                onMouseEnter={() => showEditDescriptionButton()}
                onMouseLeave={() => hideEditDescriptionButton()}
              >
                <span className="description-label poppins-semibold">
                  Description
                </span>
                {!editDescriptionInput ? (
                  <p className="project-description poppins-regular">
                    {projectObject.description}
                  </p>
                ) : (
                  <div className="editing-description">
                    <input
                      type="text"
                      className="edit-description-input poppins-regular"
                      value={editedDescription}
                      onChange={(event) =>
                        setEditedDescription(event.target.value)
                      }
                    />
                    <div className="buttons">
                      <input
                        type="button"
                        value="Update"
                        className="update-description-button poppins-regular"
                        onClick={() => updateDescription()}
                      />
                      <input
                        type="button"
                        value="Cancel"
                        className="cancel-description-update-button poppins-regular"
                        onClick={() => cancelDescriptionUpdate()}
                      />
                    </div>
                  </div>
                )}
                {!editingDescription ? (
                  <div className="edit-description">
                    <button
                      className={
                        "edit-description-button poppins-regular" +
                        (editButtonVisible ? " visible" : "")
                      }
                      onClick={() => editDescription(projectObject.description)}
                    >
                      <IconContext.Provider
                        value={{ style: { fontSize: "16px" } }}
                      >
                        <MdOutlineModeEdit />
                      </IconContext.Provider>
                      Edit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="project-tasks-header poppins-regular">
              <h3 className="project-tasks-title poppins-bold">
                <IconContext.Provider
                  value={{ style: { color: "var(--primary-color)" } }}
                >
                  <TbSquareCheck />
                </IconContext.Provider>
                Tasks
              </h3>
              <button
                className="create-new-task poppins-regular"
                onClick={() =>
                  setOpenNewTaskPopup({ ...openNewTaskPopup, active: true })
                }
              >
                <IconContext.Provider
                  value={{ style: { color: "var(--primary-color)" } }}
                >
                  <TbSquarePlus className="create-new-task-icon" />
                </IconContext.Provider>
                Create new task
              </button>
            </div>
            <div className="project-tasks-section">
              <div className="tasks">
                {tasks.length !== 0 ? (
                  tasks.map((task) => {
                    const taskUpdated = new Date(task.updated_on);
                    const updatedStatus = updatedMessageUtil(taskUpdated);
                    return (
                      <div
                        key={task.task_id}
                        className="task poppins-regular"
                        onMouseEnter={() => hoverOverTask(task.task_id)}
                        onMouseLeave={() => hoverOverTaskEnded()}
                      >
                        <div
                          className={
                            "open-task" +
                            (hoveredOverTask === task.task_id ? " visible" : "")
                          }
                        >
                          <Link
                            to={
                              view
                                ? `/auth/${user}/task/${task.task_id}?project=${projectId}?view=${view}`
                                : `/auth/${user}/task/${task.task_id}?project=${projectId}`
                            }
                            className="open-button"
                          >
                            Open
                          </Link>
                        </div>
                        <div className="left">
                          <div className="task-icon">
                            <IconContext.Provider
                              value={{
                                style: {
                                  color:
                                    task.priority === 1
                                      ? "rgb(245, 0, 45)"
                                      : task.priority === 2
                                        ? "rgb(245, 120, 0)"
                                        : "rgb(0, 120, 245)",
                                },
                              }}
                            >
                              {task.priority === 1 ? (
                                <RiAlarmWarningFill />
                              ) : task.priority === 2 ? (
                                <FaFire />
                              ) : (
                                <FaRegSnowflake />
                              )}
                            </IconContext.Provider>
                          </div>
                          {task.name}
                        </div>
                        <div className="right">
                          <div className="task-properties">
                            <div className="task-assignee">
                              <div className="label poppins-semibold">
                                Assigned to
                              </div>
                              <div className="value">
                                {task.assigned_to === user
                                  ? "You"
                                  : task.assigned_to}
                              </div>
                            </div>
                            <div className="task-state">
                              <div className="label poppins-semibold">
                                State
                              </div>
                              <div
                                className={
                                  "value" +
                                  (task.state === 1
                                    ? " to-do-state"
                                    : task.state === 2
                                      ? " doing-state"
                                      : " done-state")
                                }
                              >
                                <span
                                  className={
                                    "state-value" +
                                    (task.state === 1
                                      ? " to-do"
                                      : task.state === 2
                                        ? " doing"
                                        : " done")
                                  }
                                ></span>
                                {task.state === 1
                                  ? "To do"
                                  : task.state === 2
                                    ? "Doing"
                                    : "Done"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="updated">Updated {updatedStatus}</div>
                      </div>
                    );
                  })
                ) : !projectFetched ? (
                  <span className="poppins-regular">Loading Tasks ...</span>
                ) : (
                  <span className="poppins-regular">
                    This project has no tasks
                  </span>
                )}
              </div>
            </div>
            <div className="links poppins-semibold">
              <Link
                to={
                  view
                    ? view === "dashboard"
                      ? `/auth/${user}/dashboard`
                      : `/auth/${user}/projects?view=${view}`
                    : taskId
                      ? `/auth/${user}/task/${taskId}`
                      : `/auth/${user}/dashboard`
                }
              >
                <IconContext.Provider
                  value={{ style: { color: "var(--primary-color)" } }}
                >
                  <FaArrowLeft />
                </IconContext.Provider>
                <span>Go back</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="project-not-found poppins-regular">
            404 Project Not Found
          </div>
        )}
      </div>
      {openNewTaskPopup.active ? (
        <NewTaskPopup
          newTask={newTask}
          setNewTask={setNewTask}
          createNewTask={createNewTask}
          popupDisplay={openNewTaskPopup}
          setPopupDisplay={setOpenNewTaskPopup}
          user={user}
          parentProjectId={projectObject.project_id}
        />
      ) : (
        ""
      )}
    </div>
  );
}
