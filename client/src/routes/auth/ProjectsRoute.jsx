import ProjectsPage from "../../pages/auth/projects/Projects";
import WrongRoute from "../public/WrongRoute";

import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ProjectsRoute({ isAuthenticated, setAuthentication }) {
  let navigate = useNavigate();
  let userAuthenticated = JSON.parse(sessionStorage.getItem("authUser"));
  let userLoggedOut = JSON.parse(sessionStorage.getItem("userLoggedOut"));

  const location = useLocation();
  const pathname = location.pathname;
  const slicedPathname = pathname.replace("/auth/", "");

  const index = slicedPathname.indexOf("/");

  const user = slicedPathname.slice(0, index);

  useEffect(() => {
    if (!isAuthenticated && !userAuthenticated) {
      if (userLoggedOut) {
        navigate("/signin");
      } else {
        navigate("/signin?redirect=/auth/user/projects");
      }
    }
  }, []);

  if (isAuthenticated || userAuthenticated) {
    if (user === userAuthenticated.user) {
      return (
        <ProjectsPage
          user={userAuthenticated.user}
          setAuthentication={setAuthentication}
        />
      );
    } else {
      return <WrongRoute />;
    }
  }
}
