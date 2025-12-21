import pool from "../../db/connection.js";

export default async function updateToken(tokenId, token, userId, type) {
  try {
    const now = new Date();
    let expiresIn = new Date();
    if (type === "access") {
      expiresIn.setMinutes(now.getMinutes() + 15);
    } else if (type === "refresh") {
      expiresIn.setHours(now.getHours() + 24 * 7);
    }
    // For testing purposes only
    // expiresIn.setSeconds(now.getSeconds() + 120);
    const updatedAccessToken = await pool.query(
      "UPDATE tokens SET token = $1, expires = $2, updated_on = $3, updated_by = $4 WHERE token_id = $5",
      [token, expiresIn, now, userId, tokenId]
    );
    return updatedAccessToken;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
