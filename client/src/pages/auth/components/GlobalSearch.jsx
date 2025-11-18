import {
  FaFire,
  FaRegCheckSquare,
  FaRegFolder,
  FaRegSnowflake,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { RiAlarmWarningFill } from "react-icons/ri";
import { Link } from "react-router";

import "./GlobalSearch.css";

export default function GlobalSearch({
  globalSearch,
  setGlobalSearch,
  setGlobalSearchInputFocus,
  globalSearchList,
  user,
  projectsMatchingSearch,
  tasksMatchingSearch,
  closeGlobalSearch,
}) {
  return (
    <div className="global-search">
      <div className="close-global-search" onClick={() => closeGlobalSearch()}>
        <IconContext.Provider
          value={{
            style: { fontSize: "24px", color: "rgb(245, 0, 45)" },
          }}
        >
          <IoClose />
        </IconContext.Provider>
      </div>
      <div className="global-search-header">
        <input
          type="text"
          className="global-search-input poppins-regular"
          value={globalSearch}
          placeholder="Global search ..."
          onChange={(event) => setGlobalSearch(event.target.value)}
          onFocus={() => setGlobalSearchInputFocus(true)}
        />
      </div>
      <div className="global-search-body">
        {globalSearch !== "" ? (
          <div>
            <div className="global-search-category poppins-bold">Projects</div>
            <div className="projects poppins-regular">
              {globalSearchList
                .filter((record) => {
                  if (
                    Object.keys(record).indexOf("project_id") !== -1 &&
                    record.name
                      .toLowerCase()
                      .includes(globalSearch.toLowerCase())
                  ) {
                    return record;
                  }
                })
                .map((project) => {
                  return (
                    <div className="project-found" key={project.project_id}>
                      <div className="project-header">
                        <div className="project-name">
                          <div className="project-icon">
                            <IconContext.Provider
                              value={{
                                style: { color: "var(--primary-color)" },
                              }}
                            >
                              <FaRegFolder />
                            </IconContext.Provider>
                          </div>
                          <Link
                            to={`/auth/${user}/project/${project.project_id}?view=dashboard`}
                          >
                            {project.name}
                          </Link>
                        </div>
                        <div
                          className={
                            "project-state" +
                            (project.state === 1
                              ? " not-started"
                              : project.state === 2
                                ? " in-progress"
                                : " completed")
                          }
                        >
                          <span
                            className={
                              "state" +
                              (project.state === 1
                                ? " not-started"
                                : project.state === 2
                                  ? " in-progress"
                                  : " completed")
                            }
                          ></span>
                          {project.state === 1
                            ? "Not started"
                            : project.state === 2
                              ? "In progress"
                              : "Completed"}
                        </div>
                      </div>
                      <div className="project-body">{project.description}</div>
                    </div>
                  );
                })}
              {projectsMatchingSearch === 0 ? (
                <p className="no-projects-found">
                  No project matching your search was found 🫤
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="global-search-category poppins-bold">Tasks</div>
            <div className="tasks poppins-regular">
              {globalSearchList
                .filter((record) => {
                  if (
                    Object.keys(record).indexOf("task_id") !== -1 &&
                    record.name
                      .toLowerCase()
                      .includes(globalSearch.toLowerCase())
                  ) {
                    return record;
                  }
                })
                .map((task) => {
                  return (
                    <div className="task-found" key={task.task_id}>
                      <div className="task-header poppins-regular">
                        <div className="task-name">
                          <div className="task-icon">
                            <IconContext.Provider
                              value={{
                                style: { color: "var(--primary-color)" },
                              }}
                            >
                              <FaRegCheckSquare />
                            </IconContext.Provider>
                          </div>
                          <Link
                            to={`/auth/${user}/task/${task.task_id}/?view=dashboard`}
                          >
                            {task.name}
                          </Link>
                        </div>
                        <div className="task-info">
                          <div
                            className={
                              "task-priority" +
                              (task.priority === 1
                                ? " high"
                                : task.priority === 2
                                  ? " medium"
                                  : " low")
                            }
                          >
                            <span className="icon">
                              <IconContext.Provider
                                value={{
                                  style: {
                                    color:
                                      task.priority === 1
                                        ? "rgb(245, 0, 45)"
                                        : task.priority === 2
                                          ? "rgb(245, 120, 0)"
                                          : "rgb(0, 120, 245)",
                                  },
                                }}
                              >
                                {task.priority === 1 ? (
                                  <RiAlarmWarningFill />
                                ) : task.priority === 2 ? (
                                  <FaFire />
                                ) : (
                                  <FaRegSnowflake />
                                )}
                              </IconContext.Provider>
                            </span>
                            {task.priority === 1
                              ? "High"
                              : task.priority === 2
                                ? "Medium"
                                : "Low"}
                          </div>
                          <div
                            className={
                              "task-state" +
                              (task.state === 1
                                ? " to-do"
                                : task.state === 2
                                  ? " doing"
                                  : " done")
                            }
                          >
                            <span
                              className={
                                "state" +
                                (task.state === 1
                                  ? " to-do"
                                  : task.state === 2
                                    ? " doing"
                                    : " done")
                              }
                            ></span>
                            {task.state === 1
                              ? "To do"
                              : task.state === 2
                                ? "Doing"
                                : "Done"}
                          </div>
                        </div>
                      </div>
                      <div className="task-body">{task.short_description}</div>
                    </div>
                  );
                })}
              {tasksMatchingSearch === 0 ? (
                <p className="no-tasks-found">
                  No task matching your search was found 🫤
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div className="empty-body poppins-regular">
            Type something you are looking for to see if there are matching records ...
          </div>
        )}
      </div>
    </div>
  );
}
