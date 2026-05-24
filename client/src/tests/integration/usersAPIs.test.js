import { describe, expect, it } from "vitest";
import loginUserAPI from "../../api/users/loginUserAPI";
import createNewUserAPI from "../../api/users/createNewUserAPI";
import updateUserByUsernameAPI from "../../api/users/updateUserByUsernameAPI";
import deleteUserByUsernameAPI from "../../api/users/deleteUserByUsernameAPI";
import logoutUserAPI from "../../api/users/logoutUserAPI";

describe("Users APIs", async () => {
  let accessToken, session;

  it("Create a new user", async () => {
    const newUser = await createNewUserAPI({
      username: "new.user",
      first_name: "New",
      last_name: "User",
      name: "New User",
      email: "new.user@promanager.com",
      password: "newUser1234",
      updated_by: import.meta.env.VITE_SYSTEM_USER_ID,
      created_by: import.meta.env.VITE_SYSTEM_USER_ID,
    });
    expect(newUser).toHaveProperty("message", "User has been created");
  });

  it("Login a user", async () => {
    const auth = await loginUserAPI("new.user", "newUser1234");
    accessToken = auth?.token;
    session = auth?.sessionId;
    expect(auth).toHaveProperty("authenticated", true);
    expect(auth).toHaveProperty("message", "User authenticated");
  });

  describe("Update a user", () => {
    it("Update a user using an invalid token", async () => {
      const userUpdate = await updateUserByUsernameAPI(
        "new.user",
        {
          first_name: "NEW",
          last_name: "USER",
        },
        "invalid access token",
      );
      expect(userUpdate).toHaveProperty("error", "Invalid access token");
    });
    it("Update a user using a valid access token", async () => {
      const userUpdate = await updateUserByUsernameAPI(
        "new.user",
        {
          first_name: "NEW",
          last_name: "USER",
        },
        accessToken,
      );
      expect(userUpdate).toHaveProperty("message", "User has been updated");
    });
  });

  it("Logging out a user", async () => {
    const userLoggedOut = await logoutUserAPI(session, accessToken);
    expect(userLoggedOut).toHaveProperty(
      "message",
      "User logged out successfully",
    );
  });

  describe("Delete a user", () => {
    it("Delete a user using an invalid token", async () => {
      const userDelete = await deleteUserByUsernameAPI(
        "new.user",
        "invalid access token",
      );
      expect(userDelete).toHaveProperty("error", "Invalid access token");
    });
    it("Delete a user using a valid access token", async () => {
      const userDelete = await deleteUserByUsernameAPI("new.user", accessToken);
      expect(userDelete).toHaveProperty("message", "User deleted successfully");
    });
  });

  describe("User authentication", () => {
    it("Case 1: Login a user with a valid username and password", async () => {
      const auth = await loginUserAPI(
        import.meta.env.VITE_TEST_USERNAME,
        import.meta.env.VITE_TEST_PASSWORD,
      );
      accessToken = auth?.token;
      session = auth?.sessionId;
      expect(auth).toHaveProperty("authenticated", true);
      expect(auth).toHaveProperty("message", "User authenticated");
    });
    it("Case 2: Login a user with a valid username but and an invalid password", async () => {
      const auth = await loginUserAPI("admin", "test1234");
      expect(auth).toHaveProperty("authenticated", false);
      expect(auth).toHaveProperty("message", "Invalid credentials");
    });
    it("Case 3: Login a user with an invalid username and a password", async () => {
      const auth = await loginUserAPI("Test.User", "test1234");
      expect(auth).toHaveProperty("authenticated", false);
      expect(auth).toHaveProperty("message", "User doesn't exist");
    });
    it("Case 4: Logging out a user", async () => {
      const loggedOutUser = await logoutUserAPI(session, accessToken);
      expect(loggedOutUser).toHaveProperty(
        "message",
        "User logged out successfully",
      );
    });
  });
});
