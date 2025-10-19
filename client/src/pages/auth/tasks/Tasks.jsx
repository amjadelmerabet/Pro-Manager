import { useEffect, useState } from "react";

import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewTaskPopup from "./components/NewTaskPopup";

import "./Tasks.css";
import updatedMessage from "../../../utils/updatedMessage";
import { useNavigate, useSearchParams } from "react-router";
import ListTaskItem from "./components/ListTaskItem";
import GridTaskItem from "./components/GridTaskItem";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import createTaskUtil from "./utils/createTaskUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";
import updateTaskUtil from "./utils/updateTaskUtil";

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
  const [deletedTaskId, setDeletedTaskId] = useState({});
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

  useEffect(() => {
    // fetchTasks();
    fetchUserTasksUtil(
      tokenValidated,
      user,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setTasks,
      setTokenValidated
    );
  }, [newTaskCreated, taskDeleted, taskUpdated, filterCleared, loadTasks]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      // getAccessTokenAPI();
      getAccessTokenUtil(
        user,
        setTokenValidated,
        setTries,
        newAccessToken,
        loadTasks,
        setLoadTasks,
        create,
        setCreate,
        updatedTaskId,
        setUpdatedTaskId,
        deletedTaskId,
        setDeletedTaskId
      );
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

  useEffect(() => {
    if (Object.keys(newTask).length > 0 && create > 0) {
      // createNewTaskAPI();
      createTaskUtil(
        tokenValidated,
        user,
        token,
        newTask,
        tries,
        setTries,
        setCreate,
        newAccessToken,
        setNewAccessToken,
        newTaskCreated,
        setNewTaskCreated,
        setNewTask,
        setLoadingNewTask,
        newTaskPopupDisplay,
        setNewTaskPopupDisplay,
        setTokenValidated
      );
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

  useEffect(() => {
    if (deletedTaskId.delete) {
      // deleteTaskAPI(deletedTaskId.taskId);
      deleteTaskUtil(
        tokenValidated,
        user,
        token,
        deletedTaskId,
        tries,
        setTries,
        setDeletedTaskId,
        newAccessToken,
        setNewAccessToken,
        taskDeleted,
        setTaskDeleted,
        setTokenValidated
      );
    }
  }, [deletedTaskId]);

  const deleteTask = (id) => {
    setDeletedTaskId({ taskId: id, delete: true });
  };

  useEffect(() => {
    if (updatedTaskId.update) {
      // updateTaskAPI(updatedTaskId.taskId);
      updateTaskUtil(
        tokenValidated,
        user,
        token,
        updatedTaskId,
        taskUpdates,
        tries,
        setTries,
        setUpdatedTaskId,
        newAccessToken,
        setNewAccessToken,
        taskUpdated,
        setTaskUpdated,
        setTaskUpdates,
        setTokenValidated
      );
    }
  }, [updatedTaskId]);

  const completeTask = (id) => {
    setTaskUpdates({ state: 3, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
  };

  const startTask = (id) => {
    setTaskUpdates({ state: 2, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
  };

  const resetTask = (id) => {
    setTaskUpdates({ state: 1, updated_by: user });
    setUpdatedTaskId({ taskId: id, update: true });
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
