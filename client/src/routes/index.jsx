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
import ClassicProjectsRoute from "./auth/classic/ProjectsRoute";
import ClassicTasksRoute from "./auth/classic/TasksRoute";
import SingleProjectRoute from "./auth/classic/SingleProjectRoute";
import ClassicSingleTaskRoute from "./auth/classic/SingleTaskRoute";
import ModernDashboardRoute from "./auth/modern/DashboardRoute";
import ModernProjectsRoute from "./auth/modern/ProjectsRoute";
import ModernTasksRoute from "./auth/modern/TasksRoute";
import ModernSingleTaskRoute from "./auth/modern/SingleTaskRoute";
import ModernSingleProjectRoute from "./auth/modern/SingleProjectRoute";

export {
  HomeRoute,
  AboutRoute,
  LoginRoute,
  ClassicDashboardRoute,
  ModernDashboardRoute,
  ProfileRoute,
  ClassicProjectsRoute,
  ModernProjectsRoute,
  FeaturesRoute,
  BlogRoute,
  PricingRoute,
  ContactRoute,
  ClassicTasksRoute,
  ModernTasksRoute,
  SignUpRoute,
  SingleProjectRoute,
  ClassicSingleTaskRoute,
  ModernSingleTaskRoute,
  ModernSingleProjectRoute,
  WrongRoute,
};
