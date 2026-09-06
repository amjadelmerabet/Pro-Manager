import getUserActivitiesAPI from "../../../api/activities/getUserActivitiesAPI";
import checkAccessTokenAPI from "../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken, record) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type:
      record === "task" ? "fetch-task-activities" : "fetch-project-activities",
  });
}

async function fetchUserActivitiesAction(
  record,
  recordId,
  user,
  session,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserActivities,
  setFetchUserActivities,
  setUserActivitiesFetched
) {
  const userActivities = await getUserActivitiesAPI(record, recordId, token);
  if (userActivities.error === "Invalid access token") {
    setFetchUserActivities(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken, record);
  } else {
    setTimeout(() => {
      setUserActivities(userActivities.result);
      setUserActivitiesFetched(true);
      setTimeout(() => {
        setUserActivitiesFetched(false);
      }, 500);
    }, 500);
  }
}

export default async function fetchUserActivitiesUtil(
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
  setUserActivities,
  setFetchUserActivities,
  setUserActivitiesFetched
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
        setTokenValidated(true);
        fetchUserActivitiesAction(
          record,
          recordId,
          user,
          session,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setUserActivities,
          setFetchUserActivities,
          setUserActivitiesFetched
        );
      } else {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken, record);
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchUserActivitiesAction(
      record,
      recordId,
      user,
      session,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserActivities,
      setFetchUserActivities,
      setUserActivitiesFetched
    );
  }
}
