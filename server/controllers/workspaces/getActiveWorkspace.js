import pool from "../../db/connection.js";

export default async function getActiveWorkspace(owner) {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE owner = $1 AND active = true",
      [owner],
    );
    const workspace = result.rows;
    return workspace;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
