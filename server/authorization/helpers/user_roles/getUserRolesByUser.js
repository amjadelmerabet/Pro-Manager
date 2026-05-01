import pool from "../../../db/connection.js";

export default async function getUserRolesByUser(user) {
  try {
    const result = await pool.query("SELECT role FROM user_roles WHERE user_id = $1", [user]);
    const userRoles = result.rows;
    return userRoles;
  } catch (error) {
    console.log("Query error: " + error);
  }
}