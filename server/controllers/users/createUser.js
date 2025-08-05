import pool from "../../db/connection.js";
import bcrypt from "bcryptjs";

export default async function createUser(
  firstName,
  lastName,
  name,
  username,
  email,
  password
) {
  try {
    const hashPassword = async (plainPassword) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    }
    const userHashedPassword = await hashPassword(password);
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, name, username, email, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstName, lastName, name, username, email, userHashedPassword]
    );
    return newUser;
  } catch (error) {
    console.log("Query error: " + error);
    return { error }
  }
}
