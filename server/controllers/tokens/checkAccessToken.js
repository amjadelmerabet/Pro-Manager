import pool from "../../db/connection.js";

export default async function checkAccessToken(token) {
  try {
    const accessToken = await pool.query(
      "SELECT token FROM tokens WHERE token = $1 AND expires > NOW() + INTERVAL '14 minutes'",
      [token]
    );
    if (accessToken.rows.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Query error", error);
  }
}
