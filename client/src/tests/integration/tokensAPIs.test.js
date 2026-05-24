import { describe, expect, it } from "vitest";
import loginUserAPI from "../../api/users/loginUserAPI";
import checkAccessTokenAPI from "../../api/tokens/checkAccessTokenAPI";
import getNewAccessTokenAPI from "../../api/tokens/getNewAccessTokenAPI";
import logoutUserAPI from "../../api/users/logoutUserAPI";

describe("Tokens APIs", async () => {
  let accessToken, refreshToken = {}, session;
  it ("Login a user to generate a new token", async () => {
    const auth = await loginUserAPI(
      import.meta.env.VITE_TEST_USERNAME,
      import.meta.env.VITE_TEST_PASSWORD,
    );
    accessToken = auth.token;
    refreshToken.value = auth.refresh;
    session = auth.sessionId;
  })

  it("Checking a valid access token", async () => {
    const validAccessToken = await checkAccessTokenAPI(
      accessToken,
      session,
      refreshToken,
    );
    expect(validAccessToken).toHaveProperty("message", "Valid access token");
  });

  it("Checking an invalid accessToken", async () => {
    const invalidAccessToken = await checkAccessTokenAPI(
      "Invalid access token",
      session,
      refreshToken,
    );
    expect(invalidAccessToken).toHaveProperty(
      "message",
      "Invalid access token",
    );
  });

  it("Getting a new access token", async () => {
    const newAccessToken = await getNewAccessTokenAPI(
      import.meta.env.VITE_TEST_USER_ID,
      session,
      refreshToken,
    );
    expect(newAccessToken).toHaveProperty("token");
  });

  it("Logging out a user to delete access token", async () => {
    const loggedOutUser = await logoutUserAPI(session, accessToken);
    expect(loggedOutUser).toHaveProperty(
      "message",
      "User logged out successfully",
    );
  });
});
