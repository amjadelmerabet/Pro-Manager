import { describe, expect, it } from "vitest";
import authUserAPI from "../../api/users/authUserAPI";
import createNewUserAPI from "../../api/users/createNewUserAPI";
import updateUserByUsernameAPI from "../../api/users/updateUserByUsernameAPI";
import deleteUserByUsernameAPI from "../../api/users/deleteUserByUsernameAPI";

describe("Users APIs", async () => {
  const auth = await authUserAPI(
    import.meta.env.VITE_TEST_USERNAME,
    import.meta.env.VITE_TEST_PASSWORD
  );
  const accessToken = auth?.token;

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

  describe("Update a user", () => {
    it("Update a user using an invalid token", async () => {
      const userUpdate = await updateUserByUsernameAPI(
        "new.user",
        {
          first_name: "NEW",
          last_name: "USER",
        },
        "invalid access token"
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
        accessToken
      );
      expect(userUpdate).toHaveProperty("message", "User has been updated");
    });
  });

  describe("Delete a user", () => {
    it("Delete a user using an invalid token", async () => {
      const userDelete = await deleteUserByUsernameAPI(
        "new.user",
        "invalid access token"
      );
      expect(userDelete).toHaveProperty("error", "Invalid access token");
    });
    it("Delete a user using a valid access token", async () => {
      const userDelete = await deleteUserByUsernameAPI("new.user", accessToken);
      expect(userDelete).toHaveProperty("message", "User deleted successfully");
    });
  });

  describe("Authenticate a user", () => {
    it("Case 1: Authenticate a user with a valid username and password", async () => {
      const auth = await authUserAPI(
        import.meta.env.VITE_TEST_USERNAME,
        import.meta.env.VITE_TEST_PASSWORD
      );
      expect(auth).toHaveProperty("authenticated", true);
      expect(auth).toHaveProperty("message", "User authenticated");
    });
    it("Case 2: Authenticate a user with a valid username but and an invalid password", async () => {
      const auth = await authUserAPI("admin", "test1234");
      expect(auth).toHaveProperty("authenticated", false);
      expect(auth).toHaveProperty("message", "User not authenticated");
    });
    it("Case 3: Authenticate a user with an invalid username and a password", async () => {
      const auth = await authUserAPI("Test.User", "test1234");
      expect(auth).toHaveProperty("authenticated", false);
      expect(auth).toHaveProperty("message", "User doesn't exist");
    });
  });
});
