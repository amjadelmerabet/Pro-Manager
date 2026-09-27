import bcrypt from "bcryptjs";
import pool from "../../db/connection.js";
import getUserByUsername from "../users/getUserByUsername.js";

async function hashSession(plainSession) {
  const saltRounds = 10;
  const hashedSession = await bcrypt.hash(plainSession, saltRounds);
  return hashedSession;
}

export default async function createSession(username, sessionNumber) {
  try {
    const user = await getUserByUsername(username);
    if (user.error) {
      return user.error;
    } else {
      const hashedSession = await hashSession(
        username + "-" + user[0].user_id + "_" + sessionNumber,
      );
      let sessionExpiresIn = new Date();
      sessionExpiresIn.setHours(sessionExpiresIn.getHours() + 2);
      const result = await pool.query(
        "INSERT INTO sessions (id, number, session_for_user, expires) VALUES ($1, $2, $3, $4) RETURNING session_id, id",
        [hashedSession, sessionNumber, user[0].user_id, sessionExpiresIn],
      );
      const newSession = result.rows;
      return newSession;
    }
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
