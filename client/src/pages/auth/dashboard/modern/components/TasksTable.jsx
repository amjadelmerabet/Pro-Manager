export default function TasksTable({
  userTasks,
  userProjects,
  openTaskPopup,
  taskStates,
  taskPriorities,
  userId,
}) {
  return (
    <table className="tasks-table">
      <thead>
        <tr>
          <th className="poppins-medium">Name</th>
          <th className="poppins-medium">State</th>
          <th className="poppins-medium">Priority</th>
          <th className="poppins-medium">Assignee</th>
          <th className="poppins-medium">Project</th>
          <th className="poppins-medium">Updated</th>
          <th className="poppins-medium">Created</th>
        </tr>
      </thead>
      <tbody>
        {userTasks.map((userTask, index) => {
          const updated = new Date(userTask.updated_on).toLocaleString();
          const created = new Date(userTask.created_on).toLocaleString();
          const project = userProjects.filter((project) => {
            if (project.project_id === userTask.project) {
              return project;
            }
          });
          return (
            <tr key={index} onClick={() => openTaskPopup(userTask.task_id)}>
              <td>{userTask.name}</td>
              <td>
                <span
                  className={
                    "poppins-semibold " + taskStates.classes[userTask.state]
                  }
                >
                  {taskStates.labels[userTask.state]}
                </span>
              </td>
              <td>{taskPriorities.labels[userTask.priority]}</td>
              <td>{userTask.assigned_to === userId ? "Me" : ""}</td>
              <td>{project.length > 0 ? project[0].name : ""}</td>
              <td>{updated}</td>
              <td>{created}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
