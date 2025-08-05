import pool from "../../db/connection.js";

export default async function getUserByUsername(username) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows;
    return user;
  } catch (error) {
    console.log("Query error: " + error);
  }
}