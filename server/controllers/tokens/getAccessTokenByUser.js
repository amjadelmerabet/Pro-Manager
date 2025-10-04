import pool from "../../db/connection.js";

export default async function getAccessTokenByUser(username) {
  try {
    // const now = new Date();
    const result = await pool.query(
      "SELECT * FROM tokens WHERE granted_for = $1 AND type = $2",
      [username, 1]
    );
    var accessTokens = result.rows;
    return accessTokens;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
