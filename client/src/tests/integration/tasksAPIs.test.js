import { describe, expect, it } from "vitest";
import authUserAPI from "../../api/users/authUserAPI";
import getTasksByAssignedToAPI from "../../api/tasks/getTasksByAssignedToAPI";
import createTaskAPI from "../../api/tasks/createTaskAPI";
import getTaskByIdAPI from "../../api/tasks/getTaskByIdAPI";
import updateTaskByIdAPI from "../../api/tasks/updateTaskByIdAPI";
import deleteTaskByIdAPI from "../../api/tasks/deleteTaskByIdAPI";

describe("Tasks APIs", async () => {
  const auth = await authUserAPI("test.user", "test1234");
  const accessToken = auth?.token;

  it("Get a tasks by assigned to", async () => {
    const tasks = await getTasksByAssignedToAPI("test.user", accessToken);
    expect(tasks).toHaveProperty("result");
    expect(tasks.result.length).toBeDefined();
  });

  let taskId = "";

  it("Create a new task", async () => {
    const payload = {
      name: "Integration Test",
      short_description: "This is just a an integration test",
      description: "Testing the create new task API",
      assigned_to: "test.user",
      state: 1,
      priority: 2
    }
    const task = await createTaskAPI(payload, accessToken);
    taskId = task.task_id;
    expect(task).toHaveProperty("message", "Task created successfully");
    expect(task).toHaveProperty("task_id");
  })

  it("Get a task by ID", async () => {
    const task = await getTaskByIdAPI(taskId, accessToken);
    expect(task).toHaveProperty("result");
    expect(task.result.length).toBe(1);
  });

  it("Update a task by ID", async () => {
    const updates = { name: "Integration Test Updated" };
    const task = await updateTaskByIdAPI(taskId, accessToken, updates);
    expect(task).toHaveProperty("message", "Task updated successfully");
  })

  it("Delete a task by ID", async () => {
    const task = await deleteTaskByIdAPI(taskId, accessToken);
    expect(task).toHaveProperty("message", "Task deleted successfully");
  })
})