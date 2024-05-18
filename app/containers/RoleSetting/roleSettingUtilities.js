/* eslint-disable no-nested-ternary */
export const mapRoleModelApiToUi = roleApi => {
  const roleClone = {};
  if (roleApi) {
    Object.getOwnPropertyNames(roleApi).forEach(property => {
      roleClone[property] = {
        value: roleApi[property] === null ? '' : roleApi[property],
        errorMessage: false,
      };
    });
  }
  return roleClone;
};

export const mapRoleModelUiToApi = (roleUi, isWithoutPerm = false) => {
  const roleClone = {
    id: 0,
    roleName: '',
    permissionGroups: [],
    // enableDepartmentLevel: false,
  };
  console.log(roleUi);
  console.log(roleClone);
  if (roleUi) {
    Object.getOwnPropertyNames(roleClone).forEach(property => {
      const { value } = roleUi[property];
      roleClone[property] =
        value === '' ? null : typeof value === 'string' ? value.trim() : value;
    });
  }
  if (isWithoutPerm) {
    roleClone.permissionGroups = null;
  }
  return roleClone;
};
export const mergeState = (state, err) => {
  const newState = Object.assign({}, state);

  err.forEach(error => {
    newState[error.field].errorMessage = error.message;
  });

  return newState;
};