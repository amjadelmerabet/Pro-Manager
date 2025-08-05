import ProfilePage from "../pages/auth/profile/Profile";
import WrongRoute from "./WrongRoute";

import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ProfileRoute({ isAuthenticated }) { 
  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));

  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");
  
  const index = slicedPathname.indexOf("/")

  const user = slicedPathname.slice(0, index);

  useEffect(() => {
    if (!isAuthenticated && !userAuthenticated) {
      navigate("/signin?redirect=/auth/user/profile");
    }
  }, []);
  
  if (isAuthenticated || userAuthenticated) {
    if (user === userAuthenticated.user) {
      return <ProfilePage />
    } else {
      return <WrongRoute />
    }
  }
}