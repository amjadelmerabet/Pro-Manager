// Hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

// Icons
import { IconContext } from "react-icons/lib";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft, FaFire, FaRegSnowflake } from "react-icons/fa";
import { RiAlarmWarningFill } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";

// Components
import AuthHeader from "../components/AuthHeader";
import { Link } from "react-router";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserTaskUtil from "./utils/fetchUserTaskUtil";
import updateTaskUtil from "./utils/updateTaskUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import fetchLinkedProjectUtil from "./utils/fetchLinkedProjectUtil";
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";

// Styles
import "./Task.css";
import { TbFolderFilled, TbSquareCheck } from "react-icons/tb";

export default function Task({ user, userId, setAuthentication }) {
  const [taskObject, setTaskObject] = useState({});
  const [taskUpdates, setTaskUpdates] = useState({});
  const [taskUpdated, setTaskUpdated] = useState({ counter: 0, update: false });
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [editingShortDesciprtion, setEditingShortDescription] = useState(false);
  const [editedShortDescription, setEditedShortDescription] = useState("");
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [loadTask, setLoadTask] = useState(0);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [project, setProject] = useState({});
  const [taskFetched, setTasksFetched] = useState(false);
  const [loadProject, setLoadProject] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editingPriority, setEditingPriority] = useState(false);
  const [editedPriority, setEditedPriority] = useState(0);
  const [editingProject, setEditingProject] = useState(false);
  const [editedProject, setEditedProject] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [loadProjects, setLoadProjects] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;
  const array = pathname.replace("/auth/", "").replace("/task", "").split("/");

  const taskId = array[1];

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const projectId = searchParams.get("project");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    fetchUserProjectsUtil(
      tokenValidated,
      user,
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserProjects
    );
  }, [loadProjects]);

  useEffect(() => {
    if ((!taskUpdated.update && taskUpdated.counter === 0) || loadTask) {
      // fetchTaskAPI();
      fetchUserTaskUtil(
        tokenValidated,
        user,
        token,
        taskId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskObject,
        setTokenValidated,
        setTasksFetched
      );
    }
  }, [taskUpdated, loadTask]);

  useEffect(() => {
    if (projectId) {
      fetchLinkedProjectUtil(
        projectId,
        token,
        user,
        userId,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProject
      );
    } else if (Object.keys(taskObject).indexOf("project") !== -1) {
      fetchLinkedProjectUtil(
        taskObject.project,
        token,
        user,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProject
      );
    }
  }, [taskFetched, loadProject, taskUpdated]);

  useEffect(() => {
    if (taskUpdated.update) {
      // updateTaskAPI();
      updateTaskUtil(
        tokenValidated,
        user,
        token,
        taskId,
        taskUpdates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedSuccessfully,
        setTokenValidated
      );
    }
  }, [taskUpdated]);

  useEffect(() => {
    if (updatedSuccessfully) {
      setTimeout(() => {
        setTaskUpdated({ counter: 0, update: false });
        setTaskUpdates({});
        setUpdatedSuccessfully(false);
      }, 250);
    }
  }, [updatedSuccessfully]);

  let navigate = useNavigate();

  useEffect(() => {
    if (taskDeleted) {
      // deleteTaskAPI();
      deleteTaskUtil(
        tokenValidated,
        user,
        token,
        taskId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskDeleted,
        setTokenValidated,
        navigate
      );
    }
  }, [taskDeleted]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      // getAccessTokenAPI();
      getAccessTokenUtil(
        user,
        userId,
        setTokenValidated,
        setTries,
        newAccessToken,
        loadTask,
        setLoadTask,
        taskUpdated,
        setTaskUpdated,
        setTaskDeleted,
        setLoadProject
      );
    }
  }, [newAccessToken]);

  const startTask = () => {
    setTaskUpdates({ state: 2, updated_by: userId });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const completeTask = () => {
    setTaskUpdates({ state: 3, updated_by: userId });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const resetTask = () => {
    setTaskUpdates({ state: 1, updated_by: userId });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  // console.log(taskObject.description);

  const deleteTask = () => {
    setTaskDeleted(true);
  };

  const editShortDescription = (taskShortDescription) => {
    setEditedShortDescription(taskShortDescription);
    setEditingShortDescription(true);
  };

  const confirmShortDescriptionEdit = () => {
    setEditingShortDescription(false);
    setTaskUpdates({
      short_description: editedShortDescription,
      updated_by: userId,
    });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const cancelShortDescriptionEdit = () => {
    setEditingShortDescription(false);
  };

  const editDescription = (taskDescription) => {
    setEditedDescription(taskDescription);
    setEditingDescription(true);
  };

  const confirmDescriptionEdit = () => {
    setEditingDescription(false);
    setTaskUpdates({
      description: editedDescription,
      updated_by: userId,
    });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const cancelDescriptionEdit = () => {
    setEditingDescription(false);
  };

  const editPriority = (taskPriority) => {
    setEditedPriority(taskPriority);
    setEditingPriority(true);
  };

  const confirmPriorityEdit = () => {
    setEditingPriority(false);
    setTaskUpdates({
      priority: editedPriority,
      updated_by: userId,
    });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const cancelPriorityEdit = () => {
    setEditingPriority(false);
  };

  const editProject = (taskProject) => {
    setEditedProject(taskProject);
    setEditingProject(true);
  };

  const confirmProjectEdit = () => {
    setEditingProject(false);
    setTaskUpdates({
      project: editedProject !== "" ? editedProject : null,
      updated_by: userId,
    });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const cancelProjectEdit = () => {
    setEditingProject(false);
  };

  let updated = new Date(taskObject.updated_on);
  let updatedStatus = updatedMessageUtil(updated);

  return (
    <div className="task-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="container">
        {Object.keys(taskObject).length === 0 ? (
          <div className="loading-task poppins-regular">
            Loading task content ...
          </div>
        ) : (
          <div className="task">
            <div className="task-header">
              <div className="left">
                <h5 className="task-icon poppins-semibold">
                  <IconContext.Provider
                    value={{
                      style: {
                        color: "var(--primary-color)",
                        fontSize: "28px",
                      },
                    }}
                  >
                    <TbSquareCheck />
                  </IconContext.Provider>
                </h5>
                <h2 className="task-title poppins-bold">{taskObject.name}</h2>
                <h5
                  className={
                    "task-state poppins-semibold" +
                    (taskObject.state === 1
                      ? " to-do-state"
                      : taskObject.state === 2
                        ? " doing-state"
                        : " done-state")
                  }
                >
                  <span
                    className={
                      "state" +
                      (taskObject.state === 1
                        ? " to-do"
                        : taskObject.state === 2
                          ? " doing"
                          : " done")
                    }
                  ></span>
                  {taskObject.state === 1
                    ? "To do"
                    : taskObject.state === 2
                      ? "Doing"
                      : "Done"}
                </h5>
              </div>
              <div className="right">
                <div className="task-actions">
                  {taskObject.state !== 1 ? (
                    <button
                      className="reset-task poppins-regular"
                      onClick={() => resetTask()}
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
                        <span>To do</span>
                      </IconContext.Provider>
                    </button>
                  ) : (
                    ""
                  )}
                  {taskObject.state === 1 ? (
                    <button
                      className="start-task poppins-regular"
                      onClick={() => startTask()}
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
                        <span>Doing</span>
                      </IconContext.Provider>
                    </button>
                  ) : (
                    ""
                  )}
                  {taskObject.state !== 3 ? (
                    <button
                      className="complete-task poppins-regular"
                      onClick={() => completeTask()}
                    >
                      <IconContext.Provider
                        value={{
                          style: { color: "rgb(0, 200, 45)", fontSize: "24px" },
                        }}
                      >
                        <IoCheckmark />
                        <span>Done</span>
                      </IconContext.Provider>
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    className="delete-task poppins-regular"
                    onClick={() => deleteTask()}
                  >
                    <IconContext.Provider
                      value={{
                        style: { color: "rgb(225, 0, 45)", fontSize: "24px" },
                      }}
                    >
                      <IoClose />
                      <span>Delete</span>
                    </IconContext.Provider>
                  </button>
                </div>
              </div>
            </div>
            <div className="task-body">
              <div className="task-info">
                <div className="left">
                  <div className="assigned-to poppins-regular">
                    Assigned to
                    {taskObject.assigned_to === userId
                      ? " you"
                      : taskObject.assigned_to}
                  </div>
                  <div className="priority poppins-regular">
                    <span className="priority-label">Priority</span>
                    {!editingPriority ? (
                      <div
                        className="priority-value"
                        onClick={() => editPriority()}
                      >
                        <IconContext.Provider
                          value={{
                            style: {
                              color:
                                taskObject.priority === 1
                                  ? "rgb(245, 0, 45)"
                                  : taskObject.priority === 2
                                    ? "rgb(245, 120, 0)"
                                    : "rgb(0, 120, 245)",
                            },
                          }}
                        >
                          {taskObject.priority === 1 ? (
                            <RiAlarmWarningFill className="priority-icon" />
                          ) : taskObject.priority === 2 ? (
                            <FaFire className="priority-icon" />
                          ) : (
                            <FaRegSnowflake className="priority-icon" />
                          )}
                        </IconContext.Provider>
                        {taskObject.priority === 1
                          ? " High"
                          : taskObject.priority === 2
                            ? " Medium"
                            : " Low"}
                      </div>
                    ) : (
                      <div className="editing-priority">
                        <select
                          className="editing-priority-select"
                          onChange={(event) =>
                            setEditedPriority(Number(event.target.value))
                          }
                          value={editedPriority}
                        >
                          <option value="1">High</option>
                          <option value="2">Medium</option>
                          <option value="3">Low</option>
                        </select>
                        <input
                          type="button"
                          value="Cancel"
                          onClick={() => cancelPriorityEdit()}
                          className="poppins-regular"
                        />
                        <input
                          type="button"
                          value="Confirm"
                          onClick={() => confirmPriorityEdit()}
                          className="poppins-regular"
                        />
                      </div>
                    )}
                  </div>
                  <div className="project poppins-regular">
                    <span className="project-label">Project</span>
                    {!editingProject ? (
                      taskObject.project ? (
                        <div className="project-value">
                          <IconContext.Provider
                            value={{
                              style: {
                                color: "var(--primary-color)",
                                fontSize: "18px",
                              },
                            }}
                          >
                            <TbFolderFilled />
                          </IconContext.Provider>
                          <Link
                            to={
                              view
                                ? `/auth/${user}/project/${taskObject.project}?task=${taskObject.task_id}?view=${view}`
                                : `/auth/${user}/project/${taskObject.project}?task=${taskObject.task_id}`
                            }
                            className="project-link"
                          >
                            {project.name ? project.name : "Loading ..."}
                          </Link>
                        </div>
                      ) : (
                        <div className="project-value">No project</div>
                      )
                    ) : (
                      <div className="editing-project">
                        <select
                          className="editing-project-select"
                          onChange={(event) =>
                            setEditedProject(event.target.value)
                          }
                          value={editedProject}
                        >
                          <option value="">-- No project --</option>
                          {userProjects.map((project) => {
                            return (
                              <option value={project.project_id}>
                                {project.name}
                              </option>
                            );
                          })}
                        </select>
                        <input
                          type="button"
                          value="Cancel"
                          onClick={() => cancelProjectEdit()}
                        />
                        <input
                          type="button"
                          value="Confirm"
                          onClick={() => confirmProjectEdit()}
                        />
                      </div>
                    )}
                    <button
                      className="edit-project"
                      onClick={() => editProject(taskObject.project)}
                    >
                      <IconContext.Provider
                        value={{ style: { fontSize: "16px" } }}
                      >
                        <MdOutlineModeEdit />
                      </IconContext.Provider>
                      Edit
                    </button>
                  </div>
                </div>
                <div className="right">
                  <div className="updated poppins-regular">{updatedStatus}</div>
                </div>
              </div>
              <div>
                <span className="short-description-label poppins-semibold">
                  Short description
                </span>
                {!editingShortDesciprtion ? (
                  <div className="task-short-description poppins-regular">
                    {taskObject.short_description}
                  </div>
                ) : (
                  <div className="editing-short-description">
                    <input
                      type="text"
                      name="editing-short-description"
                      className="editing-short-description-input poppins-regular"
                      value={editedShortDescription}
                      onChange={(event) => {
                        setEditedShortDescription(event.target.value);
                      }}
                    />
                    <div className="buttons">
                      <input
                        type="button"
                        value="Update"
                        className="update-task"
                        onClick={() => confirmShortDescriptionEdit()}
                      />
                      <input
                        type="button"
                        value="Cancel"
                        className="cancel-update-task"
                        onClick={() => cancelShortDescriptionEdit()}
                      />
                    </div>
                  </div>
                )}
                {!editingShortDesciprtion ? (
                  <div className="edit-short-description">
                    <button
                      className="edit poppins-regular"
                      onClick={() =>
                        editShortDescription(taskObject.short_description)
                      }
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
              <div>
                <span className="description-label poppins-semibold">
                  Description
                </span>
                {!editingDescription ? (
                  <div
                    className={
                      "task-description poppins-regular" +
                      (taskObject.description ? " visible" : "")
                    }
                  >
                    {taskObject.description}
                  </div>
                ) : (
                  <div className="editing-description">
                    <input
                      type="text"
                      name="editing-description"
                      className="editing-description-input poppins-regular"
                      value={editedDescription}
                      onChange={(event) => {
                        setEditedDescription(event.target.value);
                      }}
                    />
                    <div className="buttons">
                      <input
                        type="button"
                        value="Update"
                        className="update-task"
                        onClick={() => confirmDescriptionEdit()}
                      />
                      <input
                        type="button"
                        value="Cancel"
                        className="cancel-update-task"
                        onClick={() => cancelDescriptionEdit()}
                      />
                    </div>
                  </div>
                )}
                {!editingDescription ? (
                  <div className="edit-description">
                    <button
                      className="edit poppins-regular"
                      onClick={() => editDescription(taskObject.description)}
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
            <div className="links poppins-semibold">
              <Link
                to={
                  view
                    ? view === "dashboard"
                      ? `/auth/${user}/dashboard`
                      : `/auth/${user}/tasks?view=${view}`
                    : projectId
                      ? `/auth/${user}/project/${projectId}`
                      : `/auth/${user}/dashboard`
                }
              >
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)" },
                  }}
                >
                  <FaArrowLeft />
                </IconContext.Provider>
                <span>Go back</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
