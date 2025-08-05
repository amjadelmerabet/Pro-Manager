import DashboardPage from "../pages/auth/dashboard/Dashboard";
import WrongRoute from "./WrongRoute";

import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export default function DashboardRoute({ isAuthenticated }) {
  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));
  
  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");
  
  const index = slicedPathname.indexOf("/")

  const user = slicedPathname.slice(0, index);
  
  useEffect(() => {
    if (!isAuthenticated && !userAuthenticated) {
      navigate("/signin?redirect=/auth/user/dashboard");
    }
  }, []);
  
  if (isAuthenticated || userAuthenticated) {
    if (user === userAuthenticated.user) {
      return <DashboardPage />
    } else {
      return <WrongRoute />
    }
  }
}