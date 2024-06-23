/*
 * MY_PROFILE Actions
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
  GET_MY_PROFILE_DATA_SUCCESS,
  UPDATE_MY_PROFILE,
  ADD_MY_PROFILE,
  INIT_INDEX_MY_PROFILE,
  INIT_INDEX_MY_PROFILE_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_MY_PROFILE_ROW,
  VALIDATE_MY_PROFILE_ERROR,
  CREATE_MY_PROFILE_SUCCESS,
  UPDATE_MY_PROFILE_SUCCESS,
  DELETE_MY_PROFILE_SUCCESS,
  SET_META_MY_PROFILE,
  DELETE_MULTIES_MY_PROFILE,
  DELETE_MULTIES_MY_PROFILE_SUCCESS,
  CHANGE_PAGE_NUMBER_MY_PROFILE,
  CHANGE_PAGE_SIZE_MY_PROFILE,
  GET_SORT_MY_PROFILE_LIST,
  GET_SORT_DIRECTION_MY_PROFILE_LIST,
  VALIDATE_MY_PROFILE,
  EXPORT_MY_PROFILE,
  IMPORT_MY_PROFILE,
  SET_STATUS_LIST_MY_PROFILE,
  FETCH_MY_PROFILE_INIT,
  FETCH_MY_PROFILE_DATA,
  SET_GENDER_LIST_MY_PROFILE,
  SET_DEPARTMENTS_LIST_MY_PROFILE,
  SET_WORKTYPES_LIST_MY_PROFILE,
  UPDATE_AVATAR,
  SET_ROLE_LIST_MY_PROFILE,
} from './constants';

/**
 * Get MY_PROFILE data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_MY_PROFILE_DATA_SUCCESS
 */
export function getMyProfileDataSuccess(data) {
  return {
    type: GET_MY_PROFILE_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMyProfile(meta) {
  return {
    type: SET_META_MY_PROFILE,
    meta,
  };
}

export function setStatusListMyProfile(statusList) {
  return {
    type: SET_STATUS_LIST_MY_PROFILE,
    statusList,
  };
}
export function setGenderListMyProfile(genderList) {
  return {
    type: SET_GENDER_LIST_MY_PROFILE,
    genderList,
  };
}
export function setDepartmentsListMyProfile(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_MY_PROFILE,
    departmentsList,
  };
}
export function setRoleListMyProfile(roleList) {
  return {
    type: SET_ROLE_LIST_MY_PROFILE,
    roleList,
  };
}
/**
 * @param(MY_PROFILE): object: contains info MY_PROFILE for update
 * @param(id) number: MY_PROFILE id
 */
export function putMyProfileUpdate(id, myProfile) {
  return {
    type: UPDATE_MY_PROFILE,
    myProfile,
    id,
  };
}

/**
 * @param(MY_PROFILE): object: contains info MY_PROFILE for add
 */
export function postMyProfileAdd(myProfile) {
  return {
    type: ADD_MY_PROFILE,
    myProfile,
  };
}

/**
 * @param(id): number: id MY_PROFILE for get data
 */
export function getInitIndexMyProfile(id) {
  return {
    type: INIT_INDEX_MY_PROFILE,
    id,
  };
}

/**
 * @param(MY_PROFILE) object , init MY_PROFILE object get from api for add and edit
 */
export function getInitIndexMyProfileSuccess(myProfileModel) {
  return {
    type: INIT_INDEX_MY_PROFILE_SUCCESS,
    myProfileModel,
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
 * @param(id) number: id MY_PROFILE delete
 */
export function deleteMyProfile(id) {
  return {
    type: DELETE_MY_PROFILE_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMyProfile(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_MY_PROFILE,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMyProfile(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_MY_PROFILE,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMyProfileData(departmentIds, status, search) {
  return {
    type: FETCH_MY_PROFILE_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMyProfileInit() {
  return {
    type: FETCH_MY_PROFILE_INIT,
  };
}

/**
 * @param(ids) array: ids MY_PROFILE delete
 */
export function deleteMultiesMyProfile(ids) {
  return {
    type: DELETE_MULTIES_MY_PROFILE,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_MY_PROFILE_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMyProfileSuccess(message) {
  return {
    type: CREATE_MY_PROFILE_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMyProfileSuccess(message) {
  return {
    type: UPDATE_MY_PROFILE_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id MY_PROFILE is deleted
 */
export function deleteMyProfileSuccess(message, id) {
  return {
    type: DELETE_MY_PROFILE_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids MY_PROFILE is deleted
 */
export function deleteMultiesMyProfileSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_MY_PROFILE_SUCCESS,
    message,
    ids,
  };
}

export function getSortMyProfileList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_MY_PROFILE_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMyProfileList() {
  return {
    type: GET_SORT_DIRECTION_MY_PROFILE_LIST,
  };
}

export function validateMyProfile(errors) {
  return {
    type: VALIDATE_MY_PROFILE,
    errors,
  };
}

export function exportMyProfile(fileType, text) {
  return {
    type: EXPORT_MY_PROFILE,
    fileType,
    text,
  };
}
export function importMyProfile(file, fileType) {
  return {
    type: IMPORT_MY_PROFILE,
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
