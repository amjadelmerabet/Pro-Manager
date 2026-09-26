import pool from "../../db/connection.js";

export default async function getUserComments(record, id) {
  try {
    if (record === "task") {
      const result = await pool.query(
        "SELECT comment_id, value, type, record, task, created_on, created_by FROM comments WHERE record = $1 AND task = $2 ORDER BY created_on DESC",
        [record, id],
      );
      const comments = result.rows;
      return comments;
    } else if (record === "project") {
      const result = await pool.query(
        "SELECT comment_id, value, type, record, project, created_on, created_by FROM comments WHERE record = $1 AND project = $2 ORDER BY created_on DESC",
        [record, id],
      );
      const comments = result.rows;
      return comments;
    }
  } catch (error) {
    console.log("Query error: " + error);
  }
}
