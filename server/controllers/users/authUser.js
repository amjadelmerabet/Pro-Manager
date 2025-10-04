import getUserByUsername from "./getUserByUsername.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createAccessToken from "../tokens/createAccessToken.js";
import createRefreshToken from "../tokens/createRefreshToken.js";
import getRefreshTokenByUser from "../tokens/getRefreshTokenByUser.js";
import getAccessTokenByUser from "../tokens/getAccessTokenByUser.js";
import getValidAccessTokenByUser from "../tokens/getValidAccessTokenByUser.js";
import getValidRefreshTokenByUser from "../tokens/getValidRefreshTokenByUser.js";
import updateToken from "../tokens/updateToken.js";

dotenv.config();

const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export default async function authUser(username, password) {
  const user = await getUserByUsername(username);
  if (user && user.length === 1) {
    const validPassword = await isPasswordValid(password, user[0].password);
    if (username === user[0].username && validPassword) {
      const validAccessToken = await getValidAccessTokenByUser(username);
      let accessToken = "";
      if (validAccessToken.length === 0) {
        // Short expiration time for testing purposes
        // accessToken = jwt.sign(user[0], process.env.JWT_SECRET, {
        //   expiresIn: "30s",
        // });
        accessToken = jwt.sign(user[0], process.env.JWT_SECRET, {
          expiresIn: "15m",
        });
        const accessTokens = await getAccessTokenByUser(username);
        if (accessTokens.length !== 0) {
          const updatedAccessToken = await updateToken(
            accessTokens[0].token_id,
            accessToken,
            username
          );
        } else {
          const newAccessToken = await createAccessToken(
            accessToken,
            username,
            username
          );
        }
      } else {
        accessToken = validAccessToken[0].token;
      }
      const validRefreshToken = await getValidRefreshTokenByUser(username);
      let refreshToken = "";
      if (validRefreshToken.length === 0) {
        refreshToken = jwt.sign(user[0], process.env.JWT_REFRESH, {
          expiresIn: "7d",
        });
        const refreshTokens = await getRefreshTokenByUser(username);
        if (refreshTokens.length !== 0) {
          const updatedRefreshToken = await updateToken(
            refreshTokens[0].token_id,
            refreshToken,
            username
          );
        } else {
          const newRefreshToken = await createRefreshToken(
            refreshToken,
            username,
            username
          );
        }
        return {
          status: "success",
          message: "User authenticated",
          token: accessToken,
          refresh: refreshToken,
        };
      } else {
        return {
          status: "success",
          message: "User authenticated",
          token: accessToken,
          refresh: validRefreshToken[0].token,
        };
      }
    } else {
      return { status: "fail", message: "User not authenticated" };
    }
  } else {
    return { status: "fail", message: "User doesn't exist" };
  }
}
