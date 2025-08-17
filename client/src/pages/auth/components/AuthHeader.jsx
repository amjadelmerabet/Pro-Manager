import { Link } from "react-router";
import { IoIosSearch } from "react-icons/io";
import ProfilePicture from "../../../assets/profile-picture.jpg";

import "./AuthHeader.css";
import { IconContext } from "react-icons/lib";

export default function AuthHeader({ user }) {
  return (
    <div className="container">
      <header className="auth-header">
        <h1 className="application-name poppins-bold">Pro Manager</h1>
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
          <li className="auth-menu-item poppins-semibold">
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
          />
        </div>
      </header>
    </div>
  );
}
