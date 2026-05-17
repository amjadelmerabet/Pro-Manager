import getAccessControlsByRole from "./helpers/access_contols/getAccessControlsByRole.js";
import getCreateAccessControlsByTable from "./helpers/access_contols/getCreateAccessControlsByTable.js";
import getUserRolesByUser from "./helpers/user_roles/getUserRolesByUser.js";

export default async function canCreate(user, table) {
  let createAllowed = false;
  let createAllRecords = false;
  const createAccessControls = await getCreateAccessControlsByTable(table);
  let createAccessControlsArr = [];
  createAccessControls.forEach((accessControl) => {
    createAccessControlsArr.push(accessControl.access_control_id);
  });
  const userRoles = await getUserRolesByUser(user);
  let userAccessControlsArr = await Promise.all(
    userRoles.map(async (role) => {
      const accessControlsByUserRoles = await getAccessControlsByRole(
        role.role,
      );
      return accessControlsByUserRoles;
    }),
  );
  let userAccessControls = [];
  userAccessControlsArr.forEach((arr) => {
    arr.forEach((accessControl) => {
      userAccessControls.push(accessControl.access_control);
    });
  });
  createAccessControlsArr.forEach((createAccessControl) => {
    if (userAccessControls.indexOf(createAccessControl) !== -1) {
      createAllowed = true;
      createAccessControls.forEach((createAC) => {
        if (
          createAC.access_control_id === createAccessControl &&
          createAC.all_records
        ) {
          createAllRecords = true;
        }
      });
    }
  });
  return { createAllowed, createAllRecords };
}
