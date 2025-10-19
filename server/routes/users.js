import getUsers from "../controllers/users/getUsers.js";
import getUserById from "../controllers/users/getUserById.js";
import getUserByUsername from "../controllers/users/getUserByUsername.js";
import authUser from "../controllers/users/authUser.js";
import createUser from "../controllers/users/createUser.js";
import updateUser from "../controllers/users/updateUser.js";
import deleteUser from "../controllers/users/deleteUser.js";

import { parse } from "url";

export async function usersRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      if (url === "/users") {
        res.writeHead(200, { "Content-Type": "application/json" });
        const users = await getUsers();
        res.end(JSON.stringify({ retult: users }));
      } else if (url.match(/^\/users\/id\/.+/)) {
        res.writeHead(200, { "Content-Type": "application/json b" });
        const userId = pathname.replace("/users/id/", "");
        const user = await getUserById(userId);
        res.end(JSON.stringify({ result: user }));
      } else if (url.match(/^\/users\/username\/.*/)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        const username = pathname.replace("/users/username/", "");
        const user = await getUserByUsername(username);
        res.end(JSON.stringify({ result: user }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The endpoint that you are trying to reach doesn't exist",
          }),
        );
      }
    } else if (method === "PATCH") {
      if (url.match(/^\/users\/update\/.+/)) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const username = url.replace("/users/update/", "");
          if (body === "") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No updates" }));
          } else {
            const updates = JSON.parse(body);
            if (updates.user_id) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Update not allowed" }));
            }
            const updatedUser = await updateUser(username, updates);
            if (updatedUser.status === "success") {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "User has been updated" }));
            } else {
              if (updatedUser.message === "No updates") {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: updatedUser.message }));
              } else {
                if (updatedUser.message === "404 User not found") {
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: updatedUser.message }));
                } else {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message: "There was an error while updating the user",
                    }),
                  );
                }
              }
            }
          }
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The endpoint that you are trying to reach doesn't exist",
          }),
        );
      }
    } else if (method === "DELETE") {
      if (url.match(/^\/users\/delete\/.+/)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        const username = pathname.replace("/users/delete/", "");
        const deletedUser = await deleteUser(username);
        console.log(deletedUser);
        res.end(JSON.stringify({ message: "User deleted successfully" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The endpoint that you are trying to reach doesn't exist",
          }),
        );
      }
    } else {
      res.writeHead(405);
      res.end(JSON.stringify({ messsage: "Method Not Allowed" }));
    }
  } else {
    if (method === "POST" && url === "/users/auth") {
      // console.log("A user is trying to login");
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const bodyObject = JSON.parse(body);
        if (bodyObject.username && bodyObject.password) {
          const auth = await authUser(bodyObject.username, bodyObject.password);
          if (auth.status === "success") {
            const user = await getUserByUsername(bodyObject.username);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                authenticated: true,
                message: auth.message,
                token: auth.token,
                refresh: auth.refresh,
                name: user[0].name,
              }),
            );
            // console.log("User successfully authenticated");
          } else if (auth.message === "User not authenticated") {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ authenticated: false, message: auth.message }),
            );
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ authenticated: false, message: auth.message }),
            );
            // console.log("User failed to authenticate or doesn't exist");
          }
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              authenticated: false,
              message: "Credentials are missing",
            }),
          );
        }
      });
    } else if (method === "POST" && url === "/users/new") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const bodyObject = JSON.parse(body);
        if (
          !bodyObject.first_name ||
          !bodyObject.last_name ||
          !bodyObject.name ||
          !bodyObject.username ||
          !bodyObject.email ||
          !bodyObject.password
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Necessary user data is missing" }),
          );
        } else {
          const {
            first_name,
            last_name,
            name,
            username,
            email,
            password,
            updated_by,
            created_by,
          } = bodyObject;
          const newUser = await createUser(
            first_name,
            last_name,
            name,
            username,
            email,
            password,
            updated_by,
            created_by,
          );
          if (newUser.error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            if (newUser.error.detail.match(/^Key(.*)=(.*) already exists./)) {
              if (newUser.error.detail.includes("username")) {
                res.end(
                  JSON.stringify({
                    error: "A user with the same username already exists.",
                  }),
                );
              } else if (newUser.error.detail.includes("email")) {
                res.end(
                  JSON.stringify({
                    error: "A user with the same email already exitts.",
                  }),
                );
              } else {
                res.end(JSON.stringify({ error: "Duplicate record detected" }));
              }
            } else {
              res.end(JSON.stringify({ error: newUser.error }));
            }
          } else {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User has been created",
              }),
            );
          }
        }
      });
    } else if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({ messsage: "User not authenticated" }));
    }
  }
}
