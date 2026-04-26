import { Link, useNavigate } from "react-router";
import { IoIosSearch } from "react-icons/io";
import ProfilePicture from "../../../assets/profile-picture.jpg";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";
import { BsFillTriangleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GoGear } from "react-icons/go";
import { LuPaintbrush } from "react-icons/lu";

import "./AuthHeader.css";
import { IoLogOutOutline } from "react-icons/io5";
import deleteSessionUtil from "../utils/deleteSessionUtil";
import getAccessTokenUtil from "../utils/getAccessTokenUtil";

export default function AuthHeader({
  user,
  setAuthentication,
  globalSearch,
  setGlobalSearch,
  theme,
  tokenValidated,
  setTokenValidated,
}) {
  const [settingsPopup, setSettingsPopup] = useState(false);
  const [tries, setTries] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [deleteSession, setDeleteSession] = useState(0);
  const [sessionDeleted, setSessionDeleted] = useState(false);

  let navigate = useNavigate();

  const { userId, sessionId, token } = JSON.parse(
    sessionStorage.getItem("authUser"),
  );

  const logout = () => {
    setDeleteSession(deleteSession + 1);
  };

  useEffect(() => {
    const deleteSessionCookie = async () => {
      await cookieStore.delete("session-" + userId);
    };
    if (sessionDeleted) {
      deleteSessionCookie();
      sessionStorage.setItem("userLoggedOut", true);
      sessionStorage.removeItem("authUser");
      setAuthentication(false);
      navigate("/signin");
    }
  }, [sessionDeleted]);

  useEffect(() => {
    if (deleteSession > 0) {
      deleteSessionUtil(
        sessionId,
        user,
        token,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setSessionDeleted,
      );
    }
  }, [deleteSession]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        user,
        userId,
        setTokenValidated,
        setTries,
        newAccessToken,
        deleteSession,
        setDeleteSession,
      );
    }
  }, [newAccessToken]);

  return (
    <header className="auth-header">
      <h1 className="application-name poppins-bold">
        <Link to="/">Pro Manager</Link>
      </h1>
      <ul className="auth-menu">
        <li className="auth-menu-item poppins-semibold">
          <Link to={"/auth/" + user + "/dashboard"}>Dashboard</Link>
        </li>
        <li className="auth-menu-item poppins-semibold">
          <Link to={"/auth/" + user + "/projects"}>Projects</Link>
        </li>
        <li className="auth-menu-item poppins-semibold">
          <Link to={"/auth/" + user + "/tasks"}>Tasks</Link>
        </li>
        <li className="auth-menu-item poppins-semibold feature-disabled">
          <Link to={"/auth/" + user + "/insights"}>Insights</Link>
        </li>
      </ul>
      <div className="search">
        <input
          type="text"
          name="global-search"
          id="global-search"
          className="global-search poppins-regular"
          placeholder="Global search ..."
          value={globalSearch}
          onChange={(event) => setGlobalSearch(event.target.value)}
        />
        <IconContext.Provider
          value={{
            style: { color: "var(--primary-color)", fontSize: "28px" },
          }}
        >
          <IoIosSearch className="search-icon" />
        </IconContext.Provider>
      </div>
      <div className="profile-section poppins-regular">
        <img
          src={ProfilePicture}
          alt="Profile picture"
          className="profile-picture"
          onClick={() => setSettingsPopup(!settingsPopup)}
        />
        <div className={"settings" + (settingsPopup ? " visible" : "")}>
          <IconContext.Provider
            value={{
              style: {
                color:
                  theme === "light" || theme === ""
                    ? "var(--primary-color)"
                    : "var(--secondary-color-dark)",
              },
            }}
          >
            <BsFillTriangleFill className="triangle" />
          </IconContext.Provider>
          <ul className="settings-list poppins-regular">
            <li className="setting-item">
              <Link to={"/auth/" + user + "/profile"}>
                <CgProfile />
                <span>Profile</span>
              </Link>
            </li>
            <li className="setting-item feature-disabled">
              <GoGear />
              <span>Settings</span>
            </li>
            <li className="setting-item feature-disabled">
              <LuPaintbrush />
              <span>Themes</span>
            </li>
            <li className="setting-item">
              <div className="logout-button" onClick={() => logout()}>
                <IoLogOutOutline />
                <span>Log out</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
