import { FaRegFolder } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";

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
  hoverOverProjectEnd
}) {
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
                  color: "rgb(245, 200, 45)",
                  fontSize: "24px",
                },
              }}
            >
              <GrFormClock />
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
                  color: "rgb(45, 180, 245)",
                  fontSize: "24px",
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
                  color: "rgb(0, 200, 45)",
                  fontSize: "24px",
                },
              }}
            >
              <IoCheckmark />
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
                color: "rgb(225, 0, 45)",
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
            <FaRegFolder />
          </IconContext.Provider>
        </div>
        <div className="project-name poppins-semibold">{project.name}</div>
      </div>
      <div className="right">
        <div className="project-properties">
          <div className="state">
            <div className="property-name poppins-semibold">State</div>
            <div className="property-value poppins-regular">
              {project.state === 1
                ? "Not started"
                : project.state === 2
                ? "In progress"
                : "Completed"}
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
    </div>
  );
}
