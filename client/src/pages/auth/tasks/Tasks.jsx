import { use, useEffect, useState } from "react";
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

export default function TasksPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [create, setCreate] = useState(0);
  const [newTaskPopupDisplay, setNewTaskPopupDisplay] = useState({
    active: false,
    type: "task",
  });
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [loadingNewTask, setLoadingNewTask] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [taskDeleted, setTaskDeleted] = useState(0);
  const [updatedTaskId, setUpdatedTaskId] = useState("");
  const [taskUpdated, setTaskUpdated] = useState(0);
  const [taskUpdates, setTaskUpdates] = useState({});
  const [openTaskClass, setOpenTaskClass] = useState("");
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [selectedView, setSelectedView] = useState("list");

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  
  useEffect(() => {
    if (view) {
      setSelectedView(view);
    }
  }, []);

  // let navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://127.0.0.1:3000/tasks");
      const projectsObject = await response.json();
      setTasks(projectsObject.result);
    };
    fetchTasks();
  }, [newTaskCreated, taskDeleted, taskUpdated]);

  useEffect(() => {
    if (tasks.length > 0) {
      const newList = tasks.filter((task) => {
        if (task.name.toLowerCase().includes(search.toLowerCase())) return task;
      });
      setFilteredList(newList);
    }
  }, [search]);

  useEffect(() => {
    const createNewTaskAPI = async () => {
      const response = await fetch("http://127.0.0.1:3000/tasks/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
    };
    if (Object.keys(newTask).length > 0) {
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
    setTimeout(() => {
      setNewTaskCreated(newTaskCreated + 1);
      setNewTask({});
      setLoadingNewTask(false);
    }, 1000);
    setLoadingNewTask(true);
    setNewTaskPopupDisplay({ ...newTaskPopupDisplay, active: false });
    // navigate(0);
  };

  useEffect(() => {
    const deleteTaskAPI = async (id) => {
      const response = await fetch("http://127.0.0.1:3000/tasks/delete/" + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const deletedTask = await response.json();
    };
    if (deleteTaskId !== "") {
      deleteTaskAPI(deleteTaskId);
    }
  }, [deleteTaskId]);

  const deleteTask = (id) => {
    setDeleteTaskId(id);
    setTimeout(() => {
      setTaskDeleted(taskDeleted + 1);
    }, 1000);
  };

  useEffect(() => {
    const updateTaskAPI = async (id) => {
      const response = await fetch("http://127.0.0.1:3000/tasks/update/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskUpdates),
      });
      const updatedTask = await response.json();
    };
    if (updatedTaskId !== "") {
      updateTaskAPI(updatedTaskId);
    }
  }, [updatedTaskId]);

  const completeTask = (id) => {
    setTaskUpdates({ state: 3, updated_by: user });
    setUpdatedTaskId(id);
    setTimeout(() => {
      setTaskUpdated(taskUpdated + 1);
      setTaskUpdates({});
      setUpdatedTaskId("");
    }, 250);
  };

  const startTask = (id) => {
    setTaskUpdates({ state: 2, updated_by: user });
    setUpdatedTaskId(id);
    setTimeout(() => {
      setTaskUpdated(taskUpdated + 1);
      setTaskUpdates({});
      setUpdatedTaskId("");
    }, 250);
  };

  const resetTask = (id) => {
    setTaskUpdates({ state: 1, updated_by: user });
    setUpdatedTaskId(id);
    setTimeout(() => {
      setTaskUpdated(taskUpdated + 1);
      setTaskUpdates({});
      setUpdatedTaskId("");
    }, 250);
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
        <AuthHeader user={user} />
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
        />
        <ul className={"tasks " + selectedView}>
          {search === ""
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
