import pool from "../../db/connection.js";

export default async function checkAccessToken(token) {
  try {
    const accessToken = await pool.query(
      // For testing purpose only
      // "SELECT token FROM tokens WHERE token = $1 AND expires > NOW() + INTERVAL '15 seconds'",
      "SELECT token FROM tokens WHERE token = $1 AND expires > NOW() + INTERVAL '1 minute'",
      [token],
    );
    if (accessToken.rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Query error", error);
  }
}
