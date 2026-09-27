import pool from "../../db/connection.js";

export default async function getSessionsCount(user) {
  try {
    const response = await pool.query(
      "SELECT number FROM sessions WHERE session_for_user = $1 ORDER BY number DESC LIMIT 1",
      [user],
    );
    const sessionsCount = response.rows;
    return sessionsCount;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
