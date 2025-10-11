import pool from "../../db/connection.js";
import bcrypt from "bcryptjs";

function randomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function createRefreshToken(token, granted_by, granted_to) {
  try {
    const randomStr = randomString(10);
    const now = new Date();
    let expiresIn = new Date();
    expiresIn.setHours(now.getHours() + (7 * 24));
    // const hashToken = async (plainToken) => {
    //   const saltRounds = 10;
    //   const hashedToken = await bcrypt.hash(plainToken, saltRounds);
    //   return hashedToken;
    // }
    // const hashedToken = await hashToken(token);
    const refreshToken = await pool.query(
      "INSERT INTO tokens (name, token, granted_by, granted_for, created_on, created_by, updated_on, updated_by, expires, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        `token_${randomStr}`,
        token,
        granted_by,
        granted_to,
        now,
        granted_by,
        now,
        granted_by,
        expiresIn,
        2
      ]
    );
    return refreshToken
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
