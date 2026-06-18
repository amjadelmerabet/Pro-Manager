import { MdOutlineRadioButtonChecked } from "react-icons/md";

export default function ProjectsTable({
  userProjects,
  projectStates,
  openProjectPopup,
  userId,
}) {
  return (
    <table className="projects-table">
      <thead>
        <tr>
          <th className="poppins-medium">Name</th>
          <th className="poppins-medium">State</th>
          <th className="poppins-medium">Owner</th>
          <th className="poppins-medium">Deadline</th>
          <th className="poppins-medium">Updated</th>
          <th className="poppins-medium">Created</th>
        </tr>
      </thead>
      <tbody>
        {userProjects.map((userProject, index) => {
          const deadline = new Date(userProject.deadline).toLocaleString();
          const updated = new Date(userProject.updated_on).toLocaleString();
          const created = new Date(userProject.created_on).toLocaleString();
          return (
            <tr
              key={index}
              onClick={() => openProjectPopup(userProject.project_id)}
            >
              <td>
                <div>
                  <span className={projectStates.classes[userProject.state]}>
                    <MdOutlineRadioButtonChecked />
                  </span>
                  {userProject.name}
                </div>
              </td>
              <td>
                <span
                  className={
                    "poppins-semibold " +
                    projectStates.classes[userProject.state]
                  }
                >
                  {projectStates.labels[userProject.state]}
                </span>
              </td>
              <td>{userProject.owner === userId ? "Me" : ""}</td>
              <td>{deadline}</td>
              <td>{updated}</td>
              <td>{created}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
