import pool from "../../../db/connection.js";

export default async function getCreateAccessControlsByTable(table) {
  try {
    const result = await pool.query(
      "SELECT access_control_id, all_records FROM access_controls WHERE table_name = $1 AND action = 'create'",
      [table],
    );
    const accessControls = result.rows;
    return accessControls;
  } catch (error) {
    console.log("Query error: " + error);
  }
}
