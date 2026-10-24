import pool from "../../db/connection.js";

export default async function createWorkspace(
  name,
  owner,
  description,
  updated_by,
  created_by,
) {
  try {
    let now = new Date();
    const result = await pool.query(
      "INSERT INTO workspaces (name, owner, description, updated_on, updated_by, created_on, created_by) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING workspace_id",
      [name, owner, description, now, updated_by, now, created_by],
    );
    const workspace = result.rows;
    return workspace;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
