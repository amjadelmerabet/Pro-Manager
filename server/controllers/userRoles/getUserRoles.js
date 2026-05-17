import pool from "../../db/connection.js";

export default async function getUserRoles() {
  try {
    const result = await pool.query("SELECT user_id, role FROM user_roles");
    const userRoles = result.rows;
    return userRoles;
  } catch (error) {
    return { error };
  }
}
