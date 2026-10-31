import pool from "../../db/connection.js";

export default async function updateWorkspace(id, updates, user) {
  try {
    let query = "UPDATE workspaces SET updated_on = $1, ";
    const now = new Date();
    let propertiesToUpdate = [now];
    let count = 1;
    let updateError = false;
    let errorObject = {};
    Object.entries(updates).forEach((update, index) => {
      if (update[0] === "name") {
        count++;
        query += `name = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "description") {
        count++;
        query += `description = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else if (update[0] === "owner") {
        count++;
        query += `owner = $${count}`;
        propertiesToUpdate.push(update[1]);
      } else {
        updateError = true;
        errorObject.error = "Bad Request";
        errorObject.message = "Invalid field " + update[0];
      }
      if (index < Object.keys(updates).length - 1) {
        query += ", ";
      }
    });
    if (updateError) {
      return errorObject;
    } else {
      query += `, updated_by = $${++count} WHERE workspace_id = '${id}'`;
      propertiesToUpdate.push(user);
      const updatedWorkspace = await pool.query(query, propertiesToUpdate);
      return updatedWorkspace;
    }
  } catch (error) {
    console.log("Query error: " + error);
    return { errorMessage: "Internal Server Error", error };
  }
}
