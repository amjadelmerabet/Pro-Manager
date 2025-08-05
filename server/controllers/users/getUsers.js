import pool from "../../db/connection.js";

export default async function getUsers() {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    return users;
  } catch(error) {
    console.log("Query error: " + error);
  }
}