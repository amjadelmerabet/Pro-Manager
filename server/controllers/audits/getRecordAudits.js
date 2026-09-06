import pool from "../../db/connection.js";

export default async function getRecordAudits(id) {
  try {
    const result = await pool.query(
      "SELECT type, field, old_value, new_value FROM audits WHERE activity = $1 ORDER BY field",
      [id],
    );
    const audits = result.rows;
    return audits;
  } catch (error) {
    console.log("Query error: " + error);
  }
}
