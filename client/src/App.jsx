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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/features" element={<FeaturesRoute />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/pricing" element={<PricingRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/contact" element={<ContactRoute />} />
        <Route path="/signin" element={<LoginRoute />} />
        <Route path="/auth">
          <Route path=":userId">
            <Route path="profile" element={<ProfileRoute />} />
            <Route path="dashboard" element={<DashboardRoute />} />
            <Route path="projects" element={<ProjectsRoute />} />
            <Route path="tasks" element={<TasksRoute />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
