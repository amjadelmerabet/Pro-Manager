// Icons
import { TbCheck, TbClock, TbFolder } from "react-icons/tb";
import { IconContext } from "react-icons/lib";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";

// Styles
import "./ListProjectItem.css";

export default function ListProjectItem({
  project,
  user,
  openProjectClass,
  openProject,
  startProject,
  completeProject,
  resetProject,
  deleteProject,
  hoverOverProject,
  hoverOverProjectEnd,
  updatedStatus,
  theme,
}) {
  let projectDeadline = new Date(project.deadline);

  return (
    <div
      className="project"
      onMouseEnter={() => hoverOverProject(project.project_id)}
      onMouseLeave={() => hoverOverProjectEnd()}
    >
      <div className="open-project">
        <button
          className={
            "open poppins-semibold" +
            (openProjectClass === project.project_id ? " visible" : "")
          }
          onClick={() => openProject(project.project_id)}
        >
          Open
        </button>
      </div>
      <div className="project-actions">
        {project.state === 1 ? (
          <button
            className="start-project"
            onClick={() => startProject(project.project_id)}
          >
            <IconContext.Provider
              value={{
                style: {
                  color:
                    theme === "light" || theme === ""
                      ? "rgb(245, 200, 45)"
                      : "rgb(255, 215, 45)",
                  fontSize: "20px",
                },
              }}
            >
              <TbClock />
            </IconContext.Provider>
          </button>
        ) : (
          ""
        )}
        {project.state !== 1 ? (
          <button
            className="reset-project"
            onClick={() => resetProject(project.project_id)}
          >
            <IconContext.Provider
              value={{
                style: {
                  color:
                    theme === "light" || theme === ""
                      ? "rgb(45, 180, 245)"
                      : "rgb(45, 200, 255)",
                  fontSize: "20px",
                },
              }}
            >
              <BiReset />
            </IconContext.Provider>
          </button>
        ) : (
          ""
        )}
        {project.state !== 3 ? (
          <button
            className="complete-project"
            onClick={() => completeProject(project.project_id)}
          >
            <IconContext.Provider
              value={{
                style: {
                  color:
                    theme === "light" || theme === ""
                      ? "rgb(0, 200, 45)"
                      : "rgb(25, 255, 65)",
                  fontSize: "22px",
                },
              }}
            >
              <TbCheck />
            </IconContext.Provider>
          </button>
        ) : (
          ""
        )}
        <button
          className="delete-project"
          onClick={() => deleteProject(project.project_id)}
        >
          <IconContext.Provider
            value={{
              style: {
                color:
                  theme === "light" || theme === ""
                    ? "rgb(225, 0, 45)"
                    : "rgb(255, 0, 25)",
                fontSize: "24px",
              },
            }}
          >
            <IoClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="left">
        <div className="project-icon">
          <IconContext.Provider
            value={{
              style: {
                color: "var(--primary-color)",
                fontSize: "125%",
              },
            }}
          >
            <TbFolder />
          </IconContext.Provider>
        </div>
        <div className="project-name poppins-semibold">{project.name}</div>
      </div>
      <div className="right">
        <div className="project-properties">
          <div className="state">
            <div className="property-name poppins-semibold">State</div>
            <div
              className={
                "property-value state-value poppins-regular" +
                (project.state === 1
                  ? " not-started-value"
                  : project.state === 2
                    ? " in-progress-value"
                    : " completed-value")
              }
            >
              <div>
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
          </div>
          <div className="deadline">
            <div className="property-name poppins-semibold">Deadline</div>
            <div className="property-value poppins-regular">
              {project.deadline
                ? projectDeadline.getMonth() +
                  "/" +
                  projectDeadline.getDate() +
                  "/" +
                  projectDeadline.getFullYear()
                : "No deadline"}
            </div>
          </div>
          <div className="created-by">
            <div className="property-name poppins-semibold">Created by</div>
            <div className="property-value poppins-regular">
              {project.created_by === user ? "You" : project.created_bys}
            </div>
          </div>
        </div>
      </div>
      <div className="updated poppins-regular">Updated {updatedStatus}</div>
    </div>
  );
}
