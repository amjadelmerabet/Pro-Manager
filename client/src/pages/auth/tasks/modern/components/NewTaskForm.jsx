export default function NewTaskForm({
  newTaskFormVisible,
  closeNewTaskForm,
  newTask,
  setNewTask,
  createNewTaskFn,
  projects,
}) {
  return (
    <div
      className={
        "new-task-form poppins-regular" + (newTaskFormVisible ? " visible" : "")
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
        <div className="task-project-section">
          <label
            htmlFor="task-project"
            className="task-project-label poppins-medium"
          >
            Project
          </label>
          <select
            name="task-project"
            className="task-project poppins-regular"
            value={newTask.project || ""}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                project: e.target.value === "" ? null : e.target.value,
              })
            }
          >
            <option value="">-- None --</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="task-priority-section">
          <label
            htmlFor="task-priority"
            className="task-priority-label poppins-medium"
          >
            Priority
          </label>
          <div className="task-priorities">
            <div className="high-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority"
                value="1"
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: Number(e.target.value) })
                }
              />
              <label htmlFor="task-priority" className="task-priority-label">
                High
              </label>
            </div>
            <div className="medium-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority"
                value="2"
                defaultChecked
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: Number(e.target.value) })
                }
              />
              <label htmlFor="task-priority" className="task-priority-label">
                Medium
              </label>
            </div>
            <div className="low-priority">
              <input
                type="radio"
                name="task-priority"
                className="task-priority"
                value="3"
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: Number(e.target.value) })
                }
              />
              <label htmlFor="task-priority" className="task-priority-label">
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
            className="task-short-description"
            onChange={(e) =>
              setNewTask({ ...newTask, short_description: e.target.value })
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
            name="task-description"
            className="task-description poppins-regular"
            rows="8"
            onChange={(e) =>
              setNewTask({
                ...newTask,
                description: e.target.value,
              })
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
