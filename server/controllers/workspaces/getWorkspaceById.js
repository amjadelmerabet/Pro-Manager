import pool from "../../db/connection.js";

export default async function getWorkspaceById(id) {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE workspace_id = $1",
      [id],
    );
    const workspace = result.rows;
    return workspace;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
