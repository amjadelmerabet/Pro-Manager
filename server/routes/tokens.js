import bcrypt from "bcryptjs";
import createAccessToken from "../controllers/tokens/createAccessToken.js";
import getAccessTokenByUser from "../controllers/tokens/getAccessTokenByUser.js";
import getRefreshTokenByUser from "../controllers/tokens/getRefreshTokenByUser.js";
import getUserById from "../controllers/users/getUserById.js";
import checkAccessToken from "../controllers/tokens/checkAccessToken.js";
import getValidRefreshTokenByUser from "../controllers/tokens/getValidRefreshTokenByUser.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { parse } from "url";
import updateToken from "../controllers/tokens/updateToken.js";
import canRead from "../authorization/canRead.js";
import canCreate from "../authorization/canCreate.js";

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
      const { readAllowed, readAllRecords } = await canRead(
        req.user.user_id,
        "tokens",
      );
      if (readAllowed) {
        if (url.match(/^\/api\/tokens\/access\/.+/)) {
          const userId = pathname.replace("/api/tokens/access/", "");
          let allowedToRead = false;
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            if (userId === req.user.user_id) {
              allowedToRead = true;
            }
          }
          if (allowedToRead) {
            const accessTokens = await getAccessTokenByUser(userId);
            if (accessTokens.length > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: accessTokens }));
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: accessTokens }));
            }
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not authorized to access the requested data",
              }),
            );
          }
        } else if (url.match(/^\/api\/tokens\/refresh\/.+/)) {
          const userId = pathname.replace("/api/tokens/refresh/", "");
          let allowedToRead = false;
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            if (userId === req.user.user_id) {
              allowedToRead = true;
            }
          }
          if (allowedToRead) {
            const refreshTokens = await getRefreshTokenByUser(userId);
            if (refreshTokens.length > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: refreshTokens }));
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: refreshTokens }));
            }
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not authorized to access the requested data"}));
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "The endpoint that you are trying to reach doesn't exist.",
            })
          );
        }
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "User not authorized to access the requested data",
          }),
        );
      }
    } else if (method === "POST") {
      const { createAllowed, createAllRecords } = await canCreate(
        req.user.user_id,
        "tokens",
      );
      if (createAllowed) {
        if (url === "/api/tokens/access/new") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          const authHeader = req.headers["authorization"];
          const token = authHeader.split(" ")[1];
          req.on("end", async () => {
            const bodyObject = JSON.parse(body);
            const { user_id } = bodyObject;
            let allowedToCreate = false;
            if (createAllRecords) {
              allowedToCreate = true;
            } else {
              if (user_id === req.user.user_id) {
                allowedToCreate = true;
              }
            }
            if (allowedToCreate) {
              const user = await getUserById(user_id);
              if (user.length > 0) {
                const refreshTokens = await getValidRefreshTokenByUser(user_id);
                if (refreshTokens.length > 0) {
                  if (isTokenValid(token, refreshTokens[0].token)) {
                    try {
                      const decoded = jwt.verify(
                        token,
                        process.env.JWT_REFRESH,
                      );
                      // For testing purposes only
                      // const accessToken = jwt.sign(
                      //   user[0],
                      //   process.env.JWT_SECRET,
                      //   {
                      //     expiresIn: "2m",
                      //   }
                      // );
                      const accessToken = jwt.sign(
                        user[0],
                        process.env.JWT_SECRET,
                        {
                          expiresIn: "15m",
                        },
                      );
                      const accessTokens = await getAccessTokenByUser(user_id);
                      if (accessTokens.length !== 0) {
                        const updatedAccessToken = await updateToken(
                          accessTokens[0].token_id,
                          accessToken,
                          user_id,
                          "access",
                        );
                      } else {
                        const newAccessToken = await createAccessToken(
                          accessToken,
                          user_id,
                          user_id,
                        );
                      }
                      res.writeHead(201, {
                        "Content-Type": "application/json",
                      });
                      res.end(JSON.stringify({ token: accessToken }));
                    } catch (error) {
                      console.log(error);
                      res.writeHead(401, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({
                          message: "Invalid refresh account token",
                        }),
                      );
                    }
                  } else {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "The user doesn't have permission to get an access token",
                      }),
                    );
                  }
                } else {
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "No valid refresh found" }),
                  );
                }
              } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User not found" }));
              }
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message:
                    "User not authorized generate tokens for other users",
                }),
              );
            }
          });
        } else if (url === "/api/tokens/access/check") {
          const { readAllowed, readAllRecords } = await canRead(
            req.user.user_id,
            "tokens",
          );
          if (readAllowed) {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", async () => {
              const bodyObject = JSON.parse(body);
              const { token } = bodyObject;
              let allowedToRead = false;
              if (readAllRecords) {
                allowedToRead = true;
              } else {
                const userToken = await getAccessTokenByUser(req.user.user_id);
                if (userToken.length > 0) {
                  if (token === userToken[0].token) {
                    allowedToRead = true;
                  }
                }
              }
              if (allowedToRead) {
                const isAccessTokenValid = await checkAccessToken(token);
                if (isAccessTokenValid) {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Valid access token" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Invalid access token" }));
                }
              } else {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "User not authorized to access the requested data",
                  }),
                );
              }
            });
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not authorized to access the requested data",
              }),
            );
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "The endpoint that you are trying to reach doesn't exist.",
            }),
          });
        }
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "User not authorized to generate tokens" }),
        );
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
