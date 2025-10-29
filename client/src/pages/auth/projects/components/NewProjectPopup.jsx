// Hooks
import { useEffect, useState } from "react";

// Icons
import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";

// Styles
import "./NewProjectPopup.css";

export default function NewProjectPopup({
  newProject,
  setNewProject,
  popupDisplay,
  setPopupDisplay,
  createNewProject,
  parent,
}) {
  const [newProjectClass, setNewProjectClass] = useState("");
  const [deadlineInPast, setDeadlineInPast] = useState(false);
  const [showWarningMessage, setShowWarningMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setNewProjectClass(" open");
    }, 250);
  }, [popupDisplay]);

  const closePopupDialog = () => {
    setNewProjectClass("");
    setTimeout(() => {
      if (parent === "dashboard") {
        setPopupDisplay({ visible: false, type: "" });
      } else {
        setPopupDisplay({ ...popupDisplay, active: false });
      }
    }, 250);
  };

  const checkDeadlineAndUpdateProject = (deadline) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    console.log(today);
    const deadlineDate = new Date(deadline);
    console.log(deadlineDate);
    if (deadlineDate >= today) {
      setNewProject({ ...newProject, deadline: event.target.value });
      setShowWarningMessage(false);
      setTimeout(() => {
        setDeadlineInPast(false);
      }, 50);
    } else {
      setDeadlineInPast(true);
      setTimeout(() => {
        setShowWarningMessage(true);
      }, 50);
    }
  };

  return (
    <div className="new-project-popup">
      <div className={"new-project" + newProjectClass}>
        <h3 className="title poppins-bold">New Project</h3>
        <button className="close-popup" onClick={() => closePopupDialog()}>
          <IconContext.Provider value={{ style: { color: "rgb(225, 0, 45)" } }}>
            <IoClose />
          </IconContext.Provider>
        </button>
        <div>
          <label
            htmlFor="new-project-name"
            className="new-project-name-label poppins-regular"
          >
            Name
          </label>
          <input
            type="text"
            name="new-project-name"
            className="new-project-name-input poppins-regular"
            onChange={(event) =>
              setNewProject({ ...newProject, name: event.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="new-project-deadline"
            className="new-project-deadline-label poppins-regular"
          >
            Deadline
          </label>
          {deadlineInPast ? (
            <span
              className={
                "wrong-deadline-message poppins-light" +
                (showWarningMessage ? " visible" : "")
              }
            >
              * Deadline can't be in the past
            </span>
          ) : (
            ""
          )}
          <input
            type="date"
            name="new-project-deadline"
            className="new-project-deadline-input poppins-regular"
            onChange={(event) =>
              checkDeadlineAndUpdateProject(event.target.value)
            }
          />
        </div>
        <div>
          <label
            htmlFor="new-project-description"
            className="new-project-description-label poppins-regular"
          >
            Description
          </label>
          <textarea
            name="new-project-description"
            rows="8"
            cols="64"
            className="new-project-description-input poppins-regular"
            onChange={(event) =>
              setNewProject({
                ...newProject,
                description: event.target.value,
              })
            }
          ></textarea>
          {/* <input
            type="text"
            name="new-project-description"
            className="new-project-description-input"
            onChange={(event) =>
              setNewProject({
                ...newProject,
                description: event.target.value,
              })
            }
          /> */}
        </div>
        <button
          type="button"
          className={
            "create-project poppins-semibold" +
            (deadlineInPast ? " feature-disabled error" : "")
          }
          onClick={() => createNewProject()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
