import pool from "../../db/connection.js";

export default async function getUserActivities(record, id) {
  try {
    if (record === "task") {
      const result = await pool.query(
        "SELECT activity_id, type, record, task, created_on FROM activities WHERE record = $1 AND task = $2 ORDER BY updated_on DESC",
        [record, id],
      );
      const activities = result.rows;
      return activities;
    } else if (record === "project") {
      const result = await pool.query(
        "SELECT activity_id, type, record, project, created_on FROM activities WHERE record = $1 AND project = $2 ORDER BY updated_on DESC",
        [record, id],
      );
      const activities = result.rows;
      return activities;
    }
  } catch (error) {
    console.log("Query error: " + error);
  }
}
