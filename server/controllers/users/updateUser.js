import pool from "../../db/connection.js";
import getUserByUsername from "./getUserByUsername.js";

import bcrypt from "bcryptjs";

export default async function updateUser(username, updates) {
  const user = await getUserByUsername(username);
  const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  }
  try {
    if (user) {
      let userHashedPassword = "";
      if (updates) {
        if (Object.keys(updates).length === 0) {
          return { status: "fail", message: "No updates" }
        } else {
          if (updates.password) {
            userHashedPassword = await hashPassword(updates.password);
          }
          let query = "UPDATE users SET updated_on = $1, ";
          let count = 1;
          let now = new Date();
          let propertiesToUpdate = [now];
          Object.entries(updates).forEach(entry => {
            if (entry[0] === "password") {
              propertiesToUpdate.push(userHashedPassword);
            } else {
              propertiesToUpdate.push(entry[1]);
            }
            if (entry[0] === "first_name") {
              query += `first_name = $${count + 1}`;
            } else if (entry[0] === "last_name") {
              query += `last_name = $${count + 1}`;
            } else if (entry[0] === "name") {
              query += `name = $${count + 1}`;
            } else if (entry[0] === "email") {
              query += `email = $${count + 1}`;
            } else if (entry[0] === "password") {
              query += `password = $${count + 1}`;
            } else {
              return { status: "fail", message: "Column doesn't exist" };
            }
            if (count <= Object.keys(updates).length - 1) {
              query += ", ";
            }
            count++;
          });
          query += " WHERE username = '" + username + "'";
          const updateUser = await pool.query(query, propertiesToUpdate);
          return { status: "success" };
        }
      } else {
        return { status: "fail", message: "No updates" }
      }
    } else {
      return { status: "fail", message: "404 User not found" };
    }
  } catch (error) {
    console.log("Query erro: " + error);
  }
}
