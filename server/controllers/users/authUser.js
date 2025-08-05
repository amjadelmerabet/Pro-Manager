import getUserByUsername from "./getUserByUsername.js";

import bcrypt from "bcryptjs";

const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export default async function authUser(username, password) {
  const user = await getUserByUsername(username);
  if (user && user.length === 1) {
    const validPassword = await isPasswordValid(password, user[0].password);
    if (username === user[0].username && validPassword) {
      return { status: "success", message: "User authenticated" }
    } else {
      return { status: "fail", message: "User not authenticated" };
    }
  } else {
    return { status: "fail", message: "User doesn't exist" }
  }
}