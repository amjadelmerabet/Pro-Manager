import pool from "../../db/connection.js";

export default async function createUserRole(user, role) {
  try {
    const userRole = await pool.query(
      "INSERT INTO user_roles (user_id, role) VALUES ($1, $2)",
      [user, role],
    );
    return userRole;
  } catch (error) {
    return { error };
  }
}
