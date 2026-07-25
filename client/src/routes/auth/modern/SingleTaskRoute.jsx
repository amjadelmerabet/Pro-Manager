import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import bcrypt from "bcryptjs";
import TaskPageModern from "../../../pages/auth/task/modern/Task";
import WrongRoute from "../../public/WrongRoute";

export default function SingleTaskRoute({ isAuthenticated, setAuthentication, setPreviewModernUI }) {
  const [session, setSession] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  const loggedOut = JSON.parse(sessionStorage.getItem("userLoggedOut"));
  const username = location.pathname.replace("/auth/", "").split("/")[0];

  const logout = () => {
    sessionStorage.setItem("userLoggedOut", true);
    sessionStorage.removeItem("authUser");
    setAuthentication(false);
    navigate("/signin");
  };

  useEffect(() => {
    const getSession = async () => {
      const userSession = await cookieStore.get(`session-${authUser.userId}`);
      if (userSession) setSession(userSession.value);
      else logout();
    };
    if (authUser) getSession();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (!(await bcrypt.compare(`${authUser.user}-${authUser.userId}`, session))) logout();
    };
    if (authUser && session) checkSession();
  }, [session]);

  useEffect(() => {
    if (!isAuthenticated && !authUser) navigate(loggedOut ? "/signin" : "/signin?redirect=/auth/user/modern/tasks");
  }, []);

  if ((isAuthenticated || authUser) && authUser) {
    return username === authUser.user ? <TaskPageModern user={authUser.user} userId={authUser.userId} setAuthentication={setAuthentication} setPreviewModernUI={setPreviewModernUI} /> : <WrongRoute />;
  }
}
