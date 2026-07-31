import { MdOutlineRadioButtonChecked } from "react-icons/md";

export default function ProjectsTable({
  userProjects,
  projectStates,
  openProjectPopup,
  userId,
}) {
  const truncateDescription = (description, maxWords = 16) => {
    let descWords = description.split(" ").length;
    if (descWords <= maxWords) {
      return description;
    } else {
      let descArr = description.split(" ");
      let newDesc = "";
      for (let i = 0; i < maxWords; i++) {
        newDesc += descArr[i];
        if (i < maxWords - 1) {
          newDesc += " ";
        } else {
          newDesc += " ...";
        }
      }
      return newDesc;
    }
  };

  return (
    <table className="projects-table">
      <thead>
        <tr>
          <th className="poppins-medium">Name</th>
          <th className="poppins-medium">State</th>
          <th className="poppins-medium">Owner</th>
          <th className="poppins-medium">Deadline</th>
          <th className="poppins-medium">Description</th>
          <th className="poppins-medium">Updated</th>
          <th className="poppins-medium">Created</th>
        </tr>
      </thead>
      <tbody>
        {userProjects.map((userProject, index) => {
          const deadline = new Date(userProject.deadline).toLocaleDateString("fr");
          const updated = new Date(userProject.updated_on).toLocaleDateString("fr");
          const created = new Date(userProject.created_on).toLocaleDateString("fr");
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
                    "poppins-medium " + projectStates.classes[userProject.state]
                  }
                >
                  {projectStates.labels[userProject.state]}
                </span>
              </td>
              <td>{userProject.owner === userId ? "Me" : ""}</td>
              <td>{deadline}</td>
              <td className="description">{truncateDescription(userProject.description)}</td>
              <td>{updated}</td>
              <td>{created}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
