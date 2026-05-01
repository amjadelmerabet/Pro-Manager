import pool from "../../../db/connection.js";

export default async function getAccessControlsByRole(role) {
  try {
    const result = await pool.query("SELECT access_control FROM roles_to_access_controls_mapping WHERE role = $1", [role]);
    const roles = result.rows;
    return roles;
  } catch (error) {
    console.log("Query error: " + error);
  }
}