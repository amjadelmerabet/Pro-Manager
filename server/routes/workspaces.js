import getWorkspaces from "../controllers/workspaces/getWorkspaces.js";
import getWorkspacesByOwner from "../controllers/workspaces/getWorkspacesByOwner.js";

import { parse } from "url";
import canRead from "../authorization/canRead.js";
import canCreate from "../authorization/canCreate.js";
import createWorkspace from "../controllers/workspaces/createWorkspace.js";
import canEdit from "../authorization/canEdit.js";
import getWorkspaceById from "../controllers/workspaces/getWorkspaceById.js";
import updateWorkspace from "../controllers/workspaces/updateWorkspace.js";
import getActiveWorkspace from "../controllers/workspaces/getActiveWorkspace.js";

export async function workspacesRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      const { readAllowed, readAllRecords } = await canRead(
        req.user.user_id,
        "workspaces",
      );
      if (readAllowed) {
        if (url === "/api/workspaces") {
          res.writeHead(200, { "Content-Type": "application/json" });
          let workspaces = [];
          if (readAllRecords) {
            workspaces = await getWorkspaces();
          } else {
            workspaces = await getWorkspacesByOwner(req.user.user_id);
          }
          res.end(JSON.stringify({ result: workspaces }));
        } else if (url.match(/\/api\/workspaces\/owner\/.+/)) {
          const owner = url.replace("/api/workspaces/owner/", "");
          let workspaces = [];
          let allowToRead = false;
          if (readAllRecords) {
            allowToRead = true;
          } else {
            if (owner === req.user.user_id) {
              allowToRead = true;
            }
          }
          if (allowToRead) {
            res.writeHead(200, { "Content-Type": "application/json" });
            workspaces = await getWorkspacesByOwner(owner);
            res.end(JSON.stringify({ result: workspaces }));
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not authorized to access the requested data",
              }),
            );
          }
        } else if (url.match(/\/api\/workspaces\/active\/.+/)) {
          const owner = url.replace("/api/workspaces/active/", "");
          let allowedToRead = false;
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            if (owner === req.user.user_id) {
              allowedToRead = true;
            }
          }
          if (allowedToRead) {
            const activeWorkspace = await getActiveWorkspace(owner);
            if (activeWorkspace.length === 1) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: activeWorkspace }));
            } else {
              if (activeWorkspace.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    result: activeWorkspace,
                    message: "No active workspace found",
                  }),
                );
              } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Unexpected error" }));
              }
            }
          }
        } else if (url.match(/\/api\/workspaces\/id\/.+/)) {
          const workspaceId = url.replace("/api/workspaces/id/", "");
          let allowedToRead = false;
          const workspace = await getWorkspaceById(workspaceId);
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            if (workspace[0].owner === req.user.user_id) {
              allowedToRead = true;
            }
          }
          if (allowedToRead) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: workspace }));
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User is not allowed to access the requested data",
              }),
            );
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "The endpoint that you are trying to reach doesn't exist",
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
    } else if (method === "POST") {
      const { createAllowed, createAllRecords } = await canCreate(
        req.user.user_id,
        "workspaces",
      );
      if (createAllowed) {
        if (url === "/api/workspaces/new") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            const newWorkspacFields = JSON.parse(body);
            if (Object.keys(newWorkspacFields).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const { name, owner, description } = newWorkspacFields;
              if (!name || !owner) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "Necessary data is missing" }),
                );
              } else {
                let allowedToCreate = false;
                if (createAllRecords) {
                  allowedToCreate = true;
                } else {
                  if (owner === req.user.user_id) {
                    allowedToCreate = true;
                  }
                }
                if (allowedToCreate) {
                  const newWorkspace = await createWorkspace(
                    name,
                    owner,
                    description,
                    req.user.user_id,
                    req.user.user_id,
                  );
                  if (newWorkspace.error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "There was an error while creating a workspace",
                      }),
                    );
                  } else {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message: "Workspace created successfully",
                        workspace_id: newWorkspace[0].workspace_id,
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
            message: "User not authorized to create workspaces",
          }),
        );
      }
    } else if (method === "PATCH") {
      const { editAllowed, editAllRecords } = await canEdit(
        req.user.user_id,
        "workspaces",
      );
      if (editAllowed) {
        if (url.match(/\/api\/workspaces\/update\/.+/)) {
          const workspaceId = url.replace("/api/workspaces/update/", "");
          const workspace = await getWorkspaceById(workspaceId);
          let allowedToEdit = false;
          if (editAllRecords) {
            allowedToEdit = true;
          } else if (req.user.user_id === workspace[0].owner) {
            allowedToEdit = true;
          }
          if (allowedToEdit) {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", async () => {
              if (body === "") {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Nothing to update" }));
              } else {
                const updates = JSON.parse(body);
                if (Object.keys(updates).length === 0) {
                  res.writeHead(400, {
                    "Content-Type": "application/json",
                  });
                  res.end(JSON.stringify({ message: "Nothing to update" }));
                } else {
                  let invalidUpdate = false;
                  Object.keys(updates).forEach((key) => {
                    if (key === "workspace_id") {
                      invalidUpdate = true;
                    }
                  });
                  if (!invalidUpdate) {
                    const updatedWorkspace = await updateWorkspace(
                      workspaceId,
                      updates,
                      req.user.user_id,
                    );
                    if (updatedWorkspace.error) {
                      res.writeHead(400, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({
                          message:
                            "There was an error while updating a workspace",
                          error: updatedWorkspace.error,
                        }),
                      );
                    } else {
                      res.writeHead(200, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({
                          message: "Workspace updated successfully",
                        }),
                      );
                    }
                  } else {
                    res.writeHead(400, {
                      "Content-Type": "application/json",
                    });
                    res.end(JSON.stringify({ message: "Update not allowed" }));
                  }
                }
              }
            });
          } else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User is not allowed to update this workspace",
              }),
            );
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "The endpoint that you are trying to reach doesn't exist",
            }),
          );
        }
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "User not authorized to update workspaces",
          }),
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
