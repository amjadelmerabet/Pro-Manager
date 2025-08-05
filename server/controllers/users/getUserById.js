import pool from "../../db/connection.js";

export default async function getUserById(id) {
  try {
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
      const user = result.rows;
      return user;
  } catch (error) {
    console.log("Query error: " + error);
  }
}