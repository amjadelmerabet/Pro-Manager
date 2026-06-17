import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import updateTaskByIdAPI from "../../../../api/tasks/updateTaskByIdAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "link-tasks-to-project",
  });
}

async function linkTasksToProjectAction(
  tasks,
  project,
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tasksLinkedToProject,
  setTasksLinkedToProject,
  setLinkTasksToProject,
  tasksToLink,
  setTasksToLink,
) {
  await Promise.all(
    tasks.map(async (task) => {
      const update = await updateTaskByIdAPI(task, token, {
        project: project,
        updated_by: userId,
      });
      if (update.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        setTasksToLink(tasksToLink.filter((taskId) => taskId !== task));
      }
    }),
  );
  setLinkTasksToProject(false);
  setTasksLinkedToProject(tasksLinkedToProject + 1);
}

export default async function linkTasksToProjectUtil(
  tasks,
  project,
  user,
  userId,
  token,
  session,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  tasksLinkedToProject,
  setTasksLinkedToProject,
  setLinkTasksToProject,
  tasksToLink,
  setTasksToLink,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const checkAccessToken = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (checkAccessToken.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        linkTasksToProjectAction(
          tasks,
          project,
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          tasksLinkedToProject,
          setTasksLinkedToProject,
          setLinkTasksToProject,
          tasksToLink,
          setTasksToLink,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    linkTasksToProjectAction(
      tasks,
      project,
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      tasksLinkedToProject,
      setTasksLinkedToProject,
      setLinkTasksToProject,
      tasksToLink,
      setTasksToLink,
    );
  }
}
