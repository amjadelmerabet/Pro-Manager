import pool from "../../db/connection.js";

export default async function getWorkspacesByOwner(owner) {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE owner = $1",
      [owner],
    );
    const workspaces = result.rows;
    return workspaces;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
