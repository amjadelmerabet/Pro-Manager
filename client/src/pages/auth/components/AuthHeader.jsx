import { Link } from "react-router";
import { IoIosSearch } from "react-icons/io";
import ProfilePicture from "../../../assets/profile-picture.jpg";

import "./AuthHeader.css";
import { IconContext } from "react-icons/lib";

export default function AuthHeader() {
  return (
    <div className="container">
      <header className="auth-header">
        <h1 className="application-name poppins-bold">Pro Manager</h1>
        <ul className="auth-menu">
          <li className="auth-menu-item poppins-semibold">Dashboard</li>
          <li className="auth-menu-item poppins-semibold">
            <Link to="/auth/projects">Projects</Link>
          </li>
          <li className="auth-menu-item poppins-semibold">Tasks</li>
          <li className="auth-menu-item poppins-semibold">Insights</li>
        </ul>
        <div className="search">
          <input
            type="text"
            name="global-search"
            id="global-search"
            className="global-search poppins-regular"
            placeholder="Search ..."
          />
          <IconContext.Provider
            value={{ style: { color: "var(--primary-color)", fontSize: "28px" } }}
          >
            <IoIosSearch className="search-icon" />
          </IconContext.Provider>
        </div>
        <img
          src={ProfilePicture}
          alt="Profile picture"
          className="profile-picture"
        />
      </header>
    </div>
  );
}
