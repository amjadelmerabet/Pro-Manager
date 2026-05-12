import pool from "../../db/connection.js";
import getTaskById from "./getTaskById.js";

export default async function updateTask(id, updates) {
  try {
    const acceptedFields = [
      "name",
      "state",
      "short_description",
      "description",
      "assigned_to",
      "priority",
      "project",
    ];
    let query = "UPDATE tasks SET ";
    let propertiesToUpdate = [];
    let updateError = false;
    let errorObject = {};
    Object.entries(updates).forEach((update, index) => {
      if (acceptedFields.indexOf(update[0]) === -1) {
        updateError = true;
        errorObject.errorMessage = "Bad Request";
        errorObject.error = "Invalid field " + update[0];
      }
      query += `${update[0]} = $${index + 1}`;
      if (index < Object.keys(updates).length - 1) {
        query += ", ";
      }
      propertiesToUpdate.push(update[1]);
    });
    if (!updateError) {
      let now = new Date();
      propertiesToUpdate.push(now);
      query += `, updated_on = $${Object.keys(updates).length + 1} WHERE task_id = '${id}'`;
      const updatedTask = await pool.query(query, propertiesToUpdate);
      return updatedTask;
    } else {
      return errorObject;
    }
  } catch (error) {
    return { errorMessage: "Internal Server Error", error };
  }
}
