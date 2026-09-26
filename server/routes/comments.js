import { parse } from "url";
import canRead from "../authorization/canRead.js";
import getUserComments from "../controllers/comments/getUserComments.js";
import getProjectById from "../controllers/projects/getProjectById.js";
import getTaskById from "../controllers/tasks/getTaskById.js";
import canCreate from "../authorization/canCreate.js";
import createComment from "../controllers/comments/createComment.js";
import createAudit from "../controllers/audits/createAudit.js";

export async function commentsRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;
  if (req.user) {
    if (method === "GET") {
      if (url.match(/^\/api\/comments\/project\/.+/)) {
        const { readAllowed, readAllRecords } = await canRead(
          req.user.user_id,
          "comments",
        );
        const projectId = pathname.replace("/api/comments/project/", "");
        if (readAllowed) {
          if (readAllRecords) {
            const comments = await getUserComments("project", projectId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: comments }));
          } else {
            const project = await getProjectById(projectId);
            if (project[0].owner === req.user.user_id) {
              const comments = await getUserComments("project", projectId);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: comments }));
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
      } else if (url.match(/^\/api\/comments\/task\/.+/)) {
        const { readAllowed, readAllRecords } = await canRead(
          req.user.user_id,
          "comments",
        );
        const taskId = pathname.replace("/api/comments/task/", "");
        if (readAllowed) {
          if (readAllRecords) {
            const comments = await getUserComments("task", taskId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: comments }));
          } else {
            const task = await getTaskById(taskId);
            if (task[0].assigned_to === req.user.user_id) {
              const comments = await getUserComments("task", taskId);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: comments }));
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
      }
    } else if (method === "POST") {
      if (url === "/api/comments/task/new") {
        const { createAllowed, createAllRecords } = await canCreate(
          req.user.user_id,
          "comments",
        );
        if (createAllowed) {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            const newCommetFields = JSON.parse(body);
            if (Object.keys(newCommetFields).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const { comment, recordId, record, type, assigned_to } =
                newCommetFields;
              if (!comment || !recordId || !record || !type || !assigned_to) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Necessary comment data is missing",
                  }),
                );
              } else {
                let allowedToCreate = false;
                if (createAllRecords) {
                  allowedToCreate = true;
                } else {
                  if (assigned_to === req.user.user_id) {
                    allowedToCreate = true;
                  }
                }
                if (allowedToCreate) {
                  const newComment = await createComment(
                    type,
                    req.user.user_id,
                    record,
                    recordId,
                    comment,
                  );
                  if (newComment.error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "There was an error while creating a new comment",
                      }),
                    );
                  } else {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    const newAudit = await createAudit(
                      "insert",
                      "",
                      newComment?.rows[0].comment_id,
                      req.user.user_id,
                      record,
                      recordId,
                      "",
                      comment,
                    );
                    res.end(
                      JSON.stringify({
                        message: "Comment posted successfully",
                      }),
                    );
                  }
                } else {
                  res.writeHead(403, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message:
                        "User not authorized to post comments for other users tasks",
                    }),
                  );
                }
              }
            }
          });
        } else {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User not authorized to post comments",
            }),
          );
        }
      } else if ("/api/comments/project/new") {
        const { createAllowed, createAllRecords } = await canCreate(
          req.user.user_id,
          "comments",
        );
        if (createAllowed) {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            const newCommetFields = JSON.parse(body);
            if (Object.keys(newCommetFields).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const { comment, recordId, record, type, owner } =
                newCommetFields;
              if (!comment || !recordId || !record || !type || !owner) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Necessary comment data is missing",
                  }),
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
                  const newComment = await createComment(
                    type,
                    req.user.user_id,
                    record,
                    recordId,
                    comment,
                  );
                  if (newComment.error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "There was an error while creating a new comment",
                      }),
                    );
                  } else {
                    res.writeHead(201, { "Content-Type": "application/json" });
                    const newAudit = await createAudit(
                      "insert",
                      "",
                      newComment?.rows[0].comment_id,
                      req.user.user_id,
                      record,
                      recordId,
                      "",
                      comment,
                    );
                    res.end(
                      JSON.stringify({
                        message: "Comment posted successfully",
                      }),
                    );
                  }
                } else {
                  res.writeHead(403, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message:
                        "User not authorized to post comments for other users projects",
                    }),
                  );
                }
              }
            }
          });
        } else {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User not authorized to post comments",
            }),
          );
        }
      }
    }
  } else if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  } else {
    res.writeHead(401);
    res.end(JSON.stringify({ messsage: "User not authenticated" }));
  }
}
