import pool from "../../db/connection.js";

export default async function deleteUser(username) {
  try {
    const deletedUser = await pool.query("DELETE FROM users WHERE username = $1", [username]);
    return deletedUser;
  } catch (error) {
    console.log("Query error: " + error);
  }
}