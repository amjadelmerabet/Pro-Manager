// Hooks
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Components
import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewTaskPopup from "./components/NewTaskPopup";
import ListTaskItem from "./components/ListTaskItem";
import GridTaskItem from "./components/GridTaskItem";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import createTaskUtil from "./utils/createTaskUtil";
import deleteTaskUtil from "./utils/deleteTaskUtil";
import updateTaskUtil from "./utils/updateTaskUtil";

// Styles
import "./Tasks.css";
import filterTasksUtil from "./utils/filterTasksUtil";
import sortTasksUtil from "./utils/sortTasksUtil";
import fetchUserProjectsUtil from "../projects/utils/fetchUserProjectsUtil";
import GlobalSearch from "../components/GlobalSearch";
import countMatchingRecords from "../utils/countMatchingRecords";
import KanbanCardTask from "./components/KanbanCardTask";

export default function TasksPage({ user, userId, setAuthentication }) {
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
  const [filter, setFilter] = useState({ state: "0", priority: "0" });
  const [applyFilters, setApplyFilters] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [tries, setTries] = useState(0);
  const [loadTasks, setLoadTasks] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [sort, setSort] = useState({ sort_by: "0", type: 1 });
  const [applySort, setApplySort] = useState(0);
  const [sortedList, setSortedList] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchList, setGlobalSearchList] = useState([]);
  const [globalSearchInputFocus, setGlobalSearchInputFocus] = useState(false);
  const [tasksFetched, setTasksFetched] = useState(false);
  const [projectsFetched, setProjectsFetched] = useState(false);
  const [projects, setProjects] = useState([]);
  const [globalSearchClosed, setGlobalSearchClosed] = useState(false);
  const [groupBy, setGroupBy] = useState("");
  const [theme, setTheme] = useState("");

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const filterInURL = searchParams.get("filter");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    const getUserTheme = async () => {
      const userTheme = await cookieStore.get("userTheme-" + userId);
      if (userTheme) {
        setTheme(userTheme.value);
      }
    };
    getUserTheme();
  }, []);

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
    }
  }, []);

  useEffect(() => {
    // fetchTasks();
    fetchUserTasksUtil(
      tokenValidated,
      user,
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setTasks,
      setTokenValidated,
      globalSearchList,
      setGlobalSearchList,
      setTasksFetched
    );
  }, [newTaskCreated, taskDeleted, taskUpdated, loadTasks]);

  useEffect(() => {
    if (tasksFetched) {
      fetchUserProjectsUtil(
        tokenValidated,
        user,
        userId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjects,
        setTokenValidated,
        globalSearchList,
        setGlobalSearchList,
        setProjectsFetched
      );
    }
  }, [tasksFetched]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      // getAccessTokenAPI();
      getAccessTokenUtil(
        user,
        userId,
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
    if (search !== "" || applyFilters > 0 || tasks || applySort === 0) {
      filterTasksUtil(
        filter,
        search,
        applySort === 0 ? tasks : sortedList,
        setFilteredList
      );
    }
  }, [search, applyFilters, tasks, applySort]);

  useEffect(() => {
    if (applySort > 0 || tasks) {
      setSortedList(sortTasksUtil(tasks, sort));
    }
    if (applySort > 0 && (applyFilters > 0 || search !== "")) {
      setFilteredList(sortTasksUtil(filteredList, sort));
    }
  }, [applySort, tasks]);

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
    if (newTask.project && newTask.project === "none") {
      setNewTask((current) => {
        delete current.project;
        current = {
          ...current,
          assigned_to: userId,
          created_by: userId,
          updated_by: userId,
        };
        return current;
      });
    } else {
      setNewTask({
        ...newTask,
        assigned_to: userId,
        created_by: userId,
        updated_by: userId,
      });
    }
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
    setTaskUpdates({ state: 3, updated_by: userId });
    setUpdatedTaskId({ taskId: id, update: true });
  };

  const startTask = (id) => {
    setTaskUpdates({ state: 2, updated_by: userId });
    setUpdatedTaskId({ taskId: id, update: true });
  };

  const resetTask = (id) => {
    setTaskUpdates({ state: 1, updated_by: userId });
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

  let toDoTasks = 0;
  let doingTasks = 0;
  let doneTasks = 0;
  let highTasks = 0;
  let mediumTasks = 0;
  let lowTasks = 0;
  tasks.forEach((task) => {
    if (task.state === 1) {
      toDoTasks++;
    } else if (task.state === 2) {
      doingTasks++;
    } else if (task.state === 3) {
      doneTasks++;
    }
    if (task.priority === 1) {
      highTasks++;
    } else if (task.priority === 2) {
      mediumTasks++;
    } else if (task.priority === 3) {
      lowTasks++;
    }
  });

  let { projectsMatchingSearch, tasksMatchingSearch } = countMatchingRecords(
    globalSearchList,
    globalSearch
  );

  const closeGlobalSearch = () => {
    setGlobalSearchClosed(true);
    setGlobalSearchInputFocus(false);
    setGlobalSearch("");
    setTimeout(() => {
      setGlobalSearchClosed(false);
    }, 500);
  };

  const kanbanColumns = [
    { display: "To do", state: 1, class: "todo" },
    { display: "Doing", state: 2, class: "doing" },
    { display: "Done", state: 3, class: "done" },
    { display: "High", priority: 1, class: "high" },
    { display: "Medium", priority: 2, class: "medium" },
    { display: "Low", priority: 3, class: "low" },
  ];

  return (
    <div
      className={
        "tasks-page" + (theme === "light" || theme === "" ? " light" : " dark")
      }
    >
      <div
        className={
          "auth-header-container" +
          (theme === "light" || theme === "" ? " light" : " dark")
        }
      >
        <AuthHeader
          user={user}
          setAuthentication={setAuthentication}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
      </div>
      <div className="container">
        {(globalSearch !== "" || globalSearchInputFocus) &&
        !globalSearchClosed ? (
          <div>
            <div
              className="global-search-container"
              onClick={() => closeGlobalSearch()}
            ></div>
            <GlobalSearch
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              setGlobalSearchInputFocus={setGlobalSearchInputFocus}
              globalSearchList={globalSearchList}
              user={user}
              projectsMatchingSearch={projectsMatchingSearch}
              tasksMatchingSearch={tasksMatchingSearch}
              closeGlobalSearch={closeGlobalSearch}
            />
          </div>
        ) : (
          ""
        )}
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
          sort={sort}
          setSort={setSort}
          applySort={applySort}
          setApplySort={setApplySort}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
        />
        <ul className={"tasks " + selectedView}>
          {selectedView === "kanban" ? (
            <div className="kanban-board">
              {kanbanColumns.map((column, index) => {
                if (column[groupBy]) {
                  return (
                    <div
                      className={"kanban-column " + column.class}
                      key={index}
                    >
                      {groupBy === "state" && column.state ? (
                        <div className="column-header poppins-bold">
                          {column.display}
                          <span className="tasks-count poppins-semibold">
                            {column.state === 1
                              ? toDoTasks
                              : column.state === 2
                                ? doingTasks
                                : doneTasks}
                          </span>
                        </div>
                      ) : groupBy === "priority" && column.priority ? (
                        <div className="column-header poppins-bold">
                          {column.display}
                          <span className="tasks-count poppins-semibold">
                            {column.priority === 1
                              ? highTasks
                              : column.priority === 2
                                ? mediumTasks
                                : lowTasks}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      {search === "" && applyFilters === 0
                        ? applySort === 0
                          ? tasks.map((task) => {
                              myTasks++;
                              const updated = new Date(task.updated_on);
                              const updatedStatus = updatedMessageUtil(updated);
                              if (
                                (groupBy === "state" &&
                                  task.state === column.state) ||
                                (groupBy === "priority" &&
                                  task.priority === column.priority)
                              ) {
                                return (
                                  <KanbanCardTask
                                    key={task.task_id}
                                    task={task}
                                    openTaskClass={openTaskClass}
                                    openTask={openTask}
                                    hoverOverTask={hoverOverTask}
                                    hoverOverTaskEnd={hoverOverTaskEnd}
                                    updatedStatus={updatedStatus}
                                    startTask={startTask}
                                    completeTask={completeTask}
                                    resetTask={resetTask}
                                    deleteTask={deleteTask}
                                    userId={userId}
                                    theme={theme}
                                  />
                                );
                              }
                            })
                          : sortedList.map((task) => {
                              if (
                                (groupBy === "state" &&
                                  task.state === column.state) ||
                                (groupBy === "priority" &&
                                  task.priority === column.priority)
                              ) {
                                myTasks++;
                                const updated = new Date(task.updated_on);
                                const updatedStatus =
                                  updatedMessageUtil(updated);
                                return (
                                  <KanbanCardTask
                                    task={task}
                                    openTaskClass={openTaskClass}
                                    openTask={openTask}
                                    hoverOverTask={hoverOverTask}
                                    hoverOverTaskEnd={hoverOverTaskEnd}
                                    updatedStatus={updatedStatus}
                                    startTask={startTask}
                                    completeTask={completeTask}
                                    resetTask={resetTask}
                                    deleteTask={deleteTask}
                                    userId={userId}
                                    theme={theme}
                                  />
                                );
                              }
                            })
                        : filteredList.map((task) => {
                            if (
                              (groupBy === "state" &&
                                task.state === column.state) ||
                              (groupBy === "priority" &&
                                task.priority === column.priority)
                            ) {
                              myTasks++;
                              const updated = new Date(task.updated_on);
                              const updatedStatus = updatedMessageUtil(updated);
                              return (
                                <KanbanCardTask
                                  task={task}
                                  openTaskClass={openTaskClass}
                                  openTask={openTask}
                                  hoverOverTask={hoverOverTask}
                                  hoverOverTaskEnd={hoverOverTaskEnd}
                                  updatedStatus={updatedStatus}
                                  startTask={startTask}
                                  completeTask={completeTask}
                                  resetTask={resetTask}
                                  deleteTask={deleteTask}
                                  userId={userId}
                                  theme={theme}
                                />
                              );
                            }
                          })}
                    </div>
                  );
                }
              })}
            </div>
          ) : search === "" && applyFilters === 0 ? (
            applySort === 0 ? (
              tasks.map((task) => {
                if (task.assigned_to === userId) {
                  let updated = new Date(task.updated_on);
                  const updatedStatus = updatedMessageUtil(updated);
                  myTasks++;
                  if (selectedView === "list") {
                    return (
                      <ListTaskItem
                        key={task.task_id}
                        task={task}
                        userId={userId}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        updatedStatus={updatedStatus}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        theme={theme}
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
                        updatedStatus={updatedStatus}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        userId={userId}
                        theme={theme}
                      />
                    );
                  }
                }
              })
            ) : (
              sortedList.map((task) => {
                if (task.assigned_to === userId) {
                  let updated = new Date(task.updated_on);
                  const updatedStatus = updatedMessageUtil(updated);
                  myTasks++;
                  if (selectedView === "list") {
                    return (
                      <ListTaskItem
                        key={task.task_id}
                        task={task}
                        userId={userId}
                        hoverOverTask={hoverOverTask}
                        hoverOverTaskEnd={hoverOverTaskEnd}
                        updatedStatus={updatedStatus}
                        openTaskClass={openTaskClass}
                        openTask={openTask}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        theme={theme}
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
                        updatedStatus={updatedStatus}
                        startTask={startTask}
                        completeTask={completeTask}
                        resetTask={resetTask}
                        deleteTask={deleteTask}
                        userId={userId}
                        theme={theme}
                      />
                    );
                  }
                }
              })
            )
          ) : (
            filteredList.map((task) => {
              if (task.assigned_to === userId) {
                let updated = new Date(task.updated_on);
                const updatedStatus = updatedMessageUtil(updated);
                myTasks++;
                if (selectedView === "list") {
                  return (
                    <ListTaskItem
                      key={task.task_id}
                      task={task}
                      userId={userId}
                      hoverOverTask={hoverOverTask}
                      hoverOverTaskEnd={hoverOverTaskEnd}
                      updatedStatus={updatedStatus}
                      openTaskClass={openTaskClass}
                      openTask={openTask}
                      startTask={startTask}
                      completeTask={completeTask}
                      resetTask={resetTask}
                      deleteTask={deleteTask}
                      theme={theme}
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
                      updatedStatus={updatedStatus}
                      startTask={startTask}
                      completeTask={completeTask}
                      resetTask={resetTask}
                      deleteTask={deleteTask}
                      userId={userId}
                      theme={theme}
                    />
                  );
                }
              }
            })
          )}
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
            user={user}
            userId={userId}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
