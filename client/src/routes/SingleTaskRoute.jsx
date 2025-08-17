import { useLocation, useNavigate } from "react-router";
import Task from "../pages/auth/task/Task";
import { useEffect } from "react";
import WrongRoute from "./WrongRoute";

export default function SingleTaskRoute({ isAuthenticated }) {
  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));

  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");

  const index = slicedPathname.indexOf("/");

  const user = slicedPathname.slice(0, index);

  useEffect(() => {
    if (!isAuthenticated && !userAuthenticated) {
      navigate("/signin?redirect=/auth/user/tasks");
    }
  }, []);

  if (isAuthenticated || userAuthenticated) {
    if (user === userAuthenticated.user) {
      return <Task user={userAuthenticated.user} />
    } else {
      return <WrongRoute />
    }
  }
}