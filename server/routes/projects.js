import getProjectById from "../controllers/projects/getProjectById.js";
import getProjects from "../controllers/projects/getProjects.js";
import createProject from "../controllers/projects/createProject.js";
import updateProject from "../controllers/projects/updateProject.js";
import deleteProject from "../controllers/projects/deleteProject.js";
import getProjectsByOwner from "../controllers/projects/getProjectsByOwner.js";

import { parse } from "url";

export async function projectsRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;

  if (req.user) {
    if (method === "GET") {
      if (url === "/projects") {
        res.writeHead(200, { "Content-Type": "application/json" });
        const projects = await getProjects();
        res.end(JSON.stringify({ result: projects }));
      } else if (url.match(/^\/projects\/id\/.+/)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        const projectId = pathname.replace("/projects/id/", "");
        const project = await getProjectById(projectId);
        res.end(JSON.stringify({ result: project }));
      } else if (url.match(/^\/projects\/owner\/.+/)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        const projectOwner = pathname.replace("/projects/owner/", "");
        const projects = await getProjectsByOwner(projectOwner);
        res.end(JSON.stringify({ result: projects }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The endpoint that you are trying to reach doesn't exist",
          })
        );
      }
    } else if (method === "POST") {
      if (url === "/projects/new") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const newProjectFields = JSON.parse(body);
          const { name, owner } = newProjectFields;
          if (!name || !owner) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Necessary project data is missing" })
            );
          } else {
            res.writeHead(201, { "Content-Type": "application/json" });
            const newProject = await createProject(newProjectFields);
            res.end(
              JSON.stringify({ message: "Project created successfully" })
            );
          }
        });
      }
    } else if (method === "PATCH") {
      if (url.match(/^\/projects\/update\/.+/)) {
        const projectId = pathname.replace("/projects/update/", "");
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
                  res.writeHead(400, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Update not allowed" }));
                  invalidUpdate = true;
                }
              });
              if (!invalidUpdate) {
                const updatedProject = await updateProject(projectId, updates);
                if (updatedProject.status === "success") {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({ message: "Project updated successfully" })
                  );
                } else {
                  if (updatedProject.message === "404 Project not found") {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message: "There is no project with the id " + projectId,
                      })
                    );
                  } else {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        message:
                          "There was an error updating the project with the id " +
                          projectId,
                      })
                    );
                  }
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
          })
        );
      }
    } else if (method === "DELETE") {
      if (url.match(/^\/projects\/delete\/.+/)) {
        const projectId = pathname.replace("/projects/delete/", "");
        const deletedProject = await deleteProject(projectId);
        if (deletedProject.status === "success") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: deletedProject.message }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "There was an error deleting the project with the id " +
                projectId,
            })
          );
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "The endpoint that you are trying to reach doesn't exist",
          })
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
