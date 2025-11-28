import pool from "../../db/connection.js";

export default async function getTasksByProject(project) {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE project = $1", [
      project,
    ]);
    const tasks = result.rows;
    return tasks;
  } catch (error) {
    console.log("Query error: " + error);
  }
}
