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
  TasksRoute,
} from "./routes";

import "./App.css";
import { useState } from "react";
import WrongRoute from "./routes/WrongRoute";

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
        <Route path="/signin" element={<LoginRoute isAuthenticated={userAuthenticated} setAuthentication={setUserAuthenticated} />} />
        <Route path="/auth">
          <Route path=":userId">
            <Route path="profile" element={<ProfileRoute isAuthenticated={userAuthenticated} />} />
            <Route path="dashboard" element={<DashboardRoute isAuthenticated={userAuthenticated} />} />
            <Route path="projects" element={<ProjectsRoute isAuthenticated={userAuthenticated} />} />
            <Route path="tasks" element={<TasksRoute isAuthenticated={userAuthenticated} />} />
          </Route>
        </Route>
        <Route path="*" element={<WrongRoute />} />
      </Routes>
    </>
  );
}

export default App;
