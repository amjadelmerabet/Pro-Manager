import { MdOutlineRadioButtonChecked } from "react-icons/md";
import updatedMessageUtil from "../../../../../utils/updatedMessageUtil";

export default  function ProjectPopup({
  projectPopupVisible,
  projectStates,
  popupProject,
  userId,
  projectUpdates,
  updateProjectDescription,
  userTasks,
  taskStates,
  updateProjectState,
  deleteProjectFn,
  saveUpdates,
  closeProjectPopup,
}) {
  return (
    <div className={"project-popup" + (projectPopupVisible ? " visible" : "")}>
      <div className="project-header">
        <div
          className={
            "project-state poppins-semibold " +
            projectStates.classes[popupProject.state]
          }
        >
          {projectStates.labels[popupProject.state]}
        </div>
        <h3 className="project-name poppins-semibold">{popupProject.name}</h3>
      </div>
      <div className="project-info">
        <div className="owner">
          Owned by {popupProject.owner === userId ? "Me" : ""}
        </div>
        <div className="updated">
          Updated {updatedMessageUtil(new Date(popupProject.updated_on))}
        </div>
      </div>
      <div className="project-details">
        <div className="description-label poppins-medium">Description</div>
        <textarea
          className="description poppins-regular"
          value={projectUpdates.description}
          onChange={(e) => updateProjectDescription(e.target.value)}
        />
      </div>
      <div className="project-tasks">
        <h3 className="title">Tasks</h3>
        <table className="project-tasks-table">
          <thead>
            <tr>
              <th className="poppins-medium">Name</th>
              <th className="poppins-medium">State</th>
              <th className="poppins-medium">Assignee</th>
              <th className="poppins-medium">Updated</th>
              <th className="poppins-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {userTasks.map((task, index) => {
              if (task.project === popupProject.project_id) {
                const updated = new Date(task.updated_on).toLocaleString();
                const created = new Date(task.created_on).toLocaleString();
                return (
                  <tr className="project-task" key={index}>
                    <td>
                      <div>
                        <span className={taskStates.classes[task.state]}>
                          <MdOutlineRadioButtonChecked />
                        </span>
                        {task.name}
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          "poppins-semibold " + taskStates.classes[task.state]
                        }
                      >
                        {taskStates.labels[task.state]}
                      </span>
                    </td>
                    <td>{task.assigned_to === userId ? "Me" : ""}</td>
                    <td>{updated}</td>
                    <td>{created}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      <div className="actions">
        <div className="project-actions">
          {popupProject.state === 1 ? (
            <button
              className="action poppins-regular"
              onClick={() => updateProjectState(2)}
            >
              Start
            </button>
          ) : (
            ""
          )}
          {popupProject.state !== 1 ? (
            <button
              className="action poppins-regular"
              onClick={() => updateProjectState(1)}
            >
              Reset
            </button>
          ) : (
            ""
          )}
          {popupProject.state !== 3 ? (
            <button
              className="action poppins-regular"
              onClick={() => updateProjectState(3)}
            >
              Complete
            </button>
          ) : (
            ""
          )}
        </div>
        <div>
          <button
            className="action poppins-regular delete"
            onClick={() => deleteProjectFn()}
          >
            Delete
          </button>
          <button
            className={
              "action poppins-regular save" +
              (Object.keys(projectUpdates).length !== 0 ? " enable-save" : "")
            }
            onClick={() => saveUpdates()}
          >
            Save
          </button>
        </div>
      </div>
      <button
        className="close-popup poppins-semibold"
        onClick={() => closeProjectPopup()}
      >
        Close
      </button>
    </div>
  );
}
