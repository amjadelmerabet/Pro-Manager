// Hooks
import { useEffect, useState } from "react";

// Components
import { Route, Routes } from "react-router";

// Routes
import {
  AboutRoute,
  BlogRoute,
  ContactRoute,
  ClassicDashboardRoute,
  ModernDashboardRoute,
  FeaturesRoute,
  HomeRoute,
  LoginRoute,
  PricingRoute,
  ProfileRoute,
  ClassicProjectsRoute,
  ModernProjectsRoute,
  SignUpRoute,
  SingleProjectRoute,
  ClassicSingleTaskRoute,
  ModernSingleTaskRoute,
  ModernSingleProjectRoute,
  ClassicTasksRoute,
  ModernTasksRoute,
  WrongRoute,
} from "./routes";

// Styles
import "./App.css";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [previewModernUI, setPreviewModernUI] = useState(false);

  const useModernUI = sessionStorage.getItem("modern-ui");
  
  useEffect(() => {
    if (!useModernUI) {
      sessionStorage.setItem("modern-ui", false);
    } else {
      setPreviewModernUI(useModernUI === "true" ? true : false);
    }
  }, []);

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
            {previewModernUI || useModernUI === "true" ? (
              <Route path="modern">
                <Route
                  path="dashboard"
                  element={
                    <ModernDashboardRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route
                  path="projects"
                  element={
                    <ModernProjectsRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route path="project">
                  <Route
                    path=":projectId"
                    element={
                      <ModernSingleProjectRoute
                        isAuthenticated={userAuthenticated}
                        setAuthentication={setUserAuthenticated}
                        setPreviewModernUI={setPreviewModernUI}
                      />
                    }
                  />
                </Route>
                <Route
                  path="tasks"
                  element={
                    <ModernTasksRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route path="task">
                  <Route
                    path=":taskId"
                    element={
                      <ModernSingleTaskRoute
                        isAuthenticated={userAuthenticated}
                        setAuthentication={setUserAuthenticated}
                        setPreviewModernUI={setPreviewModernUI}
                      />
                    }
                  />
                </Route>
              </Route>
            ) : (
              <Route path="classic">
                <Route
                  path="profile"
                  element={
                    <ProfileRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ClassicDashboardRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route
                  path="projects"
                  element={
                    <ClassicProjectsRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
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
                        setPreviewModernUI={setPreviewModernUI}
                      />
                    }
                  />
                </Route>
                <Route
                  path="tasks"
                  element={
                    <ClassicTasksRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                    />
                  }
                />
                <Route path="task">
                  <Route
                    path=":taskid"
                    element={
                      <ClassicSingleTaskRoute
                        isAuthenticated={userAuthenticated}
                        setAuthentication={setUserAuthenticated}
                        setPreviewModernUI={setPreviewModernUI}
                      />
                    }
                  />
                </Route>
              </Route>
            )}
          </Route>
        </Route>
        <Route path="*" element={<WrongRoute />} />
      </Routes>
    </>
  );
}

export default App;
