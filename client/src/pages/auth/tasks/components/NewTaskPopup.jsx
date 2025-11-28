// Hooks
import { useEffect, useState } from "react";

// Icons
import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";

// APIs
import getProjectsByOwnerAPI from "../../../../api/projects/getProjectsByOwnerAPI";

// Styles
import "./NewTaskPopup.css";
import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

export default function NewTaskPopup({
  newTask,
  setNewTask,
  createNewTask,
  popupDisplay,
  setPopupDisplay,
  parent,
  user,
}) {
  const [newTaskClass, setNewTaskClass] = useState("");
  const [projects, setProjects] = useState([]);
  const [newAccessToken, setNewAccessToken] = useState(0);
  const [getProjects, setGetProjects] = useState();
  const [dataIsMissing, setDataIsMissing] = useState(false);

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    setNewTask({ ...newTask, priority: 2 });
  }, []);

  useEffect(() => {
    const getUserProjects = async () => {
      const projects = await getProjectsByOwnerAPI(user, token);
      if (projects.error === "Invalid access token") {
        setNewAccessToken(newAccessToken + 1);
      }
      setProjects(projects.result);
    };
    getUserProjects();
  }, [getProjects]);

  useEffect(() => {
    const getNewAccessToken = async () => {
      const cookie = await cookieStore.get(user);
      const response = await getNewAccessTokenAPI(user, cookie);
      const accessToken = response.token;
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      authUser.token = accessToken;
      sessionStorage.removeItem("authUser");
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setGetProjects(getProjects + 1);
    };
    getNewAccessToken();
  }, [newAccessToken]);

  useEffect(() => {
    setTimeout(() => {
      setNewTaskClass(" open");
    }, 250);
  }, [popupDisplay]);

  const closePopupDialog = () => {
    setNewTaskClass("");
    setTimeout(() => {
      if (parent === "dashboard") {
        setPopupDisplay({ visible: false, type: "" });
      } else {
        setPopupDisplay({ ...popupDisplay, active: false });
      }
    }, 250);
  };

  const handleCreateNewTask = () => {
    if (!newTask.name || !newTask.priority || !newTask.short_description) {
      setDataIsMissing(true);
    } else {
      setDataIsMissing(false);
      if (newTask.project === "none") {
        newTask.project = null;
      }
      createNewTask();
    }
  };

  return (
    <div className="new-task-popup">
      <div className={"new-task" + newTaskClass}>
        <h3 className="title poppins-bold">New Task</h3>
        <button className="close-popup" onClick={() => closePopupDialog()}>
          <IconContext.Provider value={{ style: { color: "rgb(225, 0, 45)" } }}>
            <IoClose />
          </IconContext.Provider>
        </button>
        {dataIsMissing ? (
          <span className="missing-data poppins-regular">
            Some necessary data is missing
          </span>
        ) : (
          ""
        )}
        <div>
          <label
            htmlFor="new-task-name"
            className="new-task-name-label poppins-regular"
          >
            Name
            <span className="required-field">*</span>
          </label>
          <input
            type="text"
            name="new-task-name"
            className="new-task-name-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, name: event.target.value })
            }
            required
          />
        </div>
        <div className="priority">
          <label htmlFor="priority" className="priority-label poppins-regular">
            Priority
            {newTask.priority === "" ? (
              <span className="required-field">*</span>
            ) : (
              ""
            )}
          </label>
          <div>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-high-priority-input"
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 1 })
                  : ""
              }
              required
            />
            <label
              htmlFor="new-task-high-priority"
              className="new-task-high-priority-label poppins-regular"
            >
              High
            </label>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-medium-priority-input"
              defaultChecked
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 2 })
                  : ""
              }
            />
            <label
              htmlFor="new-task-medium-priority"
              className="new-task-medium-priority-label poppins-regular"
            >
              Medium
            </label>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-low-priority-input"
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 3 })
                  : ""
              }
            />
            <label
              htmlFor="new-task-low-priority"
              className="new-task-low-priority-label poppins-regular"
            >
              Low
            </label>
          </div>
        </div>
        <div>
          <label
            htmlFor="project"
            className="new-task-project-label poppins-regular"
          >
            Project
          </label>
          <select
            name="project"
            id="project"
            className="new-task-project-select poppins-regular"
            onChange={(event) => {
              setNewTask({ ...newTask, project: event.target.value });
            }}
          >
            <option value="none">-- None --</option>
            {projects.map((project, index) => {
              return (
                <option
                  key={index}
                  className="poppins-regular"
                  value={project.project_id}
                >
                  {project.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label
            htmlFor="new-task-short-description"
            className="new-task-short-description-label poppins-regular"
          >
            Short description
            {!newTask.short_description || newTask.short_description === "" ? (
              <span className="required-field">*</span>
            ) : (
              ""
            )}
          </label>
          <textarea
            name="new-task-short-description"
            rows="2"
            cols="32"
            className="new-task-short-description-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, short_description: event.target.value })
            }
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="new-task-description"
            className="new-task-description-label poppins-regular"
          >
            Description
          </label>
          <textarea
            name="new-task-description"
            rows="8"
            cols="64"
            className="new-task-description-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, description: event.target.value })
            }
          ></textarea>
        </div>
        <button
          type="button"
          className="create-task poppins-semibold"
          onClick={() => handleCreateNewTask()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
