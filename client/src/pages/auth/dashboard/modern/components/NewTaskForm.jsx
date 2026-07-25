export default function NewTaskForm({
  newTaskFromVisible,
  closeNewTaskForm,
  newTask,
  setNewTask,
  createNewTaskFn,
}) {
  return (
    <div
      className={
        "new-task-form poppins-regular" + (newTaskFromVisible ? " visible" : "")
      }
    >
      <button
        className="close-form poppins-semibold"
        onClick={() => closeNewTaskForm()}
      >
        Close
      </button>
      <h2 className="form-title poppins-bold">New Task</h2>
      <div>
        <div className="task-name-section">
          <label htmlFor="task-name" className="task-name-label poppins-medium">
            Name
          </label>
          <input
            type="text"
            name="task-name"
            className="task-name poppins-regular"
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
        </div>
        <div className="task-priority-section">
          <label
            htmlFor="task-priority"
            className="task-priority-label poppins-medium"
          >
            Priority
          </label>
          <div>
            <div className="high-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority poppins-regular"
                value="1"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: Number(e.target.value),
                  })
                }
              />
              <label
                htmlFor="task-priority"
                className="high-priority-label poppins-regular"
              >
                High
              </label>
            </div>
            <div className="medium-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority poppins-regular"
                value="2"
                defaultChecked
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: Number(e.target.value),
                  })
                }
              />
              <label
                htmlFor="task-priority"
                className="medium-priority-label poppins-regular"
              >
                Medium
              </label>
            </div>
            <div className="low-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority poppins-regular"
                value="3"
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: Number(e.target.value),
                  })
                }
              />
              <label
                htmlFor="task-priority"
                className="low-priority-label poppins-regular"
              >
                Low
              </label>
            </div>
          </div>
        </div>
        <div className="task-short-description-section">
          <label
            htmlFor="task-short-description"
            className="task-short-description-label poppins-medium"
          >
            Short description
          </label>
          <input
            type="text"
            name="task-short-description"
            className="task-short-description poppins-regular"
            onChange={(e) =>
              setNewTask({
                ...newTask,
                short_description: e.target.value,
              })
            }
          />
        </div>
        <div className="task-description-section">
          <label
            htmlFor="task-description"
            className="task-description-label poppins-medium"
          >
            Description
          </label>
          <textarea
            type="text"
            name="task-description"
            className="task-description poppins-regular"
            rows="12"
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>
        <button
          className="create-task poppins-semibold"
          onClick={() => createNewTaskFn()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
