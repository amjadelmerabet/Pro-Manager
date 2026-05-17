import getAccessControlsByRole from "./helpers/access_contols/getAccessControlsByRole.js";
import getReadAccessControlsByTable from "./helpers/access_contols/getReadAccessControlsByTable.js";
import getUserRolesByUser from "./helpers/user_roles/getUserRolesByUser.js";

export default async function canRead(user, table) {
  let readAllowed = false;
  let readAllRecords = false;
  const readAccessControls = await getReadAccessControlsByTable(table);
  let readAccessControlsArr = [];
  readAccessControls.forEach((accessControl) => {
    readAccessControlsArr.push(accessControl.access_control_id);
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
  readAccessControlsArr.forEach((readAccessControl) => {
    if (userAccessControls.indexOf(readAccessControl) !== -1) {
      readAllowed = true;
      readAccessControls.forEach((readAC) => {
        if (
          readAC.access_control_id === readAccessControl &&
          readAC.all_records
        ) {
          readAllRecords = true;
        }
      });
    }
  });
  return { readAllowed, readAllRecords };
}