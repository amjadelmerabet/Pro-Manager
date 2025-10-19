import pool from "../../db/connection.js";
import bcrypt from "bcryptjs";

export default async function createUser(
  firstName,
  lastName,
  name,
  username,
  email,
  password,
  updated_by,
  created_by,
) {
  try {
    const hashPassword = async (plainPassword) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    };
    const userHashedPassword = await hashPassword(password);
    let now = new Date();
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, name, username, email, password, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        firstName,
        lastName,
        name,
        username,
        email,
        userHashedPassword,
        now,
        updated_by,
        now,
        created_by,
      ],
    );
    return newUser;
  } catch (error) {
    console.log("Query error: " + error);
    return { error };
  }
}
