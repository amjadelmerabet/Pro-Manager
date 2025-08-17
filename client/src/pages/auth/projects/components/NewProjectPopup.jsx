import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";

import "./NewProjectPopup.css";

export default function NewProjectPopup({
  newProject,
  setNewProject,
  popupDisplay,
  setPopupDisplay,
  createNewProject,
}) {
  const [newProjectClass, setNewProjectClass] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setNewProjectClass(" open");
    }, 250);
  }, [popupDisplay]);

  const closePopupDialog = () => {
    setNewProjectClass("");
    setTimeout(() => {
      setPopupDisplay({ ...popupDisplay, active: false })
    }, 250);
  }

  return (
    <div className="new-project-popup">
      <div className={"new-project" + newProjectClass}>
        <button
          className="close-popup"
          onClick={() => closePopupDialog()}
        >
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
            htmlFor="new-project-description"
            className="new-project-description-label poppins-regular"
          >
            Description
          </label>
          <textarea
            name="new-project-description"
            rows="8"
            cols="48"
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
          className="create-project poppins-semibold"
          onClick={() => createNewProject()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
