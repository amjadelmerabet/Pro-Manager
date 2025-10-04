import pool from "../../db/connection.js";

export default async function getTasks() {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY updated_on DESC");
    const tasks = result.rows;
    return tasks;
  } catch (error) {
    console.log("Query error: " + error);
  }
}