import pool from "../../db/connection.js";

export default async function deleteAccessToken(tokenId) {
  try {
    const deletedToken = await pool.query(
      "DELETE FROM tokens WHERE token_id = $1",
      [tokenId],
    );
    return deletedToken;
  } catch (error) {
    return { error };
  }
}
