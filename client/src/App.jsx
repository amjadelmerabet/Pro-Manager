import { Route, Routes } from "react-router";
import {
  AboutRoute,
  BlogRoute,
  ContactRoute,
  DashboardRoute,
  FeaturesRoute,
  HomeRoute,
  LoginRoute,
  PricingRoute,
  ProfileRoute,
  ProjectsRoute,
  SignUpRoute,
  SingleProjectRoute,
  SingleTaskRoute,
  TasksRoute,
  WrongRoute,
} from "./routes";

import "./App.css";
import { useState } from "react";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/features" element={<FeaturesRoute />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/pricing" element={<PricingRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/contact" element={<ContactRoute />} />
        <Route
          path="/signin"
          element={
            <LoginRoute
              isAuthenticated={userAuthenticated}
              setAuthentication={setUserAuthenticated}
            />
          }
        />
        <Route path="/signup" element={<SignUpRoute />} />
        <Route path="/auth">
          <Route path=":userId">
            <Route
              path="profile"
              element={<ProfileRoute isAuthenticated={userAuthenticated} />}
            />
            <Route
              path="dashboard"
              element={
                <DashboardRoute
                  isAuthenticated={userAuthenticated}
                  setAuthentication={setUserAuthenticated}
                />
              }
            />
            <Route
              path="projects"
              element={
                <ProjectsRoute
                  isAuthenticated={userAuthenticated}
                  setAuthentication={setUserAuthenticated}
                />
              }
            ></Route>
            <Route path="project">
              <Route
                path=":projectId"
                element={
                  <SingleProjectRoute
                    isAuthenticated={userAuthenticated}
                    setAuthentication={setUserAuthenticated}
                  />
                }
              />
            </Route>
            <Route
              path="tasks"
              element={
                <TasksRoute
                  isAuthenticated={userAuthenticated}
                  setAuthentication={setUserAuthenticated}
                />
              }
            />
            <Route path="task">
              <Route
                path=":taskid"
                element={
                  <SingleTaskRoute
                    isAuthenticated={userAuthenticated}
                    setAuthentication={setUserAuthenticated}
                  />
                }
              />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<WrongRoute />} />
      </Routes>
    </>
  );
}

export default App;
