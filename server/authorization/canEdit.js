import getAccessControlsByRole from "./helpers/access_contols/getAccessControlsByRole.js";
import getEditAccessControlsByTable from "./helpers/access_contols/getEditAccessControlsByTable.js";
import getUserRolesByUser from "./helpers/user_roles/getUserRolesByUser.js";

export default async function canEdit(user, table) {
  let editAllowed = false;
  let editAllRecords = false;
  const editAccessControls = await getEditAccessControlsByTable(table);
  let editAccessControlsArr = [];
  editAccessControls.forEach((accessControl) => {
    editAccessControlsArr.push(accessControl.access_control_id);
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
  editAccessControlsArr.forEach((editAccessControl) => {
    if (userAccessControls.indexOf(editAccessControl) !== -1) {
      editAllowed = true;
      editAccessControls.forEach((editAC) => {
        if (
          editAC.access_control_id === editAccessControl &&
          editAC.all_records
        ) {
          editAllRecords = true;
        }
      });
    }
  });
  return { editAllowed, editAllRecords };
}
