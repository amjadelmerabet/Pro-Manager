import { describe, expect, it } from "vitest";
import getProjectsByOwnerAPI from "../../api/projects/getProjectsByOwnerAPI";
import authUserAPI from "../../api/users/authUserAPI";
import createProjectAPI from "../../api/projects/createProjectAPI";
import getProjectByIdAPI from "../../api/projects/getProjectByIdAPI";
import updateProjectByIdAPI from "../../api/projects/updateProjectByIdAPI";
import deleteProjectByIdAPI from "../../api/projects/deleteProjectByIdAPI";

describe("Projects APIs", async () => {
  const auth = await authUserAPI("test.user", "test1234");
  const accessToken = auth?.token;

  it("Get a projects by owner", async () => {
    const projects = await getProjectsByOwnerAPI("test.user", accessToken);
    expect(projects).toHaveProperty("result");
    expect(projects.result.length).toBeDefined();
  });

  let projectId = "";

  it("Create a new project", async () => {
    const payload = {
      name: "Integration Test",
      description: "Testing the create new project API",
      state: 1,
      deadline: new Date(),
      owner: "test.user",
    };
    const project = await createProjectAPI(payload, accessToken);
    projectId = project?.project_id;
    expect(project).toHaveProperty("message", "Project created successfully");
    expect(project).toHaveProperty("project_id");
  });

  it("Get a project by ID", async () => {
    const project = await getProjectByIdAPI(projectId, accessToken);
    expect(project).toHaveProperty("result");
    expect(project.result.length).toBe(1);
  });

  it("Update a project by ID", async () => {
    const updates = { name: "Integration Test Updated" };
    const project = await updateProjectByIdAPI(projectId, accessToken, updates);
    expect(project).toHaveProperty("message", "Project updated successfully");
  })

  it("Delete a project by ID", async () => {
    const project = await deleteProjectByIdAPI(projectId, accessToken);
    expect(project).toHaveProperty("message", "Project deleted successfully");
  })
});
