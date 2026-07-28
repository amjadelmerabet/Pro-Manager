import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";
import { IoArrowBack, IoCheckmark, IoTrashOutline } from "react-icons/io5";
import { MdOutlineEdit, MdOutlineRadioButtonChecked } from "react-icons/md";
import SideMenu from "../../dashboard/modern/components/SideMenu";
import fetchUserProjectUtil from "./utils/fetchUserProjectUtil";
import updateProjectUtil from "./utils/updateProjectUtil";
import deleteProjectUtil from "./utils/deleteProjectUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import "./Project.css";
import fetchProjectTasksUtil from "../utils/fetchProjectTasksUtil";

const states = {
  1: ["Not started", "not-started"],
  2: ["In progress", "in-progress"],
  3: ["Completed", "completed"],
};

const taskStates = {
  1: { label: "To do", class: "to-do" },
  2: { label: "Doing", class: "doing" },
  3: { label: "Done", class: "done" },
};

const taskPriorities = {
  1: { label: "High", class: "high" },
  2: { label: "Medium", class: "medium" },
  3: { label: "Low", class: "low" },
};

const truncateProjectName = (name, maxLength = 30) =>
  name?.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

export default function ProjectPageModern({
  user,
  userId,
  setAuthentication,
  setPreviewModernUI,
}) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [loadProject, setLoadProject] = useState(0);
  const [projectUpdated, setProjectUpdated] = useState({
    counter: 0,
    update: false,
    updates: {},
  });
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [projectTasks, setProjectTasks] = useState([]);
  const [fetchProjectTasks, setFetchProjectTasks] = useState(0);

  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  const token = authUser?.token;
  const sessionId = authUser?.sessionId;

  useEffect(() => {
    fetchProjectTasksUtil(
      projectId,
      sessionId,
      token,
      setProjectTasks,
      tokenValidated,
      setTokenValidated,
      user,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
    );
  }, []);

  useEffect(() => {
    if (token)
      fetchUserProjectUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        projectId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProject,
        setTokenValidated,
      );
  }, [loadProject]);
  useEffect(() => {
    if (projectUpdated.update)
      updateProjectUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        projectId,
        projectUpdated.updates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedSuccessfully,
        setTokenValidated,
      );
  }, [projectUpdated]);
  useEffect(() => {
    if (updatedSuccessfully) {
      setProjectUpdated((current) => ({ ...current, update: false }));
      setUpdatedSuccessfully(false);
      setLoadProject((current) => current + 1);
    }
  }, [updatedSuccessfully]);
  useEffect(() => {
    if (projectDeleted)
      deleteProjectUtil(
        tokenValidated,
        user,
        sessionId,
        token,
        projectId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjectDeleted,
        setTokenValidated,
        navigate,
      );
  }, [projectDeleted]);

  useEffect(() => {
    if (fetchProjectTasks > 0) {
      fetchProjectTasksUtil(
        projectId,
        sessionId,
        token,
        setProjectTasks,
        tokenValidated,
        setTokenValidated,
        user,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
      );
    }
  }, [fetchProjectTasks]);

  useEffect(() => {
    if (newAccessToken.counter)
      getAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        setLoadProject,
        setProjectUpdated,
        setProjectDeleted,
      );
  }, [newAccessToken]);

  const updateProject = (updates) =>
    setProjectUpdated((current) => ({
      counter: current.counter + 1,
      update: true,
      updates: { ...updates, updated_by: userId },
    }));
  const beginEdit = (field, value) => {
    setEditingField(field);
    setDraftValue(value ?? "");
  };
  const saveEdit = () => {
    updateProject({
      [editingField]:
        editingField === "state" ? Number(draftValue) : draftValue,
    });
    setEditingField("");
  };
  const deadline = project.deadline ? new Date(project.deadline) : null;
  const [stateLabel, stateClass] = states[project.state] || states[1];

  const projectNameWords =
    Object.keys(project).length > 0 ? project.name.split(" ").length : 0;

  const openTask = (taskId) => {
    navigate(`/auth/${user}/modern/task/${taskId}`);
  };

  if (!Object.keys(project).length)
    return (
      <div className="project-page-modern">
        <div className="page-container">
          <SideMenu
            user={user}
            setPreviewModernUI={setPreviewModernUI}
            recentWork={[]}
            setAuthentication={setAuthentication}
          />
          <main className="project-loading poppins-regular">
            Loading project…
          </main>
        </div>
      </div>
    );

  return (
    <div className="project-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          setPreviewModernUI={setPreviewModernUI}
          recentWork={[]}
          setAuthentication={setAuthentication}
        />
        <main>
          <div className="project-topbar">
            <Link
              to={`/auth/${user}/modern/projects`}
              className="back-link poppins-medium"
            >
              <IoArrowBack /> All projects
            </Link>
            <div className="project-actions">
              {project.state !== 1 && (
                <button onClick={() => updateProject({ state: 1 })}>
                  <BiReset /> Reset
                </button>
              )}
              {project.state === 1 && (
                <button onClick={() => updateProject({ state: 2 })}>
                  <GrFormClock /> Start
                </button>
              )}
              {project.state !== 3 && (
                <button
                  className="complete"
                  onClick={() => updateProject({ state: 3 })}
                >
                  <IoCheckmark /> Complete
                </button>
              )}
              <button
                className="delete"
                onClick={() =>
                  window.confirm("Delete this project?") &&
                  setProjectDeleted(true)
                }
              >
                <IoTrashOutline /> Delete
              </button>
            </div>
          </div>
          <article className="project-details-card">
            <header>
              <div className="project-heading">
                <p className={`project-state ${stateClass} poppins-semibold`}>
                  {stateLabel}
                </p>
                <h1
                  className={
                    "poppins-bold" + (projectNameWords > 5 ? " long-name" : "")
                  }
                  title={project.name}
                >
                  {project.name}
                </h1>
              </div>
              <p className="updated-at poppins-regular">
                Updated {new Date(project.updated_on).toLocaleString()}
              </p>
            </header>
            <section className="project-meta poppins-regular">
              <div>
                <span>Owned by</span>
                <strong>
                  {project.owner === userId ? "Me" : project.owner || "Unknown"}
                </strong>
              </div>
              <div>
                <span>Deadline</span>
                <strong>
                  {deadline ? deadline.toLocaleDateString() : "No deadline"}
                </strong>
              </div>
              <div>
                <span>Status</span>
                {editingField === "state" ? (
                  <select
                    value={draftValue}
                    onChange={(event) => setDraftValue(event.target.value)}
                  >
                    <option value="1">Not started</option>
                    <option value="2">In progress</option>
                    <option value="3">Completed</option>
                  </select>
                ) : (
                  <button
                    className={`state-button ${stateClass}`}
                    onClick={() => beginEdit("state", project.state)}
                  >
                    {stateLabel}
                    <MdOutlineEdit />
                  </button>
                )}
              </div>
            </section>
            <EditableSection
              label="Project name"
              field="name"
              value={project.name}
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
              value={project.description}
              multiline
              editingField={editingField}
              draftValue={draftValue}
              setDraftValue={setDraftValue}
              beginEdit={beginEdit}
              saveEdit={saveEdit}
              cancelEdit={() => setEditingField("")}
            />
            {editingField === "state" && (
              <div className="edit-actions state-edit">
                <button onClick={() => setEditingField("")}>Cancel</button>
                <button className="save" onClick={saveEdit}>
                  Save
                </button>
              </div>
            )}
          </article>
          <h3 className="project-tasks-section-title poppins-bold">
            Project tasks
          </h3>
          <article className="project-tasks">
            <table className="tasks">
              <thead>
                <tr>
                  <th className="poppins-semibold">Name</th>
                  <th className="poppins-semibold">State</th>
                  <th className="poppins-semibold">Priority</th>
                  <th className="poppins-semibold">Assigned to</th>
                  {/* <th className="poppins-semibold">Project</th> */}
                  <th className="poppins-semibold">Updated</th>
                  <th className="poppins-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((task) => {
                  return (
                    <tr
                      className="project-task"
                      onClick={() => openTask(task.task_id)}
                    >
                      <td className="poppins-regular name">
                        <span className={taskStates[task.state].class}>
                          <MdOutlineRadioButtonChecked />
                        </span>
                        {task.name}
                      </td>
                      <td className={"poppins-medium state " + (taskStates[task.state].class)}>
                        {taskStates[task.state].label}
                      </td>
                      <td className="poppins-regular">
                        {taskPriorities[task.priority].label}
                      </td>
                      <td className="poppins-regular">
                        {task.assigned_to === userId ? "Me" : ""}
                      </td>
                      {/* <td className="poppins-regular">{project.name}</td> */}
                      <td className="poppins-regular">
                        {new Date(task.updated_on).toLocaleString()}
                      </td>
                      <td className="poppins-regular">
                        {new Date(task.created_on).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
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
    <section className="project-content poppins-regular">
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
