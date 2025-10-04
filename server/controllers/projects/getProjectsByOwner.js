import pool from "../../db/connection.js";

export default async function getProjectsByOwner(owner) {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE owner = '" + owner + "' ORDER BY updated_on DESC");
    const projects = result.rows;
    return projects;
  } catch (error) {
    console.log("Query error: " + error);
  }
}