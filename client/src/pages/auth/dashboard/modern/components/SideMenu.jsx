import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { RiWindow2Fill } from "react-icons/ri";

import logoutUserUtil from "../../../profile/utils/logoutUserUtil";
import getAccessTokenUtil from "../../../utils/getAccessTokenUtil";
import fetchUserProjectsUtil from "../../../projects/modern/utils/fetchUserProjectsUtil";
import fetchUserTasksUtil from "../../../tasks/modern/utils/fetchUserTasksUtil";

import "./SideMenu.css";

export default function SideMenu({
  user,
  setPreviewModernUI,
  recentWork,
  useLocalRecentWork,
  setAuthentication,
}) {
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [logoutUser, setLogoutUser] = useState(0);
  const [successfulLogout, setSuccessfulLogout] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [userProjectsFetched, setUserProjectsFetched] = useState(false);
  const [userTasks, setUserTasks] = useState([]);
  const [userTasksFetched, setUserTasksFetched] = useState(false);
  const [localRecentWork, setLocalRecentWork] = useState([]);

  let navigate = useNavigate();

  const { userId, sessionId, token } = JSON.parse(
    sessionStorage.getItem("authUser"),
  );

  const switchUI = () => {
    setPreviewModernUI(false);
    navigate(`/auth/${user}/classic/dashboard`);
    sessionStorage.setItem("modern-ui", false);
  };

  const logout = () => {
    setLogoutUser(logoutUser + 1);
  };

  useEffect(() => {
    const deleteSessionCookie = async () => {
      await cookieStore.delete("session-" + userId);
    };
    if (successfulLogout) {
      deleteSessionCookie();
      sessionStorage.setItem("userLoggedOut", true);
      sessionStorage.removeItem("authUser");
      setAuthentication(false);
      navigate("/signin");
    }
  }, [successfulLogout]);

  useEffect(() => {
    if (logoutUser > 0) {
      logoutUserUtil(
        sessionId,
        user,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setSuccessfulLogout,
      );
    }
  }, [logoutUser]);

  useEffect(() => {
    if (useLocalRecentWork) {
      fetchUserProjectsUtil(
        user,
        userId,
        token,
        sessionId,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setUserProjects,
        setUserProjectsFetched,
      );
    }
  }, []);

  useEffect(() => {
    if (userProjectsFetched) {
      fetchUserTasksUtil(
        user,
        userId,
        token,
        sessionId,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setUserTasks,
        setUserTasksFetched,
      );
    }
  }, [userProjectsFetched]);

  useEffect(() => {
    if (userTasksFetched) {
      setLocalRecentWork(
        [...userProjects, ...userTasks]
          .sort(
            (a, b) =>
              new Date(b.updated_on).getTime() -
              new Date(a.updated_on).getTime(),
          )
          .slice(0, 5),
      );
    }
  }, [userTasksFetched]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        logoutUser,
        setLogoutUser,
      );
    }
  }, [newAccessToken]);

  return (
    <div className="side-menu poppins-regular">
      <div className="app-title poppins-bold">Pro Manager</div>
      <input
        type="text"
        className="search-box poppins-thin"
        placeholder="Search for something ..."
      />
      <div className="sections">
        <div className="section">
          <ul className="section-menu">
            <li className="section-menu-item">Organization</li>
            <li className="section-menu-item">Workspaces</li>
            <li className="section-menu-item">Settings</li>
          </ul>
        </div>
        <div className="section">
          <div className="section-title poppins-medium">Workspace</div>
          <ul className="section-menu">
            <li className="section-menu-item">Team</li>
            <li className="section-menu-item">
              <Link to={`/auth/${user}/modern/dashboard`}>Dashbaord</Link>
            </li>
            <li className="section-menu-item">
              <Link to={`/auth/${user}/modern/projects`}>Projects</Link>
            </li>
            <li className="section-menu-item">
              <Link to={`/auth/${user}/modern/tasks`}>Tasks</Link>
            </li>
          </ul>
        </div>
        <div className="section">
          <div className="section-title poppins-medium">Favorites</div>
          <ul className="section-menu">
            <li className="section-menu-item">My projects</li>
            <li className="section-menu-item">My tasks</li>
            <li className="section-menu-item">Open tasks</li>
          </ul>
        </div>
        <div className="section recent-work">
          <div className="section-title poppins-medium">Recents</div>
          <ul className="section-menu">
            {useLocalRecentWork
              ? localRecentWork.length > 0
                ? localRecentWork.map((item, index) => {
                    let recentPage = item.name.slice(0, 23) + " ...";
                    return (
                      <li className="section-menu-item" key={index}>
                        <Link
                          to={
                            item.owner
                              ? `/auth/${user}/modern/project/${item.project_id}`
                              : `/auth/${user}/modern/task/${item.task_id}`
                          }
                        >
                          {recentPage}
                        </Link>
                      </li>
                    );
                  })
                : "Loading ..."
              : recentWork.length > 0
                ? recentWork.map((item, index) => {
                    let recentPage = item.slice(0, 23) + " ...";
                    return (
                      <li className="section-menu-item" key={index}>
                        {recentPage}
                      </li>
                    );
                  })
                : "Loading ..."}
          </ul>
        </div>
        <button
          className="switch-to-classic-ui poppins-medium"
          onClick={() => switchUI()}
        >
          <RiWindow2Fill />
          Go back to Classic
        </button>
        <button className="logout poppins-medium" onClick={() => logout()}>
          Log out
        </button>
      </div>
    </div>
  );
}
