import getProjectById from "../controllers/projects/getProjectById.js";
import getProjects from "../controllers/projects/getProjects.js";
import createProject from "../controllers/projects/createProject.js";
import updateProject from "../controllers/projects/updateProject.js";
import deleteProject from "../controllers/projects/deleteProject.js";
import getProjectsByOwner from "../controllers/projects/getProjectsByOwner.js";

import { parse } from "url";
import canRead from "../authorization/canRead.js";
import canCreate from "../authorization/canCreate.js";
import canEdit from "../authorization/canEdit.js";
import canDelete from "../authorization/canDelete.js";

export async function projectsRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      const { readAllowed, readAllRecords } = await canRead(
        req.user.user_id,
        "projects",
      );
      if (readAllowed) {
        if (url === "/api/projects") {
          res.writeHead(200, { "Content-Type": "application/json" });
          let projects = [];
          if (readAllRecords) {
            projects = await getProjects();
          } else {
            projects = await getProjectsByOwner(req.user.user_id);
          }
          res.end(JSON.stringify({ result: projects }));
        } else if (url.match(/^\/api\/projects\/id\/.+/)) {
          const projectId = pathname.replace("/api/projects/id/", "");
          const project = await getProjectById(projectId);
          let allowedToRead = false;
          let projectNotFound = false;
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            if (project.length > 0) {
              if (project[0].owner === req.user.user_id) {
                allowedToRead = true;
              }
            } else {
              projectNotFound = true;
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "No project was found with id: " + projectId,
                }),
              );
            }
          }
          if (allowedToRead) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: project }));
          } else if (!projectNotFound) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "User not authorized to access the requested data",
              }),
            );
          }
        } else if (url.match(/^\/api\/projects\/owner\/.+/)) {
          const projectOwner = pathname.replace("/api/projects/owner/", "");
          let allowedToRead = false;
          if (readAllRecords) {
            allowedToRead = true;
          } else {
            console.log(projectOwner);
            if (projectOwner === req.user.user_id) {
              allowedToRead = true;
            }
          }
          if (allowedToRead) {
            res.writeHead(200, { "Content-Type": "application/json" });
            const projects = await getProjectsByOwner(projectOwner);
            res.end(JSON.stringify({ result: projects }));
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
        "projects",
      );
      if (createAllowed) {
        if (url === "/api/projects/new") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            const newProjectFields = JSON.parse(body);
            if (Object.keys(newProjectFields).length === 0) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No data" }));
            } else {
              const { name, owner } = newProjectFields;
              if (!name || !owner) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "Necessary project data is missing",
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
                  res.writeHead(201, { "Content-Type": "application/json" });
                  const newProject = await createProject(newProjectFields);
                  if (newProject.error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "There was an error while creating a new project",
                      }),
                    );
                  }
                  const projectId = newProject.rows[0].project_id;
                  res.end(
                    JSON.stringify({
                      message: "Project created successfully",
                      project_id: projectId,
                    }),
                  );
                } else {
                  res.writeHead(403, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      message:
                        "User not authorized to create projects for other users",
                    }),
                  );
                }
              }
            }
          });
        }
      } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "User not authorized to create projects" }),
        );
      }
    } else if (method === "PATCH") {
      const { editAllowed, editAllRecords } = await canEdit(
        req.user.user_id,
        "projects",
      );
      if (editAllowed) {
        if (url.match(/^\/api\/projects\/update\/.+/)) {
          const projectId = pathname.replace("/api/projects/update/", "");
          const project = await getProjectById(projectId);
          if (project.length > 0) {
            let allowedToEdit = false;
            if (editAllRecords) {
              allowedToEdit = true;
            } else {
              if (project[0].owner === req.user.user_id) {
                allowedToEdit = true;
              }
            }
            if (allowedToEdit) {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", async () => {
                if (body === "") {
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Nothing to update " }));
                } else {
                  const updates = JSON.parse(body);
                  if (Object.keys(updates).length === 0) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Nothing to update " }));
                  } else {
                    let invalidUpdate = false;
                    Object.keys(updates).forEach((key) => {
                      if (key === "project_id") {
                        res.writeHead(400, {
                          "Content-Type": "application/json",
                        });
                        res.end(
                          JSON.stringify({ message: "Update not allowed" }),
                        );
                        invalidUpdate = true;
                      }
                    });
                    if (!invalidUpdate) {
                      const updatedProject = await updateProject(
                        projectId,
                        updates,
                      );
                      if (!updatedProject.error) {
                        res.writeHead(200, {
                          "Content-Type": "application/json",
                        });
                        res.end(
                          JSON.stringify({
                            message: "Project updated successfully",
                          }),
                        );
                      } else {
                        if (updatedProject.errorMessage === "Bad Request") {
                          res.writeHead(400, {
                            "Content-Type": "application/json",
                          });
                        } else {
                          res.writeHead(500, {
                            "Content-Type": "applicaiton/json",
                          });
                        }
                        res.end(
                          JSON.stringify({
                            message: "There was an error updating the project",
                            error: updatedProject.error,
                          }),
                        );
                      }
                    }
                  }
                }
              });
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not authorized to edit this record",
                }),
              );
            }
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Project not found" }));
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
            message: "User not authorized to update this record",
          }),
        );
      }
    } else if (method === "DELETE") {
      const { deleteAllowed, deleteAllRecords } = await canDelete(
        req.user.user_id,
        "projects",
      );
      if (deleteAllowed) {
        if (url.match(/^\/api\/projects\/delete\/.+/)) {
          const projectId = pathname.replace("/api/projects/delete/", "");
          const project = await getProjectById(projectId);
          if (project.length > 0) {
            let allowToDelete = false;
            if (deleteAllRecords) {
              allowToDelete = true;
            } else {
              if (project[0].owner === req.user.user_id) {
                allowToDelete = true;
              }
            }
            if (allowToDelete) {
              const deletedProject = await deleteProject(projectId);
              if (!deletedProject.error) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "Project deleted successfully" }),
                );
              } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "There was an error deleting the project",
                    error: deletedProject.error,
                  }),
                );
              }
            } else {
              res.writeHead(403, { "Content-Type": "applicaiton/json" });
              res.end(
                JSON.stringify({
                  message: "User not authorized to delete this record",
                }),
              );
            }
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Project not found" }));
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
        res.writeHead(403, { "Content-Type": "applicaiton/json" });
        res.end(
          JSON.stringify({
            message: "User not authorized to delete this record",
          }),
        );
      }
    } else {
      res.writeHead(405);
      res.end(JSON.stringify({ messsage: "Method Not Allowed" }));
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
