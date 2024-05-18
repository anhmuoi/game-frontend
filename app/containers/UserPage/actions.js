/*
 * USER Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  GET_USER_DATA_SUCCESS,
  UPDATE_USER,
  ADD_USER,
  INIT_INDEX_USER,
  INIT_INDEX_USER_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_USER_ROW,
  VALIDATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  SET_META_USER,
  DELETE_MULTIES_USER,
  DELETE_MULTIES_USER_SUCCESS,
  CHANGE_PAGE_NUMBER_USER,
  CHANGE_PAGE_SIZE_USER,
  GET_SORT_USER_LIST,
  GET_SORT_DIRECTION_USER_LIST,
  VALIDATE_USER,
  EXPORT_USER,
  IMPORT_USER,
  SET_STATUS_LIST_USER,
  FETCH_USER_INIT,
  FETCH_USER_DATA,
  SET_GENDER_LIST_USER,
  SET_DEPARTMENTS_LIST_USER,
  SET_WORKTYPES_LIST_USER,
  UPDATE_AVATAR,
  SET_ROLE_LIST_USER,
} from './constants';

/**
 * Get USER data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_USER_DATA_SUCCESS
 */
export function getUserDataSuccess(data) {
  return {
    type: GET_USER_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaUser(meta) {
  return {
    type: SET_META_USER,
    meta,
  };
}

export function setStatusListUser(statusList) {
  return {
    type: SET_STATUS_LIST_USER,
    statusList,
  };
}
export function setGenderListUser(genderList) {
  return {
    type: SET_GENDER_LIST_USER,
    genderList,
  };
}
export function setDepartmentsListUser(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_USER,
    departmentsList,
  };
}
export function setRoleListUser(roleList) {
  return {
    type: SET_ROLE_LIST_USER,
    roleList,
  };
}
/**
 * @param(USER): object: contains info USER for update
 * @param(id) number: USER id
 */
export function putUserUpdate(id, user) {
  return {
    type: UPDATE_USER,
    user,
    id,
  };
}

/**
 * @param(USER): object: contains info USER for add
 */
export function postUserAdd(user) {
  return {
    type: ADD_USER,
    user,
  };
}

/**
 * @param(id): number: id USER for get data
 */
export function getInitIndexUser(id) {
  return {
    type: INIT_INDEX_USER,
    id,
  };
}

/**
 * @param(USER) object , init USER object get from api for add and edit
 */
export function getInitIndexUserSuccess(userModel) {
  return {
    type: INIT_INDEX_USER_SUCCESS,
    userModel,
  };
}

/**
 * @param(name) string : name of field
 * @param(value) string: value of field
 */
export function changeTextField(name, value) {
  return {
    type: CHANGE_TEXT_FIELD,
    name,
    value,
  };
}

/**
 * @param(id) number: id USER delete
 */
export function deleteUser(id) {
  return {
    type: DELETE_USER_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberUser(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_USER,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeUser(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_USER,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getUserData(departmentIds, status, search) {
  return {
    type: FETCH_USER_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getUserInit() {
  return {
    type: FETCH_USER_INIT,
  };
}

/**
 * @param(ids) array: ids USER delete
 */
export function deleteMultiesUser(ids) {
  return {
    type: DELETE_MULTIES_USER,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_USER_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createUserSuccess(message) {
  return {
    type: CREATE_USER_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateUserSuccess(message) {
  return {
    type: UPDATE_USER_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id USER is deleted
 */
export function deleteUserSuccess(message, id) {
  return {
    type: DELETE_USER_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids USER is deleted
 */
export function deleteMultiesUserSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_USER_SUCCESS,
    message,
    ids,
  };
}

export function getSortUserList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_USER_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionUserList() {
  return {
    type: GET_SORT_DIRECTION_USER_LIST,
  };
}

export function validateUser(errors) {
  return {
    type: VALIDATE_USER,
    errors,
  };
}

export function exportUser(fileType, text) {
  return {
    type: EXPORT_USER,
    fileType,
    text,
  };
}
export function importUser(file, fileType) {
  return {
    type: IMPORT_USER,
    file,
    fileType,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}
