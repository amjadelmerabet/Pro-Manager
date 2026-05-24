import getUserByUsername from "./getUserByUsername.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createNewAccessToken from "../tokens/createNewAccessToken.js";
import createRefreshToken from "../tokens/createRefreshToken.js";
import getRefreshTokenByUser from "../tokens/getRefreshTokenByUser.js";
import getValidRefreshTokenByUser from "../tokens/getValidRefreshTokenByUser.js";
import updateToken from "../tokens/updateToken.js";
import createSession from "../sessions/createSession.js";
import linkSessionWithToken from "../tokens/linkSessionWithToken.js";

dotenv.config();

const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export default async function loginUser(username, password) {
  const user = await getUserByUsername(username);
  if (user && user.length === 1) {
    const { user_id } = user[0];
    const validPassword = await isPasswordValid(password, user[0].password);
    if (username === user[0].username && validPassword) {
      // Short expiration time for testing purposes
      // accessToken = jwt.sign(user[0], process.env.JWT_SECRET, {
      //   expiresIn: "30s",
      // });
      const accessToken = jwt.sign(user[0], process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      const newAccessToken = await createNewAccessToken(
        accessToken,
        user_id,
        user_id,
      );
      const newSession = await createSession(username);
      const linkedToken = await linkSessionWithToken(
        newSession[0].session_id,
        newAccessToken[0].token_id,
      );
      if (linkedToken.error) {
        return { status: "fail", message: "Server error" };
      } else {
        const validRefreshToken = await getValidRefreshTokenByUser(user_id);
        let refreshToken = "";
        if (validRefreshToken.length === 0) {
          // Short expiration time for testing purposes only
          // refreshToken = jwt.sign(user[0], process.env.JWT_REFRESH, {
          //   expiresIn: "5m",
          // });
          refreshToken = jwt.sign(user[0], process.env.JWT_REFRESH, {
            expiresIn: "7d",
          });
          const refreshTokens = await getRefreshTokenByUser(user_id);
          if (refreshTokens.length !== 0) {
            const updatedRefreshToken = await updateToken(
              refreshTokens[0].token_id,
              refreshToken,
              user_id,
              "refresh",
            );
          } else {
            const newRefreshToken = await createRefreshToken(
              refreshToken,
              user_id,
              user_id,
            );
          }
          return {
            status: "success",
            message: "User authenticated",
            token: accessToken,
            refresh: refreshToken,
            sessionId: newSession[0].session_id,
            session: newSession[0].id,
          };
        } else {
          return {
            status: "success",
            message: "User authenticated",
            token: accessToken,
            refresh: validRefreshToken[0].token,
            sessionId: newSession[0].session_id,
            session: newSession[0].id,
          };
        }
      }
    } else {
      return { status: "fail", message: "Invalid credentials" };
    }
  } else {
    return { status: "fail", message: "User doesn't exist" };
  }
}
