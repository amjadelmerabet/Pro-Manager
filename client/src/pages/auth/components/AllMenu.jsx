import { FaRegCheckSquare, FaRegFolder, FaRegStar } from "react-icons/fa";
import { BsFillTriangleFill } from "react-icons/bs";
import {
  TbCopyCheckFilled,
  TbFolder,
  TbFolderBolt,
  TbFolderCheck,
  TbFolderCog,
  TbFolderFilled,
  TbFolderPlus,
  TbFoldersFilled,
  TbList,
  TbListDetails,
  TbSquare,
  TbSquareArrowRight,
  TbSquareCheck,
  TbSquareCheckFilled,
  TbSquarePlus,
  TbStar,
} from "react-icons/tb";

import "./AllMenu.css";
import { Link } from "react-router";
import { IconContext } from "react-icons/lib";

export default function AllMenu({ user, setPopupDisplay, theme }) {
  const { name } = JSON.parse(sessionStorage.getItem("authUser"));

  return (
    <div
      className={
        "all-menu" + (theme === "light" || theme === "" ? " light" : " dark")
      }
    >
      <p className="welcome poppins-regular">
        Welcome back <span className="poppins-semibold">{name}</span>
      </p>
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <TbStar className="app-menu-icon" />
            <h4 className="app-menu-title poppins-semibold">Favorites</h4>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul className="modules poppins-regular">
          <li className="module">
            <Link to={`/auth/${user}/projects`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbFolderFilled className="module-icon" />
              </IconContext.Provider>
              My projects
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbSquareCheckFilled className="module-icon" />
              </IconContext.Provider>
              My tasks
            </Link>
          </li>
          <li className="module feature-disabled">
            <IconContext.Provider
              value={{
                style: {
                  color:
                    theme === "light" || theme === ""
                      ? "var(--primary-color)"
                      : "var(--primary-color-dark)",
                },
              }}
            >
              <TbCopyCheckFilled className="module-icon" />
            </IconContext.Provider>
            My teams tasks
          </li>
          <li className="module feature-disabled">
            <IconContext.Provider
              value={{
                style: {
                  color:
                    theme === "light" || theme === ""
                      ? "var(--primary-color)"
                      : "var(--primary-color-dark)",
                },
              }}
            >
              <TbFoldersFilled className="module-icon" />
            </IconContext.Provider>
            My teams projects
          </li>
        </ul>
      </div>
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <TbFolder className="app-menu-icon" />
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
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbFolderPlus className="module-icon" />
              </IconContext.Provider>
              Create new
            </button>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbListDetails className="module-icon" />
              </IconContext.Provider>
              All projects
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=1`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbFolderBolt className="module-icon" />
              </IconContext.Provider>
              Not started
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=2`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbFolderCog className="module-icon" />
              </IconContext.Provider>
              In progress
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/projects?filter=state=3`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbFolderCheck className="module-icon" />
              </IconContext.Provider>
              Completed
            </Link>
          </li>
        </ul>
      </div>
      <div className="application-menu">
        <div className="app-menu-header">
          <div>
            <TbSquareCheck className="app-menu-icon" />
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
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbSquarePlus className="module-icon" />
              </IconContext.Provider>
              Create new
            </button>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbList className="module-icon" />
              </IconContext.Provider>
              All tasks
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=1`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbSquare className="module-icon" />
              </IconContext.Provider>
              To do
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=2`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbSquareArrowRight className="module-icon" />
              </IconContext.Provider>
              Doing
            </Link>
          </li>
          <li className="module">
            <Link to={`/auth/${user}/tasks?filter=state=3`}>
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      theme === "light" || theme === ""
                        ? "var(--primary-color)"
                        : "var(--primary-color-dark)",
                  },
                }}
              >
                <TbSquareCheck className="module-icon" />
              </IconContext.Provider>
              Done
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
