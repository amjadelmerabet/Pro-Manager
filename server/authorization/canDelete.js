import getAccessControlsByRole from "./helpers/access_contols/getAccessControlsByRole.js";
import getDeleteAccessControlsByTable from "./helpers/access_contols/getDeleteAccessControlsByTable.js";
import getUserRolesByUser from "./helpers/user_roles/getUserRolesByUser.js";

export default async function canDelete(user, table) {
  let deleteAllowed = false;
  let deleteAllRecords = false;
  const deleteAccessControls = await getDeleteAccessControlsByTable(table);
  let deleteAccessControlsArr = [];
  deleteAccessControls.forEach((accessControl) => {
    deleteAccessControlsArr.push(accessControl.access_control_id);
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
  deleteAccessControlsArr.forEach((deleteAccessControl) => {
    if (userAccessControls.indexOf(deleteAccessControl) !== -1) {
      deleteAllowed = true;
      deleteAccessControls.forEach((deleteAC) => {
        if (
          deleteAC.access_control_id === deleteAccessControl &&
          deleteAC.all_records
        ) {
          deleteAllRecords = true;
        }
      });
    }
  });
  return { deleteAllowed, deleteAllRecords };
}
