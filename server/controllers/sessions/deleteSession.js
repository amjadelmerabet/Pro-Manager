import pool from "../../db/connection.js";

export default async function deleteSession(id) {
  try {
    const deletedSession = await pool.query(
      "DELETE FROM sessions WHERE session_id = $1",
      [id],
    );
    return deletedSession;
  } catch (error) {
    console.log("Query error: " + error);
    return { error: error };
  }
}
