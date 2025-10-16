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
  parent
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
      if (parent === "dashboard") {
        setPopupDisplay({ visible: false, type: "" });
      } else {
        setPopupDisplay({ ...popupDisplay, active: false });
      }
    }, 250);
  };

  return (
    <div className="new-task-popup">
      <div className={"new-task" + newTaskClass}>
        <h3 className="title poppins-bold">New Task</h3>
        <button className="close-popup" onClick={() => closePopupDialog()}>
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
        <div className="priority">
          <label htmlFor="priority" className="priority-label poppins-regular">
            Priority
          </label>
          <div>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-high-priority-input"
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 1 })
                  : ""
              }
            />
            <label
              htmlFor="new-task-high-priority"
              className="new-task-high-priority-label poppins-regular"
            >
              High
            </label>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-medium-priority-input"
              defaultChecked
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 2 })
                  : ""
              }
            />
            <label
              htmlFor="new-task-medium-priority"
              className="new-task-medium-priority-label poppins-regular"
            >
              Medium
            </label>
            <input
              type="radio"
              name="new-task-priority"
              className="new-task-low-priority-input"
              onChange={(event) =>
                event.target.value
                  ? setNewTask({ ...newTask, priority: 3 })
                  : ""
              }
            />
            <label
              htmlFor="new-task-low-priority"
              className="new-task-low-priority-label poppins-regular"
            >
              Low
            </label>
          </div>
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
            rows="2"
            cols="32"
            className="new-task-short-description-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, short_description: event.target.value })
            }
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="new-task-description"
            className="new-task-description-label poppins-regular"
          >
            Description
          </label>
          <textarea
            name="new-task-description"
            rows="8"
            cols="64"
            className="new-task-description-input poppins-regular"
            onChange={(event) =>
              setNewTask({ ...newTask, description: event.target.value })
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
