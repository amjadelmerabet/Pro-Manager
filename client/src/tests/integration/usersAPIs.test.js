import { describe, expect, it } from "vitest";
import authUserAPI from "../../api/users/authUserAPI";

describe("Users APIs", () => {
  describe("Authenticate a user", () => {
    it("Case 1: Authenticate a user with a valid username and password", async () => {
      const auth = await authUserAPI("test.user", "test1234");
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
