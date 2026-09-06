import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";
import { IoArrowBack, IoCheckmark, IoTrashOutline } from "react-icons/io5";
import { MdOutlineEdit, MdOutlineFolder } from "react-icons/md";
import { RiAlarmWarningFill } from "react-icons/ri";
import { FaFire, FaRegSnowflake } from "react-icons/fa";
import SideMenu from "../../dashboard/modern/components/SideMenu";
import fetchUserTaskUtil from "./utils/fetchUserTaskUtil";
import fetchLinkedProjectUtil from "./utils/fetchLinkedProjectUtil";
import updateTaskUtil from "./utils/updateTaskUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";
import fetchUserActivitiesUtil from "../../utils/fetchUserActivitiesUtil";
import "./Task.css";
import fetchTaskProjectsHistoryUtil from "../classic/utils/fetchTaskProjectsHistory";

const states = {
  1: ["To do", "to-do"],
  2: ["Doing", "doing"],
  3: ["Done", "done"],
};
const priorities = {
  1: ["High", RiAlarmWarningFill, "high"],
  2: ["Medium", FaFire, "medium"],
  3: ["Low", FaRegSnowflake, "low"],
};

const fieldDiplayValues = {
  name: {
    display: "Name",
  },
  state: {
    display: "State",
  },
  priority: {
    display: "Priority",
  },
  short_description: {
    display: "Short description",
  },
  description: {
    display: "Description",
  },
  assigned_to: {
    display: "Owner",
  },
  project: {
    display: "Project",
  },
};

const TaskStates = {
  1: {
    value: "To do",
  },
  2: {
    value: "Doing",
  },
  3: {
    value: "Done",
  },
};

const TaskPriorities = {
  1: {
    value: "High",
  },
  2: {
    value: "Medium",
  },
  3: {
    value: "Low",
  },
};

