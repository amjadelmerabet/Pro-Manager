// Public routes
import HomeRoute from "./public/HomeRoute";
import FeaturesRoute from "./public/FeaturesRoute";
import BlogRoute from "./public/BlogRoute";
import PricingRoute from "./public/PricingRoute";
import AboutRoute from "./public/AboutRoute";
import ContactRoute from "./public/ContactRoute";
import LoginRoute from "./public/LoginRoute";
import SignUpRoute from "./public/SignupRoute";
import WrongRoute from "./public/WrongRoute";

// Authenticated routes
import DashboardRoute from "./auth/DashboardRoute";
import ProfileRoute from "./auth/ProfileRoute";
import ProjectsRoute from "./auth/ProjectsRoute";
import TasksRoute from "./auth/TasksRoute";
import SingleProjectRoute from "./auth/SingleProjectRoute";
import SingleTaskRoute from "./auth/SingleTaskRoute";

export {
  HomeRoute,
  AboutRoute,
  LoginRoute,
  DashboardRoute,
  ProfileRoute,
  ProjectsRoute,
  FeaturesRoute,
  BlogRoute,
  PricingRoute,
  ContactRoute,
  TasksRoute,
  SignUpRoute,
  SingleProjectRoute,
  SingleTaskRoute,
  WrongRoute
};
