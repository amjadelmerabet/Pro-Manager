import pool from "../../db/connection.js";

export default async function updateToken(tokenId, token, username) {
  try {
    const now = new Date();
    let expiresIn = new Date();
    expiresIn.setMinutes(now.getMinutes() + 15);
    // For testing purposes only
    // expiresIn.setSeconds(now.getSeconds() + 30);
    const updatedAccessToken = await pool.query(
      "UPDATE tokens SET token = $1, expires = $2, updated_on = $3, updated_by = $4 WHERE token_id = $5",
      [token, expiresIn, now, username, tokenId],
    );
    return updatedAccessToken;
  } catch (error) {
    console.log("Query error: " + error);
    return JSON.stringify({ error: error });
  }
}
