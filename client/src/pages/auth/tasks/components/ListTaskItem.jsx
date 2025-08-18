import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { IconContext } from "react-icons/lib";

import "./ListTaskItem.css";

export default function ListTaskItem({
  task,
  user,
  hoverOverTask,
  hoverOverTaskEnd,
  updatedStatus,
  openTaskClass,
  openTask,
  startTask,
  completeTask,
  resetTask,
  deleteTask,
}) {
  return (
    <li
      className="task"
      onMouseEnter={() => hoverOverTask(task.task_id)}
      onMouseLeave={() => hoverOverTaskEnd()}
    >
      <div className="task-name poppins-regular">{task.name}</div>
      <div className="properties">
        <div className="assignee">
          <div className="property-name poppins-semibold">Assigned to</div>
          <div className="property-value poppins-regular">
            {task.assigned_to === user ? "You" : task.assigned_to}
          </div>
        </div>
        <div className="status">
          <div className="property-name poppins-semibold">State</div>
          <div className="property-value poppins-regular">
            {task.state === 1 ? "To do" : task.state === 2 ? "Doing" : "Done"}
          </div>
        </div>
      </div>
      <div className="updated poppins-regular">{updatedStatus}</div>
      <div className="open-task">
        <button
          className={
            "open poppins-semibold" +
            (openTaskClass === task.task_id ? " visible" : "")
          }
          onClick={() => openTask(task.task_id)}
        >
          Open
        </button>
      </div>
      <div className="task-actions">
        {task.state === 1 ? (
          <button
            className="start-task poppins-semibold"
            onClick={() => startTask(task.task_id)}
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
        {task.state !== 1 ? (
          <button
            className="reset-task poppins-semibold"
            onClick={() => resetTask(task.task_id)}
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
        {task.state !== 3 ? (
          <button
            className="complete-task poppins-semibold"
            onClick={() => completeTask(task.task_id)}
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
          type="button"
          className="delete-task poppins-semibold"
          onClick={() => deleteTask(task.task_id)}
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
    </li>
  );
}
