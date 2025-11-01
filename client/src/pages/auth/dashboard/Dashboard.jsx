// Hooks
import { useEffect, useState } from "react";

// Icons
import { FaRegCheckSquare, FaRegFolder } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

// Components
import AllMenu from "../components/AllMenu";
import AuthHeader from "../components/AuthHeader";
import { Link } from "react-router";
import NewProjectPopup from "../projects/components/NewProjectPopup";
import NewTaskPopup from "../tasks/components/NewTaskPopup";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";
import fetchUserTasksUtil from "./utils/fetchUserTasksUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import createProjectUtil from "./utils/createProjectUtil";
import createTaskUtil from "./utils/createTaskUtil";

// Styles
import "./Dashboard.css";

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
    if (!tasksFetched && projectsFetched) {
      console.log("Recent pages updated:", recentPages);
    }
  }, [recentPages]);

  const createPageName = (name) => {
    let wordsIncluded = 0;
    let length = 0;
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (length + words[i].length < 22) {
        length += words[i].length + 1;
        wordsIncluded++;
      } else {
        break;
      }
    }
    return (
      name.split(" ").slice(0, wordsIncluded).join(" ") +
      (wordsIncluded < name.split(" ").length ? " ..." : "")
    );
  };

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

  return (
    <div className="dashboard-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="dashboard-container">
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
                        <div
                          key={recentPage.project_id}
                          className={
                            "page" +
                            (selectedPage.project_id === recentPage.project_id
                              ? " selected-recent-page"
                              : "")
                          }
                          onClick={() =>
                            setSelectedPage({ ...recentPage, type: "project" })
                          }
                        >
                          <div className="page-header">
                            <IconContext.Provider
                              value={{
                                style: { color: "var(--primary-color)" },
                              }}
                            >
                              <FaRegFolder />
                            </IconContext.Provider>
                            <div className="title">
                              {createPageName(recentPage.name)}
                            </div>
                          </div>
                          <table className="details">
                            <tbody>
                              <tr>
                                <td className="property poppins-semibold">
                                  Status
                                </td>
                                <td className="value">
                                  {recentPage.state === 1
                                    ? "Not started"
                                    : recentPage.state === 2
                                      ? "In progress"
                                      : "Completed"}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Owner
                                </td>
                                <td className="value">
                                  {recentPage.owner === user
                                    ? "You"
                                    : recentPage.owner}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Updated
                                </td>
                                <td className="value">{updatedStatus}</td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Updated by
                                </td>
                                <td className="value">
                                  {recentPage.updated_by === user
                                    ? "You"
                                    : recentPage.updated_by}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Created
                                </td>
                                <td className="value">{createdStatus}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="links">
                            <Link
                              to={`/auth/${user}/project/${recentPage.project_id}?view=dashboard`}
                              className="open-link poppins-regular-italic"
                            >
                              Click to open
                            </Link>
                          </div>
                        </div>
                      );
                    } else if (recentPage.task_id) {
                      return (
                        // <div className="page selected-recent-page">
                        <div
                          key={recentPage.task_id}
                          className={
                            "page" +
                            (selectedPage.task_id === recentPage.task_id
                              ? " selected-recent-page"
                              : "")
                          }
                          onClick={() => {
                            setSelectedPage({ ...recentPage, type: "task" });
                          }}
                        >
                          <div className="page-header">
                            <IconContext.Provider
                              value={{
                                style: { color: "var(--primary-color)" },
                              }}
                            >
                              <FaRegCheckSquare />
                            </IconContext.Provider>
                            <div className="title">
                              {createPageName(recentPage.name)}
                            </div>
                          </div>
                          <table className="details">
                            <tbody>
                              <tr>
                                <td className="property poppins-semibold">
                                  Status
                                </td>
                                <td className="value">
                                  {recentPage.state === 1
                                    ? "To do"
                                    : recentPage.state === 2
                                      ? "Doing"
                                      : "Done"}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Assigned to
                                </td>
                                <td className="value">
                                  {recentPage.assigned_to === user
                                    ? "You"
                                    : recentPage.assigned_to}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Updated
                                </td>
                                <td className="value">{updatedStatus}</td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Updated by
                                </td>
                                <td className="value">
                                  {recentPage.updated_by === user
                                    ? "You"
                                    : recentPage.updated_by}
                                </td>
                              </tr>
                              <tr>
                                <td className="property poppins-semibold">
                                  Created
                                </td>
                                <td className="value">{createdStatus}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="links">
                            <Link
                              to={`/auth/${user}/task/${recentPage.task_id}?view=dashboard`}
                              className="open-link poppins-regular-italic"
                            >
                              Click to open
                            </Link>
                          </div>
                        </div>
                      );
                    } else {
                      return <div className="page">Unkown page</div>;
                    }
                  })}
                </div>
              )}
            </div>
            <div className="reports">
              <div className="report">
                <div className="report-title poppins-bold">
                  Projects not started
                </div>
                <div className="report-value poppins-bold">
                  {projectsStats.notStarted}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/projects?filter=state=1`}>
                    Show the list
                  </Link>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">
                  Projects in progress
                </div>
                <div className="report-value poppins-bold">
                  {projectsStats.inProgress}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/projects?filter=state=2`}>
                    Show the list
                  </Link>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">
                  Projects completed
                </div>
                <div className="report-value poppins-bold">
                  {projectsStats.completed}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/projects?filter=state=3`}>
                    Show the list
                  </Link>
                </div>
              </div>
              {/* <div className="report disabled">
                <div className="report-title poppins-bold">
                  Tasks assigned to you
                </div>
                <div className="report-value poppins-bold">0</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div> */}
              <div className="report">
                <div className="report-title poppins-bold">Tasks to do</div>
                <div className="report-value poppins-bold">
                  {tasksStats.toDo}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/tasks?filter=state=1`}>
                    Show the list
                  </Link>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">
                  Tasks in progress
                </div>
                <div className="report-value poppins-bold">
                  {tasksStats.doing}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/tasks?filter=state=2`}>
                    Show the list
                  </Link>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">Tasks done</div>
                <div className="report-value poppins-bold">
                  {tasksStats.done}
                </div>
                <div className="report-link poppins-regular-italic">
                  <Link to={`/auth/${user}/tasks?filter=state=3`}>
                    Show the list
                  </Link>
                </div>
              </div>
              {/* <div className="report disabled">
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
            <div className="quick-actions">
              <h4 className="title poppins-bold">Quick actions</h4>
              <ul className="actions poppins-regular">
                <li className="action">
                  <button
                    className="poppins-regular"
                    onClick={() => openNewTaskPopup()}
                  >
                    Create a new task
                  </button>
                </li>
                <li className="action">
                  <button
                    className="poppins-regular"
                    onClick={() => openNewProjectPopup()}
                  >
                    Create a new project
                  </button>
                </li>
                <li className="action feature-disabled">
                  <button className="poppins-regular">
                    Complete today's tasks
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="column-2">
            {Object.keys(selectedPage).length === 0 ? (
              <div className="selected empty poppins-regular">
                <div className="nothing-selected">Nothing is selected</div>
              </div>
            ) : (
              <div className="selected">
                <div className="selected-page-header poppins-bold">
                  <IconContext.Provider
                    value={{ style: { color: "white", fontSize: "24px" } }}
                  >
                    {selectedPage.type === "project" ? (
                      <FaRegFolder />
                    ) : (
                      <FaRegCheckSquare />
                    )}
                  </IconContext.Provider>
                  <div className="selected-page-title">{selectedPage.name}</div>
                </div>
                <table className="selected-page-details">
                  <tbody>
                    <tr>
                      <td className="property poppins-semibold">Status</td>
                      <td className="value poppins-regular">
                        {selectedPage.state === 1
                          ? selectedPage.type === "project"
                            ? "Not started"
                            : "To do"
                          : selectedPage.state === 2
                            ? selectedPage.type === "project"
                              ? "In progress"
                              : "Doing"
                            : selectedPage.type === "project"
                              ? "Completed"
                              : "Done"}
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-semibold">Assigned to</td>
                      <td className="value poppins-regular">
                        {selectedPage.type === "project"
                          ? selectedPage.owner === user
                            ? "You"
                            : selectedPage.owner
                          : selectedPage.assigned_to === user
                            ? "You"
                            : selectedPage.assigned_to}
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-semibold">Updated</td>
                      <td className="value poppins-regular">
                        {updatedMessageUtil(new Date(selectedPage.updated_on))}
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-semibold">Updated by</td>
                      <td className="value poppins-regular">
                        {selectedPage.updated_by === user
                          ? "You"
                          : selectedPage.updated_by}
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-semibold">Created</td>
                      <td className="value poppins-regular">
                        {updatedMessageUtil(new Date(selectedPage.created_on))}
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-semibold">Created by</td>
                      <td className="value poppins-regular">
                        {selectedPage.created_by === user
                          ? "You"
                          : selectedPage.created_by}
                      </td>
                    </tr>
                    {selectedPage.type === "project" ? (
                      <tr>
                        <td className="property poppins-semibold">Deadline</td>
                        <td className="value poppins-regular">
                          {`${
                            new Date(selectedPage.deadline).getDate().toString()
                              .length === 1
                              ? "0"
                              : ""
                          }${new Date(selectedPage.deadline).getDate()}/${
                            new Date(selectedPage.deadline)
                              .getMonth()
                              .toString().length === 1
                              ? "0"
                              : ""
                          }${new Date(
                            selectedPage.deadline
                          ).getMonth()}/${new Date(
                            selectedPage.deadline
                          ).getFullYear()}`}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="property poppins-semibold">Priority</td>
                        <td className="value poppins-regular">
                          {selectedPage.priority === 1
                            ? "High"
                            : selectedPage.priority === 2
                              ? "Medium"
                              : "Low"}
                        </td>
                      </tr>
                    )}
                    {selectedPage.type === "task" ? (
                      <tr>
                        <td className="property poppins-semibold" colSpan={2}>
                          Short description
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {selectedPage.type === "task" ? (
                      <tr>
                        <td
                          className="value short-description poppins-regular"
                          colSpan={2}
                        >
                          {selectedPage.short_description}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    <tr>
                      <td className="property poppins-semibold" colSpan={2}>
                        Description
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="value description poppins-regular"
                        colSpan={2}
                      >
                        {selectedPage.description}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
