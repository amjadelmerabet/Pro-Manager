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
import { useEffect, useState } from "react";

export default function AllMenu({ user, setPopupDisplay, theme }) {
  const [favoritesMenuCollpased, setFavoritesMenuCollapsed] = useState(true);
  const [projectsMenuCollapsed, setProjectsMenuCollpased] = useState(true);
  const [tasksMenuCollapsed, setTasksMenuCollapsed] = useState(true);
  const [favoritesMenuClicked, setFavoritesMenuClicked] = useState(0);
  const [projectsMenuClicked, setProjectsMenuClicked] = useState(0);
  const [tasksMenuClicked, setTasksMenuClicked] = useState(0);
  const { name } = JSON.parse(sessionStorage.getItem("authUser"));

  const handleMenuClick = (menu) => {
    if (menu === "favorites") {
      setFavoritesMenuCollapsed(!favoritesMenuCollpased);
      setFavoritesMenuClicked((prev) => prev + 1);
    } else if (menu === "projects") {
      setProjectsMenuCollpased(!projectsMenuCollapsed);
      setProjectsMenuClicked((prev) => prev + 1);
    } else if (menu === "tasks") {
      setTasksMenuCollapsed(!tasksMenuCollapsed);
      setTasksMenuClicked((prev) => prev + 1);
    }
  };

  useEffect(() => {
    let userSettings = JSON.parse(sessionStorage.getItem(user + "-settings"));
    if (userSettings) {
      if (Object.keys(userSettings).indexOf("menus") !== -1) {
        setFavoritesMenuCollapsed(
          userSettings.menus["favorites"] === "collapse" ? true : false,
        );
        setProjectsMenuCollpased(
          userSettings.menus["projects"] === "collapse" ? true : false,
        );
        setTasksMenuCollapsed(
          userSettings.menus["tasks"] === "collapse" ? true : false,
        );
      } else {
        sessionStorage.setItem(
          user + "-settings",
          JSON.stringify({
            menus: {
              favorites: "collapse",
              projects: "collapse",
              tasks: "collapse",
            },
          }),
        );
      }
    } else {
      sessionStorage.setItem(
        user + "-settings",
        JSON.stringify({
          menus: {
            favorites: "collapse",
            projects: "collapse",
            tasks: "collapse",
          },
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (favoritesMenuClicked > 0) {
      let currentUserSettings = JSON.parse(
        sessionStorage.getItem(user + "-settings"),
      );
      let { menus } = currentUserSettings;
      menus["favorites"] = favoritesMenuCollpased ? "collapse" : "open";
      let newUserSettings = { ...currentUserSettings, menus };
      sessionStorage.setItem(
        user + "-settings",
        JSON.stringify(newUserSettings),
      );
    }
  }, [favoritesMenuClicked]);

  useEffect(() => {
    if (projectsMenuClicked > 0) {
      let currentUserSettings = JSON.parse(
        sessionStorage.getItem(user + "-settings"),
      );
      let { menus } = currentUserSettings;
      menus["projects"] = projectsMenuCollapsed ? "collapse" : "open";
      let newUserSettings = { ...currentUserSettings, menus };
      sessionStorage.setItem(
        user + "-settings",
        JSON.stringify(newUserSettings),
      );
    }
  }, [projectsMenuClicked]);

  useEffect(() => {
    if (tasksMenuClicked > 0) {
      let currentUserSettings = JSON.parse(
        sessionStorage.getItem(user + "-settings"),
      );
      let { menus } = currentUserSettings;
      menus["tasks"] = tasksMenuCollapsed ? "collapse" : "open";
      let newUserSettings = { ...currentUserSettings, menus };
      sessionStorage.setItem(
        user + "-settings",
        JSON.stringify(newUserSettings),
      );
    }
  });

  return (
    <div
      className={
        "all-menu" + (theme === "light" || theme === "" ? " light" : " dark")
      }
    >
      <p className="welcome poppins-regular">
        Welcome back <span className="poppins-semibold">{name}</span>
      </p>
      <div className="application-menu favorites-menu">
        <div
          className={
            "app-menu-header" + (favoritesMenuCollpased ? " collapse" : "")
          }
          onClick={() => handleMenuClick("favorites")}
        >
          <div>
            <TbStar className="app-menu-icon" />
            <h4 className="app-menu-title poppins-semibold">Favorites</h4>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul
          className="modules poppins-regular"
          style={{
            height: favoritesMenuCollpased ? "0px" : 25 * 4 + 16 + "px",
          }}
        >
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
      <div className="application-menu projects-menu">
        <div
          className={
            "app-menu-header" + (projectsMenuCollapsed ? " collapse" : "")
          }
          onClick={() => handleMenuClick("projects")}
        >
          <div>
            <TbFolder className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Projects</div>
          </div>
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul
          className="modules poppins-regular"
          style={{ height: projectsMenuCollapsed ? "0px" : 25 * 5 + 16 + "px" }}
        >
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
      <div className="application-menu tasks-menu">
        <div
          className={
            "app-menu-header" + (tasksMenuCollapsed ? " collapse" : "")
          }
          onClick={() => handleMenuClick("tasks")}
        >
          <div>
            <TbSquareCheck className="app-menu-icon" />
            <div className="app-menu-title poppins-semibold">Tasks</div>
          </div>
          {/* <TbTriangleInvertedFilled className="app-menu-arrow" /> */}
          <BsFillTriangleFill className="app-menu-arrow" />
        </div>
        <ul
          className="modules poppins-regular"
          style={{ height: tasksMenuCollapsed ? "0px" : 25 * 5 + 16 + "px" }}
        >
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
