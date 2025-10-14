import { useEffect, useState } from "react";
import { IconContext } from "react-icons/lib";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { GrFormClock } from "react-icons/gr";
import { RiProgress5Line } from "react-icons/ri";
import { BiReset } from "react-icons/bi";
// import { useNavigate } from "react-router";

import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewTaskPopup from "./components/NewTaskPopup";

import "./Tasks.css";
import updatedMessage from "../../../utils/updatedMessage";
import { useNavigate, useSearchParams } from "react-router";
import ListTaskItem from "./components/ListTaskItem";
import GridTaskItem from "./components/GridTaskItem";

export default function TasksPage({ user, setAuthentication }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [create, setCreate] = useState(0);
  const [newTaskPopupDisplay, setNewTaskPopupDisplay] = useState({
    active: false,
    type: "task",
  });
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [loadingNewTask, setLoadingNewTask] = useState(false);
  const [deletedTaskId, setdeletedTaskId] = useState({});
  const [taskDeleted, setTaskDeleted] = useState(0);
  const [updatedTaskId, setUpdatedTaskId] = useState({});
  const [taskUpdated, setTaskUpdated] = useState(0);
  const [taskUpdates, setTaskUpdates] = useState({});
  const [openTaskClass, setOpenTaskClass] = useState("");
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [selectedView, setSelectedView] = useState("list");
  const [filter, setFilter] = useState({ state: "0" });
  const [applyFilters, setApplyFilters] = useState(0);
  const [filterCleared, setFilterCleared] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [tries, setTries] = useState(0);
  const [loadTasks, setLoadTasks] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const filterInURL = searchParams.get("filter");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    if (view) {
      setSelectedView(view);
    }
    if (filterInURL) {
      filterInURL.split("&").forEach((filterProp) => {
        const keyValue = filterProp.split("=");
        let tempFilter = filter;
        tempFilter[keyValue[0]] = keyValue[1];
        setFilter(tempFilter);
      });
      setTimeout(() => {
        setApplyFilters(applyFilters + 1);
      }, 250);
    } else {
      console.log("No filters");
    }
  }, []);

  // let navigate = useNavigate();

  const fetchTasks = async () => {
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
            "http://127.0.0.1:3000/tasks/assigned-to/" + user,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const tasksObject = await response.json();
          if (tasksObject.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "load",
            });
          } else {
            setTasks(tasksObject.result);
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
          "http://127.0.0.1:3000/tasks/assigned-to/" + user,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tasksObject = await response.json();
        if (tasksObject.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        } else {
          setTimeout(() => {
            setTokenValidated(false);
          }, 500);
          setTasks(tasksObject.result);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [newTaskCreated, taskDeleted, taskUpdated, filterCleared, loadTasks]);

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
            setLoadTasks(loadTasks + 1);
          } else if (newAccessToken.type === "new") {
            setCreate(create + 1);
          } else if (newAccessToken.type === "update") {
            setUpdatedTaskId({ ...updatedTaskId, update: true });
          } else if (newAccessToken.type === "delete") {
            setdeletedTaskId({ ...deletedTaskId, delete: true });
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

  useEffect(() => {
    if (Object.keys(filter).length !== 0) {
      if (filter.state && Number(filter.state) !== 0) {
        if (search !== "") {
          let newList = tasks.filter((task) => {
            if (
              task.state === Number(filter.state) &&
              task.name.toLowerCase().includes(search.toLowerCase())
            ) {
              return task;
            }
          });
          setFilteredList(newList);
        } else {
          let newList = tasks.filter((task) => {
            if (task.state === Number(filter.state)) {
              return task;
            }
          });
          setFilteredList(newList);
        }
      } else {
        let newList = tasks.filter((task) => {
          if (task.name.toLowerCase().includes(search.toLowerCase()))
            return task;
        });
        setFilteredList(newList);
      }
    }
  }, [search, applyFilters]);

  // useEffect(() => {

  // }, [applyFilters]);

  const createNewTaskAPI = async () => {
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
          const response = await fetch("http://127.0.0.1:3000/tasks/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTask),
          });
          const createdTask = await response.json();
          if (createdTask.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setCreate(0);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "new",
            });
          } else {
            setTimeout(() => {
              setNewTaskCreated(newTaskCreated + 1);
              setNewTask({});
              setLoadingNewTask(false);
            }, 1000);
            setLoadingNewTask(true);
            setNewTaskPopupDisplay({ ...newTaskPopupDisplay, active: false });
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "new",
          });
        }
      } else {
        const response = await fetch("http://127.0.0.1:3000/tasks/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        });
        const createdTask = await response.json();
        if (createdTask.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setCreate(0);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "new",
          });
        } else {
          setTimeout(() => {
            setNewTaskCreated(newTaskCreated + 1);
            setNewTask({});
            setLoadingNewTask(false);
          }, 1000);
          setLoadingNewTask(true);
          setNewTaskPopupDisplay({ ...newTaskPopupDisplay, active: false });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(newTask).length > 0 && create > 0) {
      createNewTaskAPI();
    }
  }, [create]);

  useEffect(() => {
    if (!newTaskPopupDisplay.active) {
      setNewTask({});
    }
  }, [newTaskPopupDisplay]);

  const createNewTask = () => {
    setNewTask({
      ...newTask,
      assigned_to: user,
      created_by: user,
      updated_by: user,
    });
    setCreate(create + 1);
    // navigate(0);
  };

  const deleteTaskAPI = async (id) => {
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
            "http://127.0.0.1:3000/tasks/delete/" + id,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const deletedTask = await response.json();
          if (deletedTask.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setdeletedTaskId({ ...deletedTaskId, delete: false });
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "delete",
            });
          } else {
            setTimeout(() => {
              setTaskDeleted(taskDeleted + 1);
            }, 1000);
          }
        } else {
          setTries(tries + 1);
          setdeletedTaskId({ ...deletedTaskId, delete: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/tasks/delete/" + id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deletedTask = await response.json();
        if (deletedTask.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setdeletedTaskId({ ...deletedTaskId, delete: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        } else {
          setTimeout(() => {
            setTaskDeleted(taskDeleted + 1);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (deletedTaskId.delete) {
      deleteTaskAPI(deletedTaskId.taskId);
    }
  }, [deletedTaskId]);

  const deleteTask = (id) => {
    setdeletedTaskId({ taskId: id, delete: true });
  };

  const updateTaskAPI = async (id) => {
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
            "http://127.0.0.1:3000/tasks/update/" + id,
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
            setUpdatedTaskId({ ...updatedTaskId, update: false });
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "update",
            });
          } else {
            setTimeout(() => {
              setTaskUpdated(taskUpdated + 1);
              setTaskUpdates({});
              setUpdatedTaskId({});
            }, 250);
          }
        } else {
          setTries(tries + 1);
          setUpdatedTaskId({ ...updatedTaskId, update: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/tasks/update/" + id,
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
          setUpdatedTaskId({ ...updatedTaskId, update: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        } else {
          setTimeout(() => {
            setTaskUpdated(taskUpdated + 1);
            setTaskUpdates({});
            setUpdatedTaskId({});
          }, 250);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updatedTaskId.update) {
      updateTaskAPI(updatedTaskId.taskId);
    }
  }, [updatedTaskId]);

  const completeTask = (id) => {
    setTaskUpdates({ state: 3, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
  };

  const startTask = (id) => {
    setTaskUpdates({ state: 2, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
    // setTimeout(() => {
    //   setTaskUpdated(taskUpdated + 1);
    //   setTaskUpdates({});
    //   setUpdatedTaskId("");
    // }, 250);
  };

  const resetTask = (id) => {
    setTaskUpdates({ state: 1, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
    // setTimeout(() => {
    //   setTaskUpdated(taskUpdated + 1);
    //   setTaskUpdates({});
    //   setUpdatedTaskId("");
    // }, 250);
  };

  const hoverOverTask = (id) => {
    setTimeout(() => {
      setOpenTaskClass(id);
    }, 250);
  };

  const hoverOverTaskEnd = () => {
    setTimeout(() => {
      setOpenTaskClass("");
    }, 250);
  };

  let navigate = useNavigate();

  const openTask = (id) => {
    navigate("/auth/" + user + "/task/" + id + "?view=" + selectedView);
  };

  let myTasks = 0;

  return (
    <div className="tasks-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="container">
        <SectionHeader
          title="Your tasks"
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          page="tasks"
          popupDisplay={newTaskPopupDisplay}
          setPopupDisplay={setNewTaskPopupDisplay}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          applyFilters={applyFilters}
          setApplyFilters={setApplyFilters}
          setFilterCleared={setFilterCleared}
        />
        <ul className={"tasks " + selectedView}>
          {search === "" && applyFilters === 0
            ? tasks.map((task) => {
                if (task.assigned_to === user) {
                  let updated = new Date(task.updated_on);
                  const updatedStatus = updatedMessage(updated);
                  myTasks++;
                  if (selectedView === "list") {
                    return (
                      <ListTaskItem
                        key={task.task_id}
                        task={task}
                        user={user}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        updatedStatus={updatedStatus}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                      />
                    );
                  } else {
                    return (
                      <GridTaskItem
                        key={task.task_id}
                        task={task}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        user={user}
                      />
                    );
                  }
                }
              })
            : filteredList.map((task) => {
                if (task.assigned_to === user) {
                  let updated = new Date(task.updated_on);
                  const updatedStatus = updatedMessage(updated);
                  myTasks++;
                  if (selectedView === "list") {
                    return (
                      <ListTaskItem
                        key={task.task_id}
                        task={task}
                        user={user}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        updatedStatus={updatedStatus}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                      />
                    );
                  } else {
                    return (
                      <GridTaskItem
                        key={task.task_id}
                        task={task}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        user={user}
                      />
                    );
                  }
                }
              })}
          {loadingNewTask ? (
            <div className="loading-new-task poppins-regular">
              Creating a new task ...
            </div>
          ) : (
            ""
          )}
        </ul>
        {myTasks === 0 ? (
          <div className="no-tasks">
            <h3 className="no-tasks-message poppins-semibold">
              You have no tasks
            </h3>
          </div>
        ) : (
          ""
        )}
        {newTaskPopupDisplay.active ? (
          <NewTaskPopup
            newTask={newTask}
            setNewTask={setNewTask}
            createNewTask={createNewTask}
            popupDisplay={newTaskPopupDisplay}
            setPopupDisplay={setNewTaskPopupDisplay}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
