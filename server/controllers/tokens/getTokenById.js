import pool from "../../db/connection.js";

export default async function getTokenById(tokenId) {
  try {
    const result = await pool.query(
      "SELECT * FROM tokens WHERE token_id = $1",
      [tokenId],
    );
    const token = result.rows;
    return token;
  } catch (error) {
    return { error };
  }
}