export default function TaskPageModern({
  user,
  userId,
  setAuthentication,
  setPreviewModernUI,
}) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({});
  const [project, setProject] = useState({});
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [loadTask, setLoadTask] = useState(0);
  const [loadProject, setLoadProject] = useState(false);
  const [taskFetched, setTaskFetched] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState({ counter: 0, update: false });
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [userActivities, setUserActivities] = useState([]);
  const [fetchUserActivities, setFetchUserActivities] = useState(false);
  const [userActivitiesFetched, setUserActivitiesFetched] = useState(false);
  const [projectsHistory, setProjectsHistory] = useState({});
  const [fetchProjectsHistory, setFetchProjectsHistory] = useState(false);

  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  const token = authUser?.token;
  const sessionId = authUser?.sessionId;

  const location = useLocation();
  const prevPageIsProject = location.search.indexOf("project") !== -1;
  let projectId = "";
  if (prevPageIsProject) {
    const backUrl = location.search.replace("?backUrl=", "");
    projectId = backUrl.split("&")[1].replace("id=", "");
  }

  useEffect(() => {
    if (token)
      fetchUserTaskUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        taskId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTask,
        setTokenValidated,
        setTaskFetched,
      );
  }, [loadTask]);

  useEffect(() => {
    if (task.project)
      fetchLinkedProjectUtil(
        task.project,
        sessionId,
        token,
        user,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProject,
      );
    if (taskFetched) {
      fetchUserActivitiesUtil(
        "task",
        taskId,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setUserActivities,
        setFetchUserActivities,
        setUserActivitiesFetched,
      );
    }
  }, [taskFetched, loadProject, task.project]);

  useEffect(() => {
    if (taskUpdated.update)
      updateTaskUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        taskId,
        taskUpdated.updates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedSuccessfully,
        setTokenValidated,
      );
  }, [taskUpdated]);

  useEffect(() => {
    if (updatedSuccessfully) {
      setTaskUpdated((current) => ({ ...current, update: false }));
      setUpdatedSuccessfully(false);
      setLoadTask((current) => current + 1);
      fetchUserActivitiesUtil(
        "task",
        taskId,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setUserActivities,
        setFetchUserActivities,
        setUserActivitiesFetched,
      );
    }
  }, [updatedSuccessfully]);

  useEffect(() => {
    let projects = [];
    userActivities.forEach((activity) => {
      activity.audits.forEach((audit) => {
        if (
          audit.field === "project" &&
          projects.indexOf(audit.old_value) === -1 &&
          audit.old_value !== null
        ) {
          projects.push(audit.old_value);
        }
        if (
          audit.field === "project" &&
          projects.indexOf(audit.new_value) === -1 &&
          audit.new_value !== null
        ) {
          projects.push(audit.new_value);
        }
      });
    });
    if (
      (userActivitiesFetched && projects.length > 0) ||
      fetchProjectsHistory
    ) {
      fetchTaskProjectsHistoryUtil(
        projects,
        user,
        userId,
        sessionId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        tokenValidated,
        setTokenValidated,
        setProjectsHistory,
      );
    }
  }, [userActivitiesFetched, fetchProjectsHistory]);

  useEffect(() => {
    if (taskDeleted)
      deleteTaskUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        taskId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskDeleted,
        setTokenValidated,
        navigate,
      );
  }, [taskDeleted]);

  useEffect(() => {
    if (newAccessToken.counter)
      getAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        loadTask,
        setLoadTask,
        taskUpdated,
        setTaskUpdated,
        setTaskDeleted,
        setLoadProject,
        () => {},
      );
  }, [newAccessToken]);

  const updateTask = (updates) =>
    setTaskUpdated((current) => ({
      counter: current.counter + 1,
      update: true,
      updates: { ...updates, updated_by: userId },
    }));
  const beginEdit = (field, value) => {
    setEditingField(field);
    setDraftValue(value ?? "");
  };
  const saveEdit = () => {
    updateTask({
      [editingField]:
        editingField === "priority" ? Number(draftValue) : draftValue,
    });
    setEditingField("");
  };
  const deleteTask = () => {
    if (window.confirm("Delete this task?")) {
      setTaskDeleted(true);
    }
  };

  const truncateProjectName = (name, maxLength = 30) =>
    name?.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

  if (!Object.keys(task).length)
    return (
      <div className="task-page-modern">
        <div className="page-container">
          <SideMenu
            user={user}
            setPreviewModernUI={setPreviewModernUI}
            useLocalRecentWork={true}
            setAuthentication={setAuthentication}
          />
          <main className="task-loading poppins-regular">Loading task…</main>
        </div>
      </div>
    );
  const [stateLabel, stateClass] = states[task.state] || states[1];
  const [priorityLabel, PriorityIcon, priorityClass] =
    priorities[task.priority] || priorities[3];
  return (
    <div className="task-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          setPreviewModernUI={setPreviewModernUI}
          useLocalRecentWork={true}
          setAuthentication={setAuthentication}
        />
        <main>
          <div className="task-topbar">
            {!prevPageIsProject ? (
              <Link
                to={`/auth/${user}/modern/tasks`}
                className="back-link poppins-medium"
              >
                <IoArrowBack /> All tasks
              </Link>
            ) : (
              <Link
                to={`/auth/${user}/modern/project/${projectId}`}
                className="back-link poppins-medium"
              >
                <IoArrowBack />
                {project.name}
              </Link>
            )}
            <div className="task-actions">
              {task.state !== 1 && (
                <button
                  className="poppins-medium"
                  onClick={() => updateTask({ state: 1 })}
                >
                  <BiReset /> To do
                </button>
              )}
              {task.state === 1 && (
                <button
                  className="poppins-medium"
                  onClick={() => updateTask({ state: 2 })}
                >
                  <GrFormClock /> Doing
                </button>
              )}
              {task.state !== 3 && (
                <button
                  className="complete poppins-medium"
                  onClick={() => updateTask({ state: 3 })}
                >
                  <IoCheckmark /> Done
                </button>
              )}
              <button className="delete poppins-medium" onClick={deleteTask}>
                <IoTrashOutline /> Delete
              </button>
            </div>
          </div>
          <article className="task-details-card">
            <header>
              <div className="task-heading">
                <p className={`task-state ${stateClass} poppins-semibold`}>
                  {stateLabel}
                </p>
                <h1 className="poppins-bold">{task.name}</h1>
              </div>
              <p className="updated-at poppins-regular">
                Updated on {new Date(task.updated_on).toLocaleDateString("fr")}{" "}
                at {new Date(task.updated_on).toLocaleTimeString("fr")}
              </p>
            </header>
            <section className="task-meta poppins-regular">
              <div>
                <span>Assigned to</span>
                <strong>
                  {task.assigned_to === userId
                    ? "Me"
                    : task.assigned_to || "Unassigned"}
                </strong>
              </div>
              <div>
                <span>Project</span>
                {task.project ? (
                  <Link
                    to={`/auth/${user}/modern/project/${project.project_id}?backUrl=task&id=${taskId}`}
                    className="parent-project"
                  >
                    <MdOutlineFolder />{" "}
                    {truncateProjectName(project.name) || "Loading…"}
                  </Link>
                ) : (
                  <strong>Standalone</strong>
                )}
              </div>
              <div>
                <span>Priority</span>
                {editingField === "priority" ? (
                  <select
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                  >
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </select>
                ) : (
                  <button
                    className={`priority ${priorityClass}`}
                    onClick={() => beginEdit("priority", task.priority)}
                  >
                    <PriorityIcon /> {priorityLabel}
                    <MdOutlineEdit />
                  </button>
                )}
              </div>
            </section>
            <EditableSection
              label="Short description"
              field="short_description"
              value={task.short_description}
              editingField={editingField}
              draftValue={draftValue}
              setDraftValue={setDraftValue}
              beginEdit={beginEdit}
              saveEdit={saveEdit}
              cancelEdit={() => setEditingField("")}
            />
            <EditableSection
              label="Description"
              field="description"
              value={task.description}
              multiline
              editingField={editingField}
              draftValue={draftValue}
              setDraftValue={setDraftValue}
              beginEdit={beginEdit}
              saveEdit={saveEdit}
              cancelEdit={() => setEditingField("")}
            />
            {editingField === "priority" && (
              <div className="edit-actions priority-edit">
                <button onClick={() => setEditingField("")}>Cancel</button>
                <button className="save" onClick={saveEdit}>
                  Save
                </button>
              </div>
            )}
          </article>
          <h3 className="poppins-semibold activity-log-title">
              Activity Log
            </h3>
            {userActivities.length !== 0 ? (
              <div className="poppins-regular user-activities">
                {userActivities.map((activity, index) => {
                  return (
                    <div key={index}>
                      <div className="activity-header">
                        <p className="activity-user">
                          {activity.created_by === userId
                            ? "Me"
                            : "Other user"}
                        </p>
                        <div className="dot"></div>
                        <p className="activity-time">
                          {new Date(activity.created_on).toLocaleString()}
                        </p>
                      </div>
                      <div className="updates">
                        {activity.audits.map((audit, index) => {
                          return (
                            <div key={index} className="update">
                              <div className="field">
                                {fieldDiplayValues[audit.field].display}
                              </div>
                              {audit.type === "update" ? (
                                <div className="changes">
                                  <span className="new-value">
                                    {audit.field !== "assigned_to"
                                      ? audit.field !== "state"
                                        ? audit.field !== "priority"
                                          ? audit.field !== "project"
                                            ? audit.new_value === null ||
                                              audit.new_value === ""
                                              ? "Empty"
                                              : audit.new_value
                                            : audit.new_value !== null
                                              ? project.name
                                              : "Empty"
                                          : TaskPriorities[audit.new_value]
                                              .value
                                        : TaskStates[audit.new_value].value
                                      : audit.new_value === userId
                                        ? "Me"
                                        : "Other user"}
                                  </span>{" "}
                                  was{" "}
                                  <span className="old-value">
                                    {audit.field !== "assigned_to"
                                      ? audit.field !== "state"
                                        ? audit.field !== "priority"
                                          ? audit.field !== "project"
                                            ? audit.old_value === null ||
                                              audit.old_value === ""
                                              ? "Empty"
                                              : audit.old_value
                                            : audit.old_value !== null
                                              ? projectsHistory[audit.old_value]
                                              : "Empty"
                                          : TaskPriorities[audit.old_value]
                                              .value
                                        : TaskStates[audit.old_value].value
                                      : audit.old_value === userId
                                        ? "Me"
                                        : "Other user"}
                                  </span>
                                </div>
                              ) : (
                                <div className="insert">
                                  {audit.field !== "assigned_to"
                                    ? audit.field !== "state"
                                      ? audit.field !== "priority"
                                        ? audit.field !== "project"
                                          ? audit.new_value
                                          : project.project_id ===
                                              audit.new_value
                                            ? project.name
                                            : projectsHistory[audit.new_value]
                                        : TaskPriorities[audit.new_value].value
                                      : TaskStates[audit.new_value].value
                                    : audit.new_value === userId
                                      ? "Me"
                                      : "Other user"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{ textAlign: "center", paddingBlock: "8px" }}
                className="poppins-medium"
              >
                Loading user activities ...
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

function EditableSection({
  label,
  field,
  value,
  multiline,
  editingField,
  draftValue,
  setDraftValue,
  beginEdit,
  saveEdit,
  cancelEdit,
}) {
  const editing = editingField === field;
  return (
    <section className="task-content poppins-regular">
      <div className="section-heading">
        <h2 className="poppins-semibold">{label}</h2>
        {!editing && (
          <button onClick={() => beginEdit(field, value)}>
            <MdOutlineEdit /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <>
          <textarea
            rows={multiline ? 6 : 2}
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
          />
          <div className="edit-actions">
            <button onClick={cancelEdit}>Cancel</button>
            <button className="save" onClick={saveEdit}>
              Save
            </button>
          </div>
        </>
      ) : (
        <p>{value || "No description provided."}</p>
      )}
    </section>
  );
}
