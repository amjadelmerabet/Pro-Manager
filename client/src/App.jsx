// Hooks
import { useEffect, useState } from "react";

// Components
import { Route, Routes, useLocation } from "react-router";

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
  GetStartedRoute,
} from "./routes";

// Styles
import "./App.css";
import checkNewUserUtil from "./utils/checkNewUserUtil";
import getNewAccessTokenUtil from "./utils/getNewAccessTokenUtil";

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [previewModernUI, setPreviewModernUI] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [checkingNewUserDone, setCheckingNewUserDone] = useState(false);
  const [checkNewUser, setCheckNewUser] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    action: "",
  });
  const [tries, setTries] = useState(0);
  
  const location = useLocation();

  const useModernUI = sessionStorage.getItem("modern-ui");
  
  useEffect(() => {
    if (!useModernUI) {
      sessionStorage.setItem("modern-ui", false);
    } else {
      setPreviewModernUI(useModernUI === "true" ? true : false);
    }
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    if (authUser) {
      if (authUser.authenticated) {
        setUserAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    const checkNewUserFn = async (user, userId, session, token) => {
      checkNewUserUtil(
        user,
        userId,
        session,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        tokenValidated,
        setTokenValidated,
        setNewUser,
        setCheckNewUser,
        setUserAuthenticated,
        setCheckingNewUserDone,
      );
    };
    if (userAuthenticated || checkNewUser) {
      let user, userId, token, session;
      if (userAuthenticated) {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        user = authUser.user;
        userId = authUser.userId;
        token = authUser.token;
        session = authUser.sessionId;
      }
      checkNewUserFn(user, userId, session, token);
    }
  }, [userAuthenticated, checkNewUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      const { user, userId, sessionId } = JSON.parse(
        sessionStorage.getItem("authUser"),
      );
      getNewAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTries,
        setTokenValidated,
        newAccessToken,
        setCheckNewUser,
      );
    }
  }, [newAccessToken]);

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
                <Route path="" element={<WrongRoute />} />
              </Route>
            ) : (
              <Route path="classic">
                <Route
                  path="get-started"
                  element={
                    <GetStartedRoute
                      isAuthenticated={userAuthenticated}
                      setAuthentication={setUserAuthenticated}
                      setPreviewModernUI={setPreviewModernUI}
                      newUser={newUser}
                      checkingNewUserDone={checkingNewUserDone}
                      setCheckingNewUserDone={setCheckingNewUserDone}
                      setCheckNewUser={setCheckNewUser}
                    />
                  }
                />
                <Route path="workspace">
                  <Route path=":workspaceId">
                    <Route
                      path="profile"
                      element={
                        <ProfileRoute
                          isAuthenticated={userAuthenticated}
                          setAuthentication={setUserAuthenticated}
                          setPreviewModernUI={setPreviewModernUI}
                          newUser={newUser}
                          checkingNewUserDone={checkingNewUserDone}
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
                          newUser={newUser}
                          checkingNewUserDone={checkingNewUserDone}
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
                          newUser={newUser}
                          checkingNewUserDone={checkingNewUserDone}
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
                            newUser={newUser}
                            checkingNewUserDone={checkingNewUserDone}
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
                          newUser={newUser}
                          checkingNewUserDone={checkingNewUserDone}
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
                            newUser={newUser}
                            checkingNewUserDone={checkingNewUserDone}
                          />
                        }
                      />
                    </Route>
                  </Route>
                </Route>
                <Route path="" element={<WrongRoute />} />
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
