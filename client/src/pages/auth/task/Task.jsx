import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router";
import { IconContext } from "react-icons/lib";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

import AuthHeader from "../components/AuthHeader";

import "./Task.css";

export default function Task({ user }) {
  const [taskObject, setTaskObject] = useState({});
  const [taskUpdates, setTaskUpdates] = useState({});
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [taskDeleted, setTaskDeleted] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;
  const array = pathname.replace("/auth/", "").replace("/task", "").split("/");

  const taskId = array[1];

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  useEffect(() => {
    const fetchTaskAPI = async () => {
      const response = await fetch("http://127.0.0.1:3000/tasks/id/" + taskId);
      const task = await response.json();
      setTaskObject(task.result[0]);
    };
    if (!taskUpdated) {
      fetchTaskAPI();
    }
  }, [taskUpdated]);

  useEffect(() => {
    const updateTaskAPI = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/tasks/update/" + taskId,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskUpdates),
        }
      );
      const updatedTask = await response.json();
    };
    if (taskUpdated) {
      updateTaskAPI();
    }
  }, [taskUpdated]);

  let navigate = useNavigate();

  useEffect(() => {
    const deleteTaskAPI = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/tasks/delete/" + taskId,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const deletedTask = await response.json();
    };
    if (taskDeleted) {
      deleteTaskAPI();
      setTimeout(() => {
        navigate("/auth/" + user + "/tasks");
      }, 500);
    }
  }, [taskDeleted]);

  const startTask = () => {
    setTaskUpdates({ state: 2, updated_by: user });
    setTaskUpdated(true);
    setTimeout(() => {
      setTaskUpdates({});
      setTaskUpdated(false);
    }, 250);
  };

  const completeTask = () => {
    setTaskUpdates({ state: 3, updated_by: user });
    setTaskUpdated(true);
    setTimeout(() => {
      setTaskUpdates({});
      setTaskUpdated(false);
    }, 250);
  };

  const resetTask = () => {
    setTaskUpdates({ state: 1, updated_by: user });
    setTaskUpdated(true);
    setTimeout(() => {
      setTaskUpdates({});
      setTaskUpdated(false);
    }, 250);
  };

  const deleteTask = () => {
    setTaskDeleted(true);
  };

  return (
    <div className="task-page">
      <div className="auth-header-container">
        <AuthHeader user={user} />
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
              <div className="assigned-to poppins-regular">
                Assigned to{" "}
                {taskObject.assigned_to === user
                  ? "you"
                  : taskObject.assigned_to}
              </div>
              <div className="task-short-description poppins-regular">
                {taskObject.short_description}
              </div>
            </div>
            <div className="links poppins-semibold">
              <Link to={`/auth/${user}/tasks?view=${view}`}>
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
