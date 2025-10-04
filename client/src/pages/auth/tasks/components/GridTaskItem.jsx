import { IconContext } from "react-icons/lib";
import { MdTaskAlt } from "react-icons/md";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark, IoClose } from "react-icons/io5";

import "./GridTaskItem.css";
import updatedMessage from "../../../../utils/updatedMessage";
import { FaFire, FaRegSnowflake } from "react-icons/fa";
import { RiAlarmWarningFill } from "react-icons/ri";

export default function GridTaskItem({
  task,
  openTaskClass,
  openTask,
  hoverOverTask,
  hoverOverTaskEnd,
  startTask,
  completeTask,
  resetTask,
  deleteTask,
  user,
}) {
  let updated = new Date(task.updated_on);
  let updatedStatus = updatedMessage(updated);
  return (
    <div
      className="task"
      onMouseEnter={() => hoverOverTask(task.task_id)}
      onMouseLeave={() => hoverOverTaskEnd()}
    >
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
      <div className="task-header">
        {/* <div className="task-icon">
          <IconContext.Provider
            value={{
              style: { color: "var(--primary-color)", fontSize: "24px" },
            }}
          >
            <MdTaskAlt />
          </IconContext.Provider>
        </div> */}
        <div className="priority task-icon">
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
        </div>
        <div className="task-name poppins-regular">{task.name}</div>
      </div>
      <div className="task-body poppins-regular">
        <div className="assigned-to">
          <div className="property-name poppins-semibold">Assigned to</div>
          <div className="property-value">
            {task.assigned_to === user ? "You" : task.assigned_to}
          </div>
        </div>
        <div className="state poppins-regular">
          <div className="property-name poppins-semibold">State</div>
          <div className="property-value">{task.state === 1 ? "To do" : (task.state === 2 ? "Doing" : "Done")}</div>
        </div>
        <div className="short-description">{task.short_description}</div>
      </div>
      <div className="updated poppins-regular">{updatedStatus}</div>
    </div>
  );
}
