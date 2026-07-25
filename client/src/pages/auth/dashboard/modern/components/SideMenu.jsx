import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { RiWindow2Fill } from "react-icons/ri";

import logoutUserUtil from "../../../profile/utils/logoutUserUtil";
import getAccessTokenUtil from "../../../utils/getAccessTokenUtil";

import "./SideMenu.css";

export default function SideMenu({
  user,
  setPreviewModernUI,
  recentWork,
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
            {recentWork.map((item, index) => {
              let recentPage = item.slice(0, 23) + " ...";
              return (
                <li className="section-menu-item" key={index}>
                  {recentPage}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className="switch-to-classic-ui poppins-medium"
          onClick={() => switchUI()}
        >
          <RiWindow2Fill />
          Go back to Classic
        </button>
        <button
          className="logout poppins-medium"
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
