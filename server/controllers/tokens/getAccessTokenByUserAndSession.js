import pool from "../../db/connection.js";

export default async function getAccessTokenByUserAndSession(
  userId,
  sessionId,
) {
  try {
    // const now = new Date();
    const result = await pool.query(
      "SELECT * FROM tokens WHERE granted_for = $1 AND session = $2 AND type = $3",
      [userId, sessionId, 1],
    );
    var accessTokens = result.rows;
    return accessTokens;
  } catch (error) {
    console.log("Query error: " + error);
    return { error: error };
  }
}
