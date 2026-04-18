import { useLocation, useNavigate } from "react-router";
import Task from "../../pages/auth/task/Task";
import { useEffect, useState } from "react";
import WrongRoute from "../public/WrongRoute";
import bcrypt from "bcryptjs";

export default function SingleTaskRoute({
  isAuthenticated,
  setAuthentication,
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

  const logoutUser = () => {
    sessionStorage.setItem("userLoggedOut", true);
    sessionStorage.removeItem("authUser");
    setAuthentication(false);
    navigate("/signin");
  };
  
  useEffect(() => {
    const getUserSession = async () => {
      const { userId } = JSON.parse(sessionStorage.getItem("authUser"));
      const userSession = await cookieStore.get("session-" + userId);
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
      const { user, userId } = JSON.parse(sessionStorage.getItem("authUser"));
      const validSession = await bcrypt.compare(user + "-" + userId, session);
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
    if (username === userAuthenticated.user) {
      return (
        <Task
          user={userAuthenticated.user}
          userId={userAuthenticated.userId}
          setAuthentication={setAuthentication}
        />
      );
    } else {
      return <WrongRoute />;
    }
  }
}
