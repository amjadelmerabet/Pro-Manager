import pool from "../../db/connection.js";

export default async function getRefreshTokenByUser(username) {
  try {
    // const now = new Date();
    const result = await pool.query(
      "SELECT * FROM tokens WHERE granted_for = $1 AND type = $2",
      [username, 2]
    );
    var refreshTokens = result.rows;
    return refreshTokens;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
