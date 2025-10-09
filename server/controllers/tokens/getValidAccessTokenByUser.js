import pool from "../../db/connection.js";

export default async function getValidAccessTokenByUser(username) {
  try {
    const now = new Date();
    const validTime = new Date();
    validTime.setMinutes(now.getMinutes() + 1);
    const result = await pool.query(
      "SELECT token FROM tokens WHERE granted_for = $1 AND expires > $2 AND type = $3",
      [username, validTime, 1]
    );
    var accessTokens = result.rows;
    return accessTokens;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
