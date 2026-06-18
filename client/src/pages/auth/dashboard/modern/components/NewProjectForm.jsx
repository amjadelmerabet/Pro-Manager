export default function NewProjectForm({
  newProjectFormVisible,
  closeNewProjectForm,
  newProject,
  setNewProject,
  createNewProjectFn,
}) {
  return (
    <div
      className={
        "new-project-form poppins-regular" +
        (newProjectFormVisible ? " visible" : "")
      }
    >
      <button
        className="close-form poppins-semibold"
        onClick={() => closeNewProjectForm()}
      >
        Close
      </button>
      <h2 className="form-title poppins-bold">New Project</h2>
      <div>
        <div className="project-name-section">
          <label
            htmlFor="project-name"
            className="project-name-label poppins-medium"
          >
            Name
          </label>
          <input
            type="text"
            name="project-name"
            className="project-name poppins-regular"
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
        </div>
        <div className="project-deadline-section">
          <label
            htmlFor="project-deadline"
            className="project-deadline-label poppins-medium"
          >
            Deadline
          </label>
          <input
            type="date"
            name="project-deadline"
            className="project-deadline poppins-regular"
            onChange={(e) =>
              setNewProject({
                ...newProject,
                deadline: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="project-description-section">
          <label
            htmlFor="project-description"
            className="project-description-label poppins-medium"
          >
            Description
          </label>
          <textarea
            name="project-description"
            className="project-description poppins-regular"
            rows="12"
            onChange={(e) =>
              setNewProject({
                ...newProject,
                description: e.target.value,
              })
            }
          />
        </div>
        <button
          className="create-project poppins-semibold"
          onClick={() => createNewProjectFn()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
