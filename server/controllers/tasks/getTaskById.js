import pool from "../../db/connection.js";

export default async function getTaskById(id) {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [id]);
    const task = result.rows;
    return task;
  } catch (error) {
    console.log("Query error: " + error);
  }
}