import getUserCommentsAPI from "../../../api/comments/getUserCommentsAPI";
import checkAccessTokenAPI from "../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "fetch-user-comments",
  });
}

async function fetchUserCommentsAction(
  record,
  recordId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserComments,
  setUserCommentsFetched,
) {
  const comments = await getUserCommentsAPI(record, recordId, token);
  if (comments.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUserComments({ loaded: true, comments: comments.result });
    setUserCommentsFetched(true);
    setTimeout(() => {
      setUserCommentsFetched(false);
    }, 250);
  }
}

export default async function fetchUserCommentsUtil(
  record,
  recordId,
  user,
  session,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setUserComments,
  setUserCommentsFetched,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (validAccessToken.message === "Valid access token") {
        fetchUserCommentsAction(
          record,
          recordId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setUserComments,
          setUserCommentsFetched,
        );
      } else {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchUserCommentsAction(
      record,
      recordId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserComments,
      setUserCommentsFetched,
    );
  }
}
