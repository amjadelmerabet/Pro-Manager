// Hooks
import { useEffect, useState } from "react";

// Icons
import {
  FaFire,
  FaRegCheckSquare,
  FaRegFolder,
  FaRegSnowflake,
} from "react-icons/fa";
import { IconContext } from "react-icons/lib";

// Components
import AllMenu from "../components/AllMenu";
import AuthHeader from "../components/AuthHeader";
import { Link } from "react-router";
import NewProjectPopup from "../projects/components/NewProjectPopup";
import NewTaskPopup from "../tasks/components/NewTaskPopup";
import RecentPage from "./components/RecentPage";
import QuickActions from "./components/QuickActions";
import Report from "./components/Report";
import SelectedPage from "./components/SelectedPage";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import createProjectUtil from "./utils/createProjectUtil";
import createTaskUtil from "./utils/createTaskUtil";
import createPageName from "./utils/createPageNameUtil";

// Styles
import "./Dashboard.css";
import { RiAlarmWarningFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import GlobalSearch from "../components/GlobalSearch";
import countMatchingRecords from "../utils/countMatchingRecords";

export default function DashboardPage({ user, setAuthentication }) {
  const [recentPages, setRecentPages] = useState([]);
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [projectsFetched, setProjectsFetched] = useState(false);
  const [tasksFetched, setTasksFetched] = useState(false);
  const [projectsStats, setProjectsStats] = useState({
    notStarted: 0,
    inProgress: 0,
    completed: 0,
  });
  const [tasksStats, setTasksStats] = useState({
    toDo: 0,
    doing: 0,
    done: 0,
  });
  const [selectedPage, setSelectedPage] = useState({});
  const [loadProjects, setLoadProjects] = useState(0);
  const [loadTasks, setLoadTasks] = useState(0);
  const [tempRecentPages, setTempRecentPages] = useState([]);
  const [recentPagesLoaded, setRecentPagesLoaded] = useState(false);
  const [popupVisible, setPopupVisible] = useState({
    visible: false,
    type: "",
  });
  const [newProject, setNewProject] = useState({});
  const [projectCreatedSuccessfully, setProjectCreatedSuccessfully] =
    useState(false);
  const [newProjectCreated, setNewProjectCreated] = useState(0);
  const [createProject, setCreateProject] = useState(0);
  const [newTask, setNewTask] = useState({});
  const [taskCreatedSuccessfully, setTaskCreatedSuccessfully] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(0);
  const [createTask, setCreateTask] = useState(0);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchList, setGlobalSearchList] = useState([]);
  const [globalSearchInputFocus, setGlobalSearchInputFocus] = useState(false);
  const [globalSearchClosed, setGlobalSearchClosed] = useState(false);

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  const openNewProjectPopup = () => {
    setPopupVisible({ visible: true, type: "project" });
  };

  const openNewTaskPopup = () => {
    setPopupVisible({ visible: true, type: "task" });
  };

  useEffect(() => {
    if (Object.keys(newProject).length > 0 && createProject > 0) {
      createProjectUtil(
        tokenValidated,
        user,
        token,
        newProject,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjectCreatedSuccessfully,
        setTokenValidated
      );
    }
  }, [createProject]);

  const createNewProject = () => {
    setNewProject({
      ...newProject,
      owner: user,
      created_by: user,
      updated_by: user,
    });
    setCreateProject(createProject + 1);
  };

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        user,
        setTokenValidated,
        setTries,
        newAccessToken,
        loadProjects,
        setLoadProjects,
        loadTasks,
        setLoadTasks,
        createProject,
        setCreateProject,
        createTask,
        setCreateTask
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    fetchUserProjectsUtil(
      tokenValidated,
      user,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      projectsStats,
      setProjectsStats,
      tempRecentPages,
      setTempRecentPages,
      setProjectsFetched,
      setTokenValidated
    );
  }, [loadProjects, newProjectCreated, newTaskCreated]);

  useEffect(() => {
    if (projectsFetched || loadTasks > 0) {
      fetchUserTasksUtil(
        tokenValidated,
        user,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        tasksStats,
        setTasksStats,
        tempRecentPages,
        setTempRecentPages,
        setTasksFetched,
        setTokenValidated
      );
    }
  }, [projectsFetched, loadTasks]);

  useEffect(() => {
    if (projectCreatedSuccessfully) {
      setTimeout(() => {
        setPopupVisible({ visible: false, type: "" });
        setNewProjectCreated(newProjectCreated + 1);
        setProjectCreatedSuccessfully(false);
      }, 250);
    }
  }, [projectCreatedSuccessfully]);

  useEffect(() => {
    if (tasksFetched) {
      setGlobalSearchList([...tempRecentPages]);
      setTempRecentPages(
        tempRecentPages.sort((page1, page2) => {
          return (
            new Date(page2.updated_on).getTime() -
            new Date(page1.updated_on).getTime()
          );
        })
      );
      setTasksFetched(false);
    } else {
      setRecentPagesLoaded(false);
      setRecentPages(tempRecentPages.slice(0, 4));
      setTimeout(() => {
        setRecentPagesLoaded(true);
        setTempRecentPages([]);
        setProjectsFetched(false);
        setTasksFetched(false);
      }, 250);
    }
  }, [tasksFetched]);

  useEffect(() => {
    if (Object.keys(newTask).length !== 0 && createTask > 0) {
      createTaskUtil(
        tokenValidated,
        user,
        token,
        newTask,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskCreatedSuccessfully,
        setTokenValidated
      );
    }
  }, [createTask]);

  const createNewTask = () => {
    setNewTask({
      ...newTask,
      assigned_to: user,
      created_by: user,
      updated_by: user,
    });
    setCreateTask(createTask + 1);
  };

  useEffect(() => {
    if (taskCreatedSuccessfully) {
      setTimeout(() => {
        setPopupVisible({ visible: false, type: "" });
        setNewTaskCreated(newTaskCreated + 1);
        setTaskCreatedSuccessfully(false);
      }, 250);
    }
  }, [taskCreatedSuccessfully]);

  const projectsReports = [
    {
      name: "Projects not started",
      value: projectsStats.notStarted,
      state: 1,
    },
    {
      name: "Projects in progress",
      value: projectsStats.inProgress,
      state: 2,
    },
    {
      name: "Projects completed",
      value: projectsStats.completed,
      state: 3,
    },
  ];

  const tasksReports = [
    {
      name: "Tasks to do",
      value: tasksStats.toDo,
      state: 1,
    },
    {
      name: "Tasks in progress",
      value: tasksStats.doing,
      state: 2,
    },
    {
      name: "Tasks done",
      value: tasksStats.done,
      state: 3,
    },
  ];

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

  return (
    <div className="dashboard-page">
      <div className="auth-header-container">
        <AuthHeader
          user={user}
          setAuthentication={setAuthentication}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
      </div>
      <div className="dashboard-container">
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
        <AllMenu user={user} setPopupDisplay={setPopupVisible} />
        <main>
          <div className="column-1">
            <div className="recent-pages">
              <h4 className="section-title poppins-bold">Recent pages</h4>
              {!recentPagesLoaded ? (
                <div className="loading-pages poppins-regular">
                  Loading Pages ...
                </div>
              ) : recentPages.length === 0 ? (
                <div className="no-recent-pages poppins-regular">
                  You have no recent pages
                </div>
              ) : (
                <div className="pages poppins-regular">
                  {recentPages.map((recentPage) => {
                    const updatedStatus = updatedMessageUtil(
                      new Date(recentPage.updated_on)
                    );
                    const createdStatus = updatedMessageUtil(
                      new Date(recentPage.created_on)
                    );
                    if (Object.keys(recentPage).indexOf("project_id") !== -1) {
                      return (
                        <RecentPage
                          key={recentPage.project_id}
                          type="project"
                          recentPage={recentPage}
                          selectedPage={selectedPage}
                          setSelectedPage={setSelectedPage}
                          createPageName={createPageName}
                          user={user}
                          updatedStatus={updatedStatus}
                          createdStatus={createdStatus}
                        />
                      );
                    } else if (
                      Object.keys(recentPage).indexOf("task_id") !== -1
                    ) {
                      return (
                        <RecentPage
                          key={recentPage.task_id}
                          type="task"
                          recentPage={recentPage}
                          selectedPage={selectedPage}
                          setSelectedPage={setSelectedPage}
                          createPageName={createPageName}
                          user={user}
                          updatedStatus={updatedStatus}
                          createdStatus={createdStatus}
                        />
                      );
                    } else {
                      return <div className="page">Unkown page</div>;
                    }
                  })}
                </div>
              )}
            </div>
            <div className="reports">
              {projectsReports.map((report, index) => {
                return (
                  <Report
                    key={index}
                    name={report.name}
                    type="project"
                    user={user}
                    value={report.value}
                    state={report.state}
                  />
                );
              })}
              {tasksReports.map((report, index) => {
                return (
                  <Report
                    key={index}
                    name={report.name}
                    type="task"
                    user={user}
                    value={report.value}
                    state={report.state}
                  />
                );
              })}
              {/* <div className="report disabled">
                <div className="report-title poppins-bold">
                  Tasks assigned to you
                </div>
                <div className="report-value poppins-bold">0</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report disabled">
                <div className="report-title poppins-bold">Today's tasks</div>
                <div className="report-value poppins-bold">0</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report disabled">
                <div className="report-title poppins-bold">
                  Tasks for this week
                </div>
                <div className="report-value poppins-bold">0</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report disabled">
                <div className="report-title poppins-bold">Inbox</div>
                <div className="report-value poppins-bold">0</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div> */}
            </div>
            <QuickActions
              openNewTaskPopup={openNewTaskPopup}
              openNewProjectPopup={openNewProjectPopup}
            />
          </div>
          <div className="column-2">
            {Object.keys(selectedPage).length === 0 ? (
              <div className="selected empty poppins-regular">
                <div className="nothing-selected">Nothing is selected</div>
              </div>
            ) : (
              <SelectedPage
                selectedPage={selectedPage}
                user={user}
                updatedMessageUtil={updatedMessageUtil}
              />
            )}
          </div>
        </main>
      </div>
      {popupVisible.visible ? (
        popupVisible.type === "project" ? (
          <NewProjectPopup
            parent="dashboard"
            popupDisplay={popupVisible}
            setPopupDisplay={setPopupVisible}
            newProject={newProject}
            setNewProject={setNewProject}
            createNewProject={createNewProject}
          />
        ) : popupVisible.type === "task" ? (
          <NewTaskPopup
            parent="dashboard"
            popupDisplay={popupVisible}
            setPopupDisplay={setPopupVisible}
            newTask={newTask}
            setNewTask={setNewTask}
            createNewTask={createNewTask}
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
}
