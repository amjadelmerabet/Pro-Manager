import pool from "../../db/connection.js";

export default async function createComment(
  type,
  user,
  record,
  recordId,
  value,
) {
  try {
    var now = new Date();
    if (record === "task") {
      const newComment = await pool.query(
        "INSERT INTO comments (type, record, task, value, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING comment_id",
        [type, record, recordId, value, now, user, now, user],
      );
      return newComment;
    } else if (record === "project") {
      const newComment = await pool.query(
        "INSERT INTO comments (type, record, project, value, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING comment_id",
        [type, record, recordId, value, now, user, now, user],
      );
      return newComment;
    }
  } catch (error) {
    console.log("Query error: " + error);
    return { errorMessage: "Internal Server Error", error };
  }
}
