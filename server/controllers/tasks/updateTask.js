import pool from "../../db/connection.js";
import getTaskById from "./getTaskById.js";

export default async function updateTask(id, updates) {
  const task = await getTaskById(id);
  if (task) {
    let query = "UPDATE tasks SET ";
    let propertiesToUpdate = [];
    Object.entries(updates).forEach((update, index) => {
      query += `${update[0]} = $${index + 1}`;
      if (index < Object.keys(updates).length - 1) {
        query += ", ";
      }
      propertiesToUpdate.push(update[1]);
    });
    let now = new Date();
    propertiesToUpdate.push(now);
    query += `, updated_on = $${Object.keys(updates).length + 1} WHERE task_id = '${id}'`;
    const updatedTask = await pool.query(query, propertiesToUpdate);
    // console.log(query);
    // console.log(propertiesToUpdate);
    return { status: "success", message: "Task updated successfully" };
  } else {
    return { status: "fail", message: "404 Task not found" };
  }
}
