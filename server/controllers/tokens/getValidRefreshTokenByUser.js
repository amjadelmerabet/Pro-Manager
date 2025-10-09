import pool from "../../db/connection.js";

export default async function getValidRefreshTokenByUser(username) {
  try {
    const now = new Date();
    const validTime = new Date();
    validTime.setMinutes(now.getMinutes() + 1); 
    const result = await pool.query(
      "SELECT token FROM tokens WHERE granted_for = $1 AND expires > $2 AND type = $3",
      [username, validTime, 2]
    );
    var refreshTokens = result.rows;
    return refreshTokens;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
