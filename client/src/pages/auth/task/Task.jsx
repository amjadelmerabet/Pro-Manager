import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router";
import { IconContext } from "react-icons/lib";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft, FaFire, FaRegSnowflake } from "react-icons/fa";
import { RiAlarmWarningFill } from "react-icons/ri";

import AuthHeader from "../components/AuthHeader";

import updatedMessage from "../../../utils/updatedMessage";

import "./Task.css";
import { MdOutlineModeEdit } from "react-icons/md";

export default function Task({ user, setAuthentication }) {
  const [taskObject, setTaskObject] = useState({});
  const [taskUpdates, setTaskUpdates] = useState({});
  const [taskUpdated, setTaskUpdated] = useState({ counter: 0, update: false });
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [showEditingButton, setShowEditingButton] = useState(false);
  // const [editShortDescription, setEditShortDescription] = useState(false);
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

  const location = useLocation();
  const pathname = location.pathname;
  const array = pathname.replace("/auth/", "").replace("/task", "").split("/");

  const taskId = array[1];

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  const fetchTaskAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/tasks/id/" + taskId,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const task = await response.json();
          if (task.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "load",
            });
          } else {
            setTaskObject(task.result[0]);
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/tasks/id/" + taskId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const task = await response.json();
        if (task.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        } else {
          setTimeout(() => {
            setTokenValidated(false);
          }, 500);
          setTaskObject(task.result[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ((!taskUpdated.update && taskUpdated.counter === 0) || loadTask) {
      fetchTaskAPI();
    }
  }, [taskUpdated, loadTask]);

  const updateTaskAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/tasks/update/" + taskId,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(taskUpdates),
            }
          );
          const updatedTask = await response.json();
          if (updatedTask.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "update",
            });
          } else {
            setUpdatedSuccessfully(true);
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/tasks/update/" + taskId,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskUpdates),
          }
        );
        const updatedTask = await response.json();
        if (updatedTask.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        } else {
          setUpdatedSuccessfully(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (taskUpdated.update) {
      updateTaskAPI();
    }
  }, [taskUpdated]);

  useEffect(() => {
    if (updatedSuccessfully) {
      setTimeout(() => {
        console.log("success");
        setTaskUpdated({ counter: 0, update: false });
        setTaskUpdates({});
        setUpdatedSuccessfully(false);
      }, 250);
    }
  }, [updatedSuccessfully]);

  let navigate = useNavigate();

  const deleteTaskAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/tasks/delete/" + taskId,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const deletedTask = await response.json();
          if (deletedTask.error === "Invalid access token") {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "delete",
            });
          } else {
            setTimeout(() => {
              navigate("/auth/" + user + "/tasks");
            }, 500);
          }
        } else {
          setTries(tries + 1);
          setTaskDeleted(false);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/tasks/delete/" + taskId,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deletedTask = await response.json();
        if (deletedTask.error === "Invalid access token") {
          setTries(tries + 1);
          setTaskDeleted(false);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        } else {
          setTimeout(() => {
            navigate("/auth/" + user + "/tasks");
          }, 500);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (taskDeleted) {
      deleteTaskAPI();
    }
  }, [taskDeleted]);

  const getAccessTokenAPI = async () => {
    // console.log("Getting new access token");
    try {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        // console.log(refreshToken);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/new",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ username: user }),
          }
        );
        // console.log("Received a token or something");
        const accessTokenObject = await response.json();
        if (!accessTokenObject.error) {
          const authUser = JSON.parse(sessionStorage.getItem("authUser"));
          authUser.token = accessTokenObject.token;
          sessionStorage.removeItem("authUser");
          sessionStorage.setItem("authUser", JSON.stringify(authUser));
          setTokenValidated(true);
          setTries(0);
          if (newAccessToken.type === "load") {
            setLoadTask(loadTask + 1);
          }
          if (newAccessToken.type === "update") {
            setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
          } else if (newAccessToken.type === "delete") {
            setTaskDeleted(true);
          }
        }
      } else {
        console.log("No refresh token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenAPI();
    }
  }, [newAccessToken]);

  const startTask = () => {
    setTaskUpdates({ state: 2, updated_by: user });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const completeTask = () => {
    setTaskUpdates({ state: 3, updated_by: user });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const resetTask = () => {
    setTaskUpdates({ state: 1, updated_by: user });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  // console.log(taskObject.description);

  const deleteTask = () => {
    setTaskDeleted(true);
  };

  const hoverOverShortDescription = () => {
    setShowEditingButton(true);
  };

  const hoverOverShortDescriptionEnd = () => {
    setShowEditingButton(false);
  };

  const editShortDescription = (taskShortDescription) => {
    setEditedShortDescription(taskShortDescription);
    setEditingShortDescription(true);
  };

  const confirmShortDescriptionEdit = () => {
    setEditingShortDescription(false);
    setTaskUpdates({
      short_description: editedShortDescription,
      updated_by: user,
    });
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  };

  const cancelShortDescriptionEdit = () => {
    setEditingShortDescription(false);
  };

  let updated = new Date(taskObject.updated_on);
  let updatedStatus = updatedMessage(updated);

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
                <h5 className="priority-icon poppins-semibold">
                  <IconContext.Provider
                    value={{
                      style: {
                        color:
                          taskObject.priority === 1
                            ? "rgb(245, 0, 45)"
                            : taskObject.priority === 2
                            ? "rgb(245, 120, 0)"
                            : "rgb(0, 120, 245)",
                        fontSize: "24px",
                      },
                    }}
                  >
                    {taskObject.priority === 1 ? (
                      <RiAlarmWarningFill />
                    ) : taskObject.priority === 2 ? (
                      <FaFire />
                    ) : (
                      <FaRegSnowflake />
                    )}
                  </IconContext.Provider>
                </h5>
                <h2 className="task-title poppins-bold">{taskObject.name}</h2>
                <h5
                  className={
                    "task-state poppins-semibold" +
                    (taskObject.state === 1
                      ? " to-do"
                      : taskObject.state === 2
                      ? " doing"
                      : " done")
                  }
                >
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
                    {taskObject.assigned_to === user
                      ? " you"
                      : taskObject.assigned_to}
                  </div>
                  <div className="priority poppins-regular">
                    Priority
                    {taskObject.priority === 1
                      ? " High"
                      : taskObject.priority === 2
                      ? " Medium"
                      : " Low"}
                  </div>
                </div>
                <div className="right">
                  <div className="updated poppins-regular">{updatedStatus}</div>
                </div>
              </div>
              <div
                onMouseEnter={() => hoverOverShortDescription()}
                onMouseLeave={() => hoverOverShortDescriptionEnd()}
              >
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
                      className={
                        "edit poppins-regular" +
                        (showEditingButton ? " visible" : "")
                      }
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
                <div
                  className={
                    "task-description poppins-regular" +
                    (taskObject.description ? " visible" : "")
                  }
                >
                  {taskObject.description}
                </div>
              </div>
            </div>
            <div className="links poppins-semibold">
              <Link
                to={
                  view === "dashboard"
                    ? `/auth/${user}/dashboard`
                    : `/auth/${user}/tasks?view=${view}`
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
