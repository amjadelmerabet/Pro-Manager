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
import DashboardRouteClassic from "./auth/DashboardRouteClassic";
import ProfileRoute from "./auth/ProfileRoute";
import ProjectsRoute from "./auth/ProjectsRoute";
import TasksRoute from "./auth/TasksRoute";
import SingleProjectRoute from "./auth/SingleProjectRoute";
import SingleTaskRoute from "./auth/SingleTaskRoute";
import DashboardRouteModern from "./auth/DashboardRouteModern";

export {
  HomeRoute,
  AboutRoute,
  LoginRoute,
  DashboardRouteClassic,
  DashboardRouteModern,
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
  WrongRoute,
};
