import bcrypt from "bcryptjs";
import createAccessToken from "../controllers/tokens/createAccessToken.js";
import getAccessTokenByUser from "../controllers/tokens/getAccessTokenByUser.js";
import getRefreshTokenByUser from "../controllers/tokens/getRefreshTokenByUser.js";
import getUserByUsername from "../controllers/users/getUserByUsername.js";
import checkAccessToken from "../controllers/tokens/checkAccessToken.js";
import getValidRefreshTokenByUser from "../controllers/tokens/getValidRefreshTokenByUser.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { parse } from "url";
import updateToken from "../controllers/tokens/updateToken.js";

dotenv.config();

const isTokenValid = async (plainToken, hashedToken) => {
  return await bcrypt.compare(plainToken, hashedToken);
};

export async function tokensRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      if (url.match(/^\/tokens\/access\/.+/)) {
        const username = pathname.replace("/tokens/access/", "");
        const accessTokens = await getAccessTokenByUser(username);
        if (accessTokens.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ result: accessTokens }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ result: accessTokens }));
        }
      } else if (url.match(/^\/tokens\/refresh\/.+/)) {
        const username = pathname.replace("/tokens/refresh/", "");
        const refreshTokens = await getRefreshTokenByUser(username);
        if (refreshTokens.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ result: refreshTokens }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ result: refreshTokens }));
        }
      }
    } else if (method === "POST") {
      // console.log("Requesting a new access token");
      if (url === "/tokens/access/new") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        req.on("end", async () => {
          const bodyObject = JSON.parse(body);
          const { username } = bodyObject;
          const user = await getUserByUsername(username);
          if (user.length > 0) {
            const refreshTokens = await getValidRefreshTokenByUser(username);
            if (refreshTokens.length > 0) {
              if (isTokenValid(token, refreshTokens[0].token)) {
                try {
                  const decoded = jwt.verify(token, process.env.JWT_REFRESH);
                  // For testing purposes only
                  // const accessToken = jwt.sign(
                  //   user[0],
                  //   process.env.JWT_SECRET,
                  //   {
                  //     expiresIn: "30s",
                  //   }
                  // );
                  const accessToken = jwt.sign(
                    user[0],
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "15m",
                    }
                  );
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
                  res.writeHead(201, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ token: accessToken }));
                } catch (error) {
                  console.log(error);
                  res.writeHead(401, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Invalid refresh account token" })
                  );
                }
              } else {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message:
                      "The user doesn't have permission to get an access token",
                  })
                );
              }
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No valid refresh found" }));
            }
          } else {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Unauthorized user" }));
          }
        });
      } else if (url === "/tokens/access/check") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          const bodyObject = JSON.parse(body);
          const { token } = bodyObject;
          const isAccessTokenValid = await checkAccessToken(token);
          if (isAccessTokenValid) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Valid access token" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid access token" }));
          }
        });
      }
    }
  } else {
    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({ messsage: "User not authenticated" }));
    }
  }
}
