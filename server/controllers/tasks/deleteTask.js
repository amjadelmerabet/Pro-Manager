import pool from "../../db/connection.js";
import getTaskById from "./getTaskById.js";

export default async function deleteTask(id) {
  const task = await getTaskById(id);
  if (task) {
    try {
      const deletedTask = await pool.query("DELETE FROM tasks WHERE task_id = $1", [id]);
      return { status: "success", message: "Task deleted successfully" };
    } catch (error) {
      console.log("Query error: " + error);    
    }
  } else {
    return { status: "fail", message: "404 Task not found" };
  }
}