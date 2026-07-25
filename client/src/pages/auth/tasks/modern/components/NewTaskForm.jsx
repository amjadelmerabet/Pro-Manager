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
        "new-task-form poppins-regular" +
        (newTaskFormVisible ? " visible" : "")
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
          <label
            htmlFor="task-name"
            className="task-name-label poppins-medium"
          >
            Name
          </label>
          <input
            type="text"
            name="task-name"
            className="task-name poppins-regular"
            onChange={(e) =>
              setNewTask({ ...newTask, name: e.target.value })
            }
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
        <div className="task-state-section">
          <label
            htmlFor="task-state"
            className="task-state-label poppins-medium"
          >
            State
          </label>
          <select
            name="task-state"
            className="task-state poppins-regular"
            value={newTask.state || 1}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                state: Number(e.target.value),
              })
            }
          >
            <option value={1}>To do</option>
            <option value={2}>Doing</option>
            <option value={3}>Done</option>
          </select>
        </div>
        <div className="task-deadline-section">
          <label
            htmlFor="task-deadline"
            className="task-deadline-label poppins-medium"
          >
            Deadline
          </label>
          <input
            type="date"
            name="task-deadline"
            className="task-deadline poppins-regular"
            onChange={(e) =>
              setNewTask({
                ...newTask,
                deadline: e.target.value,
              })
            }
            required
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
