import bcrypt from "bcryptjs";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import GetStartedPage from "../../../pages/auth/get-started/GetStarted";
import WrongRoute from "../../public/WrongRoute";

export default function GetStartedRoute({
  isAuthenticated,
  setAuthentication,
  setPreviewModernUI,
  newUser,
  checkingNewUserDone,
  setCheckingNewUserDone,
  setCheckNewUser
}) {
  const [session, setSession] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");

  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));
  let userLoggedOut = JSON.parse(sessionStorage.getItem("userLoggedOut"));

  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");

  const index = slicedPathname.indexOf("/");

  const username = slicedPathname.slice(0, index);

  const logoutUser = () => {
    sessionStorage.setItem("userLoggedOut", true);
    sessionStorage.removeItem("authUser");
    setAuthentication(false);
    navigate("/signin");
  };

  const redirectToDashboardPage = () => {
    navigate(
      `/auth/${userAuthenticated.user}/classic/workspace/${workspaceId}/dashboard`,
    );
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
        navigate("/signin?redirect=/auth/user/classic/get-started");
      }
    }
  }, []);

  if (isAuthenticated || userAuthenticated) {
    if (username === userAuthenticated.user) {
      if (!checkingNewUserDone) {
        return <p>Checking ...</p>;
      } else {
        if (newUser) {
          return (
            <GetStartedPage
              user={userAuthenticated.user}
              userId={userAuthenticated.userId}
              setAuthentication={setAuthentication}
              setPreviewModernUI={setPreviewModernUI}
              setCheckingNewUserDone={setCheckingNewUserDone}
              setCheckNewUser={setCheckNewUser}
              setWorkspaceId={setWorkspaceId}
            />
          );
        } else {
          setTimeout(() => {
            redirectToDashboardPage();
          }, 250);
        }
      }
    } else {
      return <WrongRoute />;
    }
  }
}
