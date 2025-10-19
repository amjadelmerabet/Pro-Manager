import { FaRegCheckSquare, FaRegFolder, FaRegStar } from "react-icons/fa";
import { BsFillTriangleFill } from "react-icons/bs";

import "./AllMenu.css";
import { Link } from "react-router";

export default function AllMenu({ user }) {
  const { name } = JSON.parse(sessionStorage.getItem("authUser"));

  return (
    <div className="all-menu">
      <p className="welcome poppins-regular">
        Welcome back <span className="poppins-semibold">{name}</span>
      </p>
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <FaRegStar className="app-menu-icon" />
            <h4 className="app-menu-title poppins-semibold">Favorites</h4>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">
            <Link to={`/auth/${user}/projects`}>My projects</Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks`}>My tasks</Link>
          </li>
          <li className="module feature-disabled">My teams tasks</li>
        </ul>
      </div>
      <div className="application-menu feature-disabled">
        <div className="app-menu-header">
          <div>
            <FaRegFolder className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Projects</div>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">Create new</li>
          <li className="module">All projects</li>
          <li className="module">Not started</li>
          <li className="module">In progress</li>
          <li className="module">Completed</li>
        </ul>
      </div>
      <div className="application-menu feature-disabled">
        <div className="app-menu-header">
          <div>
            <FaRegCheckSquare className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Tasks</div>
          </div>
          {/* <TbTriangleInvertedFilled className="app-menu-arrow" /> */}
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">Create new</li>
          <li className="module">All tasks</li>
          <li className="module">To do</li>
          <li className="module">Doing</li>
          <li className="module">Done</li>
        </ul>
      </div>
    </div>
  );
}
