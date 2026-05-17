import pool from "../../db/connection.js";

export default async function getRoleByName(name) {
  try {
    const result = await pool.query(
      "SELECT role_id FROM roles WHERE name = $1",
      [name],
    );
    const role = result.rows;
    return role;
  } catch (error) {
    return { error };
  }
}
