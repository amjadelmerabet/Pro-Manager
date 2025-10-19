import pool from "../../db/connection.js";
import getProjectById from "./getProjectById.js";

export default async function updateProject(id, updates) {
  const project = await getProjectById(id);
  if (project) {
    let query = "UPDATE projects SET updated_on = $1, ";
    const now = new Date();
    let propertiesToUpdate = [now];
    let count = 1;
    Object.entries(updates).forEach((update, index) => {
      if (update[0] === "name") {
        count++;
        query += `name = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "description") {
        count++;
        query += `description = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "state") {
        count++;
        query += `state = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "deadline") {
        // This needs to be handled well since it's a date type column
        count++;
        query += `deadline = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "owner") {
        // This needs to be handled weel since it's a reference to a user id
        count++;
        query += `owner = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "updated_by") {
        count++;
        query += `updated_by = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else {
        return {
          status: "fail",
          message: "There is no column with the name " + update[0],
        };
      }
      if (index < Object.keys(updates).length - 1) {
        query += ", ";
      }
    });
    query += " WHERE project_id = '" + id + "'";
    const updatedProject = await pool.query(query, propertiesToUpdate);
    // console.log(updatedProject);
    return { status: "success" };
  } else {
    return { status: "failt", message: "404 Project not found" };
  }
}
