import canCreate from "../authorization/canCreate.js";
import canRead from "../authorization/canRead.js";
import getUserRoles from "../controllers/userRoles/getUserRoles.js";
import getUserRolesByUser from "../controllers/userRoles/getUserRolesByUser.js";

import { parse } from "url";

export async function userRolesRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      const { readAllowed, readAllRecords } = await canRead(
        req.user.user_id,
        "user_roles",
      );
      if (readAllowed) {
        if (url === "/api/user_roles") {
          if (readAllRecords) {
            const userRoles = await getUserRoles();
            if (!userRoles.error) {
              res.writeHead(200, {
                "Content-Type": "application/json",
                "X-Total-Count": userRoles.length,
              });
              res.end(JSON.stringify({ result: userRoles }));
            } else {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Error occured while trying to retrieve the data",
                  error: userRoles.error,
                }),
              );
            }
          } else {
            const userRoles = await getUserRolesByUser(req.user.user_id);
            if (!userRoles) {
              res.writeHead(200, {
                "Content-Type": "application/json",
                "X-Total-Count": userRoles.length,
              });
              res.end(JSON.stringify({ result: userRoles }));
            } else {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Error occured while trying to retieve the data",
                  error: userRoles.error,
                }),
              );
            }
          }
        } else if (url.match(/^\/api\/user_roles\/.+/)) {
          const userId = pathname.replace("/api/user_roles/", "");
          let allowToRead = false;
          if (readAllRecords) {
            allowToRead = true;
          } else {
            if (userId === req.user.user_id) {
              allowToRead = true;
            }
          }
          if (allowToRead) {
            const userRoles = await getUserRolesByUser(userId);
            if (!userRoles.error) {
              res.writeHead(200, { "Content-Type": "application/json", "X-Total-Count": userRoles.length });
              res.end(JSON.stringify({ result: userRoles }));
            } else {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Error occured while retrieving the data",
                  error: userRoles.error,
                }),
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
        "user_roles",
      );
      if (createAllowed) {
        if (url === "/api/user_roles/new") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            if (body === "") {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const userRolesFields = JSON.parse(body);
              if (Object.keys(userRolesFields).length === 0) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "No data" }));
              } else {
                const { user, role } = userRolesFields;
                if (!user || !role) {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Necessary data is missing" }),
                  );
                } else {
                  let allowedToCreate = false;
                  if (createAllRecords) {
                    allowedToCreate = true;
                  } else {
                    if (user === req.user.user_id) {
                      allowedToCreate = true;
                    }
                  }
                  if (allowedToCreate) {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message: "User role created successfully",
                      }),
                    );
                  } else {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "User not authorized to insert the following record",
                      }),
                    );
                  }
                }
              }
            }
          });
        }
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "User not authorized to insert the following record",
          }),
        );
      }
    }
  }
}
