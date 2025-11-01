import { FaRegCheckSquare, FaRegFolder, FaRegStar } from "react-icons/fa";
import { BsFillTriangleFill } from "react-icons/bs";

import "./AllMenu.css";
import { Link } from "react-router";

export default function AllMenu({ user, setPopupDisplay }) {
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
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <FaRegFolder className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Projects</div>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">
            <button
              className="poppins-regular"
              onClick={() => {
                setPopupDisplay({ visible: true, type: "project" });
              }}
            >
              Create new
            </button>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects`}>All projects</Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=1`}>
              Not started
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=2`}>
              In progress
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=3`}>Completed</Link>
          </li>
        </ul>
      </div>
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <FaRegCheckSquare className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Tasks</div>
          </div>
          {/* <TbTriangleInvertedFilled className="app-menu-arrow" /> */}
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">
            <button
              className="poppins-regular"
              onClick={() => {
                setPopupDisplay({ visible: true, type: "task" });
              }}
            >
              Create new
            </button>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks`}>All tasks</Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=1`}>To do</Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=2`}>Doing</Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=3`}>Done</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
