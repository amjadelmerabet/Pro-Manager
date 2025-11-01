import { Link, useNavigate } from "react-router";
import { IoIosSearch } from "react-icons/io";
import ProfilePicture from "../../../assets/profile-picture.jpg";
import { IconContext } from "react-icons/lib";
import { useState } from "react";
import { BsFillTriangleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GoGear } from "react-icons/go";
import { LuPaintbrush } from "react-icons/lu";

import "./AuthHeader.css";
import { IoLogOutOutline } from "react-icons/io5";

export default function AuthHeader({ user, setAuthentication }) {
  const [settingsPopup, setSettingsPopup] = useState(false);

  let navigate = useNavigate();

  const logout = () => {
    sessionStorage.setItem("userLoggedOut", true);
    sessionStorage.removeItem("authUser");
    setAuthentication(false);
    navigate("/signin");
  };

  return (
    <div className="container">
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
              value={{ style: { color: "var(--primary-color)" } }}
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
    </div>
  );
}
