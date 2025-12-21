import { describe, expect, it } from "vitest";
import authUserAPI from "../../api/users/authUserAPI";
import checkAccessTokenAPI from "../../api/tokens/checkAccessTokenAPI";
import getNewAccessTokenAPI from "../../api/tokens/getNewAccessTokenAPI";

describe("Tokens APIs", async () => {
  const auth = await authUserAPI(
    import.meta.env.VITE_TEST_USERNAME,
    import.meta.env.VITE_TEST_PASSWORD
  );
  const accessToken = auth.token;
  const refreshToken = {};
  refreshToken.value = auth.refresh;

  it("Checking a valid access token", async () => {
    const validAccessToken = await checkAccessTokenAPI(
      accessToken,
      refreshToken
    );
    expect(validAccessToken).toHaveProperty("message", "Valid access token");
  });

  it("Checking an invalid accessToken", async () => {
    const invalidAccessToken = await checkAccessTokenAPI(
      "Invalid access token",
      refreshToken
    );
    expect(invalidAccessToken).toHaveProperty(
      "message",
      "Invalid access token"
    );
  });

  it("Getting a new access token", async () => {
    const newAccessToken = await getNewAccessTokenAPI(
      import.meta.env.VITE_TEST_USER_ID,
      refreshToken
    );
    expect(newAccessToken).toHaveProperty("token");
  });
});
