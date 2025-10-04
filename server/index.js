import { createServer } from "node:http";
import { usersRoute } from "./routes/users.js";
import { projectsRoute } from "./routes/projects.js";
import { tasksRoute } from "./routes/tasks.js";
import { tokensRoute } from "./routes/tokens.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer(async (req, res) => {
  const { url, method } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const authHeader = req.headers["authorization"];
  if (!authHeader && url !== "/users/auth" && method !== "OPTIONS") {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not authorized" }));
  } else {
    if (method !== "OPTIONS" && url !== "/users/auth") {
      const token = authHeader.split(" ")[1];
      try {
        if (url === "/tokens/access/new" || url === "/tokens/access/check") {
          // console.log("Requesting a new access token");
          try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH);
            req.user = decoded;
          } catch (error) {
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid refresh token" }));
          }
        } else {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
        }
      } catch (error) {
        // console.log(error);
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid access token" }));
      }
    }
    if (url.startsWith("/users")) {
      await usersRoute(req, res);
    } else if (url.startsWith("/projects")) {
      await projectsRoute(req, res);
    } else if (url.startsWith("/tasks")) {
      await tasksRoute(req, res);
    } else if (url.startsWith("/tokens")) {
      await tokensRoute(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "The endpoint that you are trying to reach doesn't exist",
        })
      );
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Listtening on ${hostname}:${port}`);
});
