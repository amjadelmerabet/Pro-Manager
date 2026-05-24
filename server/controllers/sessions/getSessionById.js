import pool from "../../db/connection.js";

export default async function getSessionById(sessionId) {
  try {
    const result = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId],
    );
    const session = result.rows;
    return session;
  } catch (error) {
    return { error };
  }
}
