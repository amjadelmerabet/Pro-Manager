import { useState, useEffect } from "react";
import "./GetStarted.css";
import createWorkspaceUtil from "./utils/createWorkspaceUtil";
import getNewAccessTokenUtil from "./utils/getNewAccessTokenUtil";

export default function GetStartedPage({
  user,
  userId,
  setAuthentication,
  setPreviewModernUI,
  setCheckingNewUserDone,
  setCheckNewUser,
  setWorkspaceId
}) {
  const [getStartedFormVisible, setGetStartedFormVisible] = useState(false);
  const [workspace, setWorkspace] = useState({ owner: userId });
  const [createWorkspace, setCreateWorkspace] = useState(false);
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    action: "",
  });
  const [tries, setTries] = useState(0);

  const { token, sessionId } = JSON.parse(sessionStorage.getItem("authUser"));

  useEffect(() => {
    setTimeout(() => {
      setGetStartedFormVisible(true);
    }, 250);
  }, []);

  useEffect(() => {
    if (createWorkspace) {
      createWorkspaceUtil(
        user,
        sessionId,
        token,
        workspace,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        setCreateWorkspace,
        setWorkspaceCreated,
        setWorkspaceId
      );
    }
  }, [createWorkspace]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getNewAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTries,
        setTokenValidated,
        newAccessToken,
        setCreateWorkspace,
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (workspaceCreated) {
      setCheckingNewUserDone(false);
      // setTimeout(() => {
      // }, 2500);
      setCheckNewUser(true);
      // setTimeout(() => {
      //   console.log("Redirecting to dashbaord page");
      //   navigate(`/auth/${user}/classic/dashboard`);
      // }, 1000);
    }
  }, [workspaceCreated]);

  const updateWorkspaceName = (name) => {
    setWorkspace({ ...workspace, name: name });
  };

  const updateWorkspaceDescription = (description) => {
    setWorkspace({ ...workspace, description: description });
  };

  const createWorkspaceFn = () => {
    setWorkspace({ ...workspace, updated_by: userId, created_by: userId });
    setCreateWorkspace(true);
  };

  return (
    <div className={"get-started" + (getStartedFormVisible ? " visible" : "")}>
      <h1 className="poppins-bold">Get started</h1>
      <form className="get-started-form poppins-regular">
        <p className="poppins-medium">Setting up your Workspace</p>
        <div className="workspace-name-section">
          <label htmlFor="workspace-name" className="poppins-medium">
            Select a name for your workspace
          </label>
          <input
            type="text"
            name="workspace-name"
            id="workspace-name"
            className="poppins-regular"
            onChange={(e) => updateWorkspaceName(e.target.value)}
          />
        </div>
        <div className="workspace-description-section">
          <label htmlFor="workspace-description" className="poppins-medium">
            How would you describe your workspace?
          </label>
          <textarea
            name="workspace-description"
            id="workspace-description"
            cols="30"
            rows="8"
            className="poppins-regular"
            onChange={(e) => updateWorkspaceDescription(e.target.value)}
          ></textarea>
        </div>
        <input
          type="button"
          value="Create"
          className="create-workspace-button poppins-semibold"
          onClick={() => createWorkspaceFn()}
        />
      </form>
    </div>
  );
}
