import pool from "../../db/connection.js";

export default async function getProjects() {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY updated_on DESC",
    );
    const projects = result.rows;
    return projects;
  } catch (error) {
    console.log("Query error: " + error);
  }
}
