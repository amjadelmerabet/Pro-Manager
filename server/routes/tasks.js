import getTasks from "../controllers/tasks/getTasks.js";
import createTask from "../controllers/tasks/createTask.js";
import getTaskById from "../controllers/tasks/getTaskById.js";
import updateTask from "../controllers/tasks/updateTask.js";
import deleteTask from "../controllers/tasks/deleteTask.js";

import { parse } from "url";
import getTasksByAssignedTo from "../controllers/tasks/getTasksByAssignedTo.js";
import getTasksByProject from "../controllers/tasks/getTasksByProject.js";
import canRead from "../authorization/canRead.js";
import getProjectById from "../controllers/projects/getProjectById.js";

export async function tasksRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      const { readAllowed, readAllRecords } = await canRead(
        req.user.user_id,
        "tasks",
      );
      if (readAllowed) {
        if (url === "/api/tasks") {
          res.writeHead(200, { "Content-Type": "application/json" });
          let tasks = [];
          if (readAllRecords) {
            tasks = await getTasks();
          } else {
            tasks = await getTasksByAssignedTo(req.user.user_id);
          }
          res.end(JSON.stringify({ result: tasks }));
        } else {
          if (url.match(/^\/api\/tasks\/id\/.+/)) {
            const taskId = url.replace("/api/tasks/id/", "");
            const task = await getTaskById(taskId);
            let allowedToRead = false;
            let taskNodeFound = false;
            if (readAllRecords) {
              allowedToRead = true;
            } else if (task.length > 0) {
              if (task[0].assigned_to === req.user.user_id) {
                allowedToRead = true;
              }
            } else {
              taskNodeFound = true;
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "No task was found with id: " + taskId,
                }),
              );
            }
            if (allowedToRead) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: task }));
            } else if (!taskNodeFound) {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not authorized to access the requested data",
                }),
              );
            }
          } else if (url.match(/^\/api\/tasks\/assigned-to\/.+/)) {
            const assignedTo = pathname.replace("/api/tasks/assigned-to/", "");
            let allowedToRead = false;
            if (readAllRecords) {
              allowedToRead = true;
            } else if (assignedTo === req.user.user_id) {
              allowedToRead = true;
            }
            if (allowedToRead) {
              res.writeHead(200, { "Content-Type": "application/json" });
              const tasks = await getTasksByAssignedTo(assignedTo);
              res.end(JSON.stringify({ result: tasks }));
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not authorized to access the requested data",
                }),
              );
            }
          } else if (url.match(/^\/api\/tasks\/project\/.+/)) {
            const project = pathname.replace("/api/tasks/project/", "");
            const projectData = await getProjectById(project);
            let allowedToRead = false;
            if (projectData.length > 0) {
              if (readAllRecords) {
                allowedToRead = true;
              } else {
                if (projectData[0].owner === req.user.user_id) {
                  allowedToRead = true;
                } else {
                  res.writeHead(403, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message:
                        "User not authorized to access the requested data",
                    }),
                  );
                }
              }
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "No project exist with id: " + project,
                }),
              );
            }
            if (allowedToRead) {
              res.writeHead(200, { "Content-Type": "application/json" });
              const tasks = await getTasksByProject(project);
              res.end(JSON.stringify({ result: tasks }));
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
      if (url === "/api/tasks/new") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          if (body === "") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No data" }));
          } else {
            const newTaskFields = JSON.parse(body);
            if (Object.keys(newTaskFields).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const { name, short_description, assigned_to } = newTaskFields;
              if (!name || !short_description || !assigned_to) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "Necessary data is missing" }),
                );
              } else {
                const newTask = await createTask(newTaskFields);
                if (newTask.error) {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message: "There was an error while creating a new task",
                    }),
                  );
                } else {
                  res.writeHead(201, { "Content-Type": "application/json" });
                  const taskId = newTask?.rows[0].task_id;
                  res.end(
                    JSON.stringify({
                      message: "Task created successfully",
                      task_id: taskId,
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
    } else if (method === "PATCH") {
      if (url.match(/^\/api\/tasks\/update\/.+/)) {
        const taskId = pathname.replace("/api/tasks/update/", "");
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          if (body === "") {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "No updates" }));
          } else {
            const updates = JSON.parse(body);
            if (Object.keys(updates).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No updates" }));
            } else {
              if (updates.task_id) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Update not allowed" }));
              } else {
                const updatedTask = await updateTask(taskId, updates);
                if (updatedTask.status === "success") {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Task updated successfully" }),
                  );
                } else if (updatedTask.message === "404 Task not found") {
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: updatedTask.message }));
                } else {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message: "There was an error while updating a task",
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
      if (url.match(/^\/api\/tasks\/delete\/.+/)) {
        const taskId = pathname.replace("/api/tasks/delete/", "");
        const deletedTask = await deleteTask(taskId);
        if (deletedTask.status === "success") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: deletedTask.message }));
        } else {
          if (deletedTask.message === "404 Task not found") {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: deletedTask.message }));
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "There was an error while deleting a task",
              }),
            );
          }
        }
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
  } else if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  } else {
    res.writeHead(401);
    res.end(JSON.stringify({ messsage: "User not authenticated" }));
  }
}
