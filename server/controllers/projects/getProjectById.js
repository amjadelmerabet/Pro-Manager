import pool from "../../db/connection.js";

export default async function getProjectById(id) {
  try {
      const result = await pool.query("SELECT * FROM projects WHERE project_id = $1", [id]);
      const project = result.rows;
      return project;
  } catch (error) {
    console.log("Query error: " + error);
  }
}