import pool from "../../db/connection.js";

export default async function linkSessionWithToken(sessionId, tokenId) {
  try {
    const updatedToken = await pool.query(
      "UPDATE tokens SET session = $1 WHERE token_id = $2",
      [sessionId, tokenId],
    );
    return updatedToken;
  } catch (error) {
    return { error };
  }
}
