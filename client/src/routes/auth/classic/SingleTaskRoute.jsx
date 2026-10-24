import { useLocation, useNavigate } from "react-router";
import Task from "../../../pages/auth/task/classic/Task";
import { useEffect, useState } from "react";
import WrongRoute from "../../public/WrongRoute";
import bcrypt from "bcryptjs";

export default function SingleTaskRoute({
  isAuthenticated,
  setAuthentication,
  setPreviewModernUI,
  newUser,
  checkingNewUserDone,
}) {
  const [session, setSession] = useState("");

  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));
  let userLoggedOut = JSON.parse(sessionStorage.getItem("userLoggedOut"));

  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");

  const index = slicedPathname.indexOf("/");

  const username = slicedPathname.slice(0, index);

  var taskId = slicedPathname
    .replace(`${userAuthenticated.user}/classic/workspace/`, "")
    .replace("/task/", ":")
    .split(":")[1];

  const logoutUser = () => {
    sessionStorage.setItem("userLoggedOut", true);
    sessionStorage.removeItem("authUser");
    setAuthentication(false);
    navigate("/signin");
  };

  const redirectToGetStartedPage = () => {
    navigate(`/auth/${userAuthenticated.user}/classic/get-started`);
  };

  useEffect(() => {
    const getUserSession = async () => {
      const { userId, sessionNumber } = JSON.parse(
        sessionStorage.getItem("authUser"),
      );
      const userSession = await cookieStore.get(
        "session-" + userId + "_" + sessionNumber,
      );
      if (userSession) {
        setSession(userSession.value);
      } else {
        logoutUser();
      }
    };
    if (userAuthenticated) {
      getUserSession();
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { user, userId, sessionNumber } = JSON.parse(
        sessionStorage.getItem("authUser"),
      );
      const validSession = await bcrypt.compare(
        user + "-" + userId + "_" + sessionNumber,
        session,
      );
      if (!validSession) {
        logoutUser();
      }
    };
    if (userAuthenticated && session !== "") {
      checkSession();
    }
  }, [session]);

  useEffect(() => {
    if (!isAuthenticated && !userAuthenticated) {
      if (userLoggedOut) {
        navigate("/signin");
      } else {
        navigate("/signin?redirect=/auth/user/tasks");
      }
    }
  }, []);

  if (isAuthenticated || userAuthenticated) {
    if (!checkingNewUserDone) {
      return <p>Checking ...</p>;
    } else {
      if (!newUser) {
        if (username === userAuthenticated.user && taskId.length === 36) {
          return (
            <Task
              user={userAuthenticated.user}
              userId={userAuthenticated.userId}
              setAuthentication={setAuthentication}
              setPreviewModernUI={setPreviewModernUI}
              task={taskId}
            />
          );
        } else {
          return <WrongRoute />;
        }
      } else {
        setTimeout(() => {
          redirectToGetStartedPage();
        }, 250);
      }
    }
  } else {
    return <WrongRoute />;
  }
}
