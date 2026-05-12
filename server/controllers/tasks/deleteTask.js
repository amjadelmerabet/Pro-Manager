import pool from "../../db/connection.js";
import getTaskById from "./getTaskById.js";

export default async function deleteTask(id) {
  try {
    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE task_id = $1",
      [id],
    );
    return deletedTask;
  } catch (error) {
    return { error };
  }
}
