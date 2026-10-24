import pool from "../../db/connection.js";

export default async function getWorkspaces() {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces ORDER BY updated_on DESC",
    );
    const workspaces = result.rows;
    return workspaces;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}