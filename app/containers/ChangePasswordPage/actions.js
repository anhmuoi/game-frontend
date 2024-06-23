/*
 * CHANGE_PASSWORD Actions
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
  GET_CHANGE_PASSWORD_DATA_SUCCESS,
  UPDATE_CHANGE_PASSWORD,
  ADD_CHANGE_PASSWORD,
  INIT_INDEX_CHANGE_PASSWORD,
  INIT_INDEX_CHANGE_PASSWORD_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_CHANGE_PASSWORD_ROW,
  VALIDATE_CHANGE_PASSWORD_ERROR,
  CREATE_CHANGE_PASSWORD_SUCCESS,
  UPDATE_CHANGE_PASSWORD_SUCCESS,
  DELETE_CHANGE_PASSWORD_SUCCESS,
  SET_META_CHANGE_PASSWORD,
  DELETE_MULTIES_CHANGE_PASSWORD,
  DELETE_MULTIES_CHANGE_PASSWORD_SUCCESS,
  CHANGE_PAGE_NUMBER_CHANGE_PASSWORD,
  CHANGE_PAGE_SIZE_CHANGE_PASSWORD,
  GET_SORT_CHANGE_PASSWORD_LIST,
  GET_SORT_DIRECTION_CHANGE_PASSWORD_LIST,
  VALIDATE_CHANGE_PASSWORD,
  SET_STATUS_LIST_CHANGE_PASSWORD,
  FETCH_CHANGE_PASSWORD_INIT,
  FETCH_CHANGE_PASSWORD_DATA,
  SET_GENDER_LIST_CHANGE_PASSWORD,
  SET_DEPARTMENTS_LIST_CHANGE_PASSWORD,
  SET_WORKTYPES_LIST_CHANGE_PASSWORD,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_CHANGE_PASSWORD,
  REQUEST_JOIN_GROUP,
  GET_FRIEND_DATA,
  GET_FRIEND_DATA_SUCCESS,
  DELETE_MULTIES_FRIEND,
  DELETE_MULTIES_FRIEND_SUCCESS,
  USER_OUT_GROUP_SUCCESS,
  USER_OUT_GROUP,
  REQUEST_ADD_FRIEND,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
} from './constants';

/**
 * Get CHANGE_PASSWORD data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_CHANGE_PASSWORD_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_CHANGE_PASSWORD_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_CHANGE_PASSWORD,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_CHANGE_PASSWORD,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_CHANGE_PASSWORD,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_CHANGE_PASSWORD,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_CHANGE_PASSWORD,
    workTypesList,
  };
}
/**
 * @param(CHANGE_PASSWORD): object: contains info CHANGE_PASSWORD for update
 * @param(id) number: CHANGE_PASSWORD id
 */
export function putMarketUpdate(id, ChangePassword) {
  return {
    type: UPDATE_CHANGE_PASSWORD,
    ChangePassword,
    id,
  };
}

/**
 * @param(CHANGE_PASSWORD): object: contains info CHANGE_PASSWORD for add
 */
export function postMarketAdd(ChangePassword) {
  return {
    type: ADD_CHANGE_PASSWORD,
    ChangePassword,
  };
}
export function requestJoinGroup(id, userId) {
  return {
    type: REQUEST_JOIN_GROUP,
    id,
    userId,
  };
}

/**
 * @param(id): number: id CHANGE_PASSWORD for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_CHANGE_PASSWORD,
    id,
  };
}

export function setStoreListWaiting(storeList) {
  return {
    type: SET_STORE_LIST_WAITING,
    storeList,
  };
}

/**
 * @param(CHANGE_PASSWORD) object , init CHANGE_PASSWORD object get from api for add and edit
 */
export function getInitIndexMarketSuccess(ChangePasswordModel) {
  return {
    type: INIT_INDEX_CHANGE_PASSWORD_SUCCESS,
    ChangePasswordModel,
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
 * @param(id) number: id CHANGE_PASSWORD delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_CHANGE_PASSWORD_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_CHANGE_PASSWORD,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_CHANGE_PASSWORD,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_CHANGE_PASSWORD_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_CHANGE_PASSWORD_INIT,
  };
}

/**
 * @param(ids) array: ids CHANGE_PASSWORD delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_CHANGE_PASSWORD,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_CHANGE_PASSWORD_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_CHANGE_PASSWORD_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_CHANGE_PASSWORD_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id CHANGE_PASSWORD is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_CHANGE_PASSWORD_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids CHANGE_PASSWORD is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_CHANGE_PASSWORD_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_CHANGE_PASSWORD_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_CHANGE_PASSWORD_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_CHANGE_PASSWORD,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}

export function setUserData(userList) {
  return {
    type: SET_USER_CHANGE_PASSWORD,
    userList,
  };
}
export function getFriendData() {
  return {
    type: GET_FRIEND_DATA,
  };
}
export function getFriendDataSuccess(friendList) {
  return {
    type: GET_FRIEND_DATA_SUCCESS,
    friendList,
  };
}

export function deleteMultiesFriend(ids) {
  return {
    type: DELETE_MULTIES_FRIEND,
    ids,
  };
}

export function deleteMultiesFriendSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_FRIEND_SUCCESS,
    message,
    ids,
  };
}
export function userOutGroup(id, groupId) {
  return {
    type: USER_OUT_GROUP,
    id,
    groupId,
  };
}

export function userOutGroupSuccess(message, ids) {
  return {
    type: USER_OUT_GROUP_SUCCESS,
    message,
    ids,
  };
}
export function requestAddFriend(userId1, userId2) {
  return {
    type: REQUEST_ADD_FRIEND,
    userId1,
    userId2,
  };
}
export function ChangePassword(password, confirmPassword) {
  return {
    type: CHANGE_PASSWORD,
    password,
    confirmPassword,
  };
}
export function changePasswordSuccess(message) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    message,
  };
}
