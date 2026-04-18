import pool from "../../db/connection.js";

export default async function createSession(session, user) {
  try {
    let sessionExpiresIn = new Date();
    sessionExpiresIn.setHours(sessionExpiresIn.getHours() + 2);
    const newSession = await pool.query(
      "INSERT INTO sessions (id, session_for_user, expires) VALUES ($1, $2, $3) RETURNING session_id",
      [session, user, sessionExpiresIn],
    );
    return newSession;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
