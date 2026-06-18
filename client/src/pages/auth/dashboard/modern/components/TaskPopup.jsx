import updatedMessageUtil from "../../../../../utils/updatedMessageUtil";

export default function TaskPopup({
  taskPopupVisible,
  taskStates,
  popupTask,
  userId,
  updateTaskState,
  userProjects,
  deleteTaskFn,
  closeTaskPopup,
}) {
  return (
    <div className={"task-popup" + (taskPopupVisible ? " visible" : "")}>
      <div className="task-header">
        <div
          className={
            "task-state poppins-semibold " + taskStates.classes[popupTask.state]
          }
        >
          {taskStates.labels[popupTask.state]}
        </div>
        <div className="task-name poppins-semibold">{popupTask.name}</div>
      </div>
      <div className="task-info poppins-regular">
        <div className="assigned-to">
          Assigned to {popupTask.assigned_to === userId ? "Me" : ""}
        </div>
        <div className="updated">
          Updated {updatedMessageUtil(new Date(popupTask.updated_on))}
        </div>
      </div>
      <div className="task-details">
        <div className="short-description-section">
          <label
            htmlFor="short-description"
            className="short-description-label poppins-medium"
          >
            Short description
          </label>
          <input
            type="text"
            name="short-description"
            className="short-description poppins-regular"
            value={popupTask.short_description}
            onChange={() => console.log("Test")}
          />
        </div>
        <div className="description-section">
          <label
            htmlFor="description"
            className="description-label poppins-medium"
          >
            Description
          </label>
          <textarea
            name="description"
            className="description poppins-regular"
            value={popupTask.description}
            onChange={() => console.log("Test")}
          />
        </div>
      </div>
      <div className="actions">
        <div className="task-actions">
          {popupTask.state === 1 ? (
            <button
              className="action start poppins-regular"
              onClick={() => updateTaskState(2)}
            >
              Start
            </button>
          ) : (
            ""
          )}
          {popupTask.state !== 1 ? (
            <button
              className="action reset poppins-regular"
              onClick={() => updateTaskState(1)}
            >
              Reset
            </button>
          ) : (
            ""
          )}
          {popupTask.state !== 3 ? (
            <button
              className="action finish poppins-regular"
              onClick={() => updateTaskState(3)}
            >
              Finish
            </button>
          ) : (
            ""
          )}
        </div>
        {popupTask.project ? (
          <div className="project poppins-medium">
            Project:{" "}
            <span className="parent-project">
              {
                userProjects.filter(
                  (project) => project.project_id === popupTask.project,
                )[0].name
              }
            </span>
          </div>
        ) : (
          ""
        )}
        <div>
          <button
            className="action delete poppins-regular"
            onClick={() => deleteTaskFn()}
          >
            Delete
          </button>
          <button className="action save poppins-regular">Save</button>
        </div>
      </div>
      <button
        className="close-popup poppins-semibold"
        onClick={() => closeTaskPopup()}
      >
        Close
      </button>
    </div>
  );
}
