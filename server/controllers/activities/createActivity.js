import pool from "../../db/connection.js";

export default async function createActivity(type, user, record, recordId) {
  try {
    var now = new Date();
    if (record === "task") {
      const newActivity = await pool.query(
        "INSERT INTO activities (type, user_id, record, task, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING activity_id",
        [
          type,
          user,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
      return newActivity;
    } else if (record === "project") {
      const newActivity = await pool.query(
        "INSERT INTO activities (type, user_id, record, project, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING activity_id",
        [
          type,
          user,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
      return newActivity;
    }
  } catch (error) {
    return { errorMessage: "Internal Server Error", error };
  }
}
