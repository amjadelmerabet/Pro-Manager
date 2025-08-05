import { createServer } from "node:http";
import { usersRoute } from "./routes/users.js";
import { projectsRoute } from "./routes/projects.js";
import { tasksRoute } from "./routes/tasks.js";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer(async (req, res) => {
  const { url } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (url.startsWith("/users")) {
    await usersRoute(req, res);
  } else if (url.startsWith("/projects")) {
    await projectsRoute(req, res);
  } else if (url.startsWith("/tasks")) {
    await tasksRoute(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "The endpoint that you are trying to reach doesn't exist"}));
  }
});

server.listen(port, hostname, () => {
  console.log(`Listtening on ${hostname}:${port}`);
});