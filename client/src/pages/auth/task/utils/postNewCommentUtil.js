import postTaskCommentAPI from "../../../../api/comments/postTaskCommentAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "post-user-comment",
  });
}

async function postNewCommentAction(
  comment,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setPostComment,
  setNewCommentPosted,
) {
  const newComment = await postTaskCommentAPI(comment, token);
  if (newComment.error === "Invalid access token" && tries < 3) {
    setPostComment(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setPostComment(false);
    setNewCommentPosted(true);
  }
}

export default async function postNewCommentUtil(
  comment,
  user,
  session,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setPostComment,
  setNewCommentPosted,
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
        postNewCommentAction(
          comment,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setPostComment,
          setNewCommentPosted,
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
    postNewCommentAction(
      comment,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setPostComment,
      setNewCommentPosted,
    );
  }
}
