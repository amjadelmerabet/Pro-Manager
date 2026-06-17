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
import ClassicDashboardRoute from "./auth/classic/DashboardRoute";
import ProfileRoute from "./auth/classic/ProfileRoute";
import ProjectsRoute from "./auth/classic/ProjectsRoute";
import TasksRoute from "./auth/classic/TasksRoute";
import SingleProjectRoute from "./auth/classic/SingleProjectRoute";
import SingleTaskRoute from "./auth/classic/SingleTaskRoute";
import ModernDashboardRoute from "./auth/modern/DashboardRoute";

export {
  HomeRoute,
  AboutRoute,
  LoginRoute,
  ClassicDashboardRoute,
  ModernDashboardRoute,
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
