import { IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";
import { useEffect, useState } from "react";

import "./NewTaskPopup.css";

export default function NewTaskPopup({
  newTask,
  setNewTask,
  createNewTask,
  popupDisplay,
  setPopupDisplay,
}) {
  const [newTaskClass, setNewTaskClass] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setNewTaskClass(" open");
    }, 250);
  }, [popupDisplay]);

  const closePopupDialog = () => {
    setNewTaskClass("");
    setTimeout(() => {
      setPopupDisplay({ ...popupDisplay, active: false })
    }, 250);
  }

  return (
    <div className="new-task-popup">
      <div className={"new-task" + newTaskClass}>
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
            htmlFor="new-task-name"
            className="new-task-name-label poppins-regular"
          >
            Name
          </label>
          <input
            type="text"
            name="new-task-name"
            className="new-task-name-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, name: event.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="new-task-short-description"
            className="new-task-short-description-label poppins-regular"
          >
            Short description
          </label>
          <textarea
            name="new-task-short-description"
            rows="4"
            cols="32"
            className="new-task-short-description-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, short_description: event.target.value })
            }
          ></textarea>
        </div>
        <button
          type="button"
          className="create-task poppins-semibold"
          onClick={() => createNewTask()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
