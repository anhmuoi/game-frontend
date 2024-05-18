import {
  GET_ROLE_LIST,
  GET_ROLE_LIST_SUCCESS,
  CHANGE_PERMISSION_ENABLED,
  CHANGE_ROLE_NAME,
  GET_INDEX_ROLE,
  GET_INDEX_ROLE_SUCCESS,
  DELETE_ROLES,
  ADD_NEW_ROLE,
  EDIT_ROLE,
  SAVE_PERMISSION,
  ADD_NEW_ROLE_SUCCESS,
  EDIT_ROLE_SUCCESS,
  DELETE_ROLES_SUCCESS,
  CHANGE_SIMILAR_ID,
  RESET_SIMILAR_ID,
  ENABLE_DEPARTMENT_LEVEL,
  CHANGE_DEFAULT_ROLE,
  VALIDATE_ROLE
} from './constants';

/**
 * Action for get role
 * @author WooCheol Kim
 * @date 2020.06.03
 */
export function getRoleList() {
  return {
    type: GET_ROLE_LIST,
  };
}

export function getRoleListSuccess(res) {
  return {
    type: GET_ROLE_LIST_SUCCESS,
    res,
  };
}

export function changePermissionEnabled(data) {
  return {
    type: CHANGE_PERMISSION_ENABLED,
    data,
  };
}

export function enableDepartmentLevel(data) {
  return {
    type: ENABLE_DEPARTMENT_LEVEL,
    data,
  };
}

export function changeRoleName(name, value) {
  return {
    type: CHANGE_ROLE_NAME,
    name,
    value,
  };
}

/**
 * Action for getting details of index role
 * @param {number} id
 * @author WooCheol Kim
 */
export function getIndexRole(id) {
  return {
    type: GET_INDEX_ROLE,
    id,
  };
}

export function getIndexRoleSuccess(res) {
  return {
    type: GET_INDEX_ROLE_SUCCESS,
    res,
  };
}

export function deleteRoles(ids) {
  return {
    type: DELETE_ROLES,
    ids,
  };
}

export function deleteRolesSuccess() {
  return {
    type: DELETE_ROLES_SUCCESS,
  };
}

export function postAddRole(role) {
  return {
    type: ADD_NEW_ROLE,
    role,
  };
}

export function postAddRoleSuccess() {
  return {
    type: ADD_NEW_ROLE_SUCCESS,
  };
}

export function putEditRole(id, role) {
  return {
    type: EDIT_ROLE,
    id,
    role,
  };
}

export function putEditRoleSuccess() {
  return {
    type: EDIT_ROLE_SUCCESS,
  };
}

export function putEditPermission(id, role) {
  return {
    type: SAVE_PERMISSION,
    id,
    role,
  };
}

export function changeSimilarId(value) {
  return {
    type: CHANGE_SIMILAR_ID,
    value,
  };
}

export function resetSimilarId() {
  return {
    type: RESET_SIMILAR_ID,
  };
}

export function onChangeDefaultRole(id) {
  return {
    type: CHANGE_DEFAULT_ROLE,
    id,
  };
}
export function validateRole(errors) {
  return {
    type: VALIDATE_ROLE,
    errors,
  };
}
