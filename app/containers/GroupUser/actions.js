/*
 * GROUP_USER Actions
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
  GET_GROUP_USER_DATA_SUCCESS,
  UPDATE_GROUP_USER,
  ADD_GROUP_USER,
  INIT_INDEX_GROUP_USER,
  INIT_INDEX_GROUP_USER_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_GROUP_USER_ROW,
  VALIDATE_GROUP_USER_ERROR,
  CREATE_GROUP_USER_SUCCESS,
  UPDATE_GROUP_USER_SUCCESS,
  DELETE_GROUP_USER_SUCCESS,
  SET_META_GROUP_USER,
  DELETE_MULTIES_GROUP_USER,
  DELETE_MULTIES_GROUP_USER_SUCCESS,
  CHANGE_PAGE_NUMBER_GROUP_USER,
  CHANGE_PAGE_SIZE_GROUP_USER,
  GET_SORT_GROUP_USER_LIST,
  GET_SORT_DIRECTION_GROUP_USER_LIST,
  VALIDATE_GROUP_USER,
  SET_STATUS_LIST_GROUP_USER,
  FETCH_GROUP_USER_INIT,
  FETCH_GROUP_USER_DATA,
  SET_GENDER_LIST_GROUP_USER,
  SET_DEPARTMENTS_LIST_GROUP_USER,
  SET_WORKTYPES_LIST_GROUP_USER,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_GROUP_USER,
  REQUEST_JOIN_GROUP,
} from './constants';

/**
 * Get GROUP_USER data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_GROUP_USER_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_GROUP_USER_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_GROUP_USER,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_GROUP_USER,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_GROUP_USER,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_GROUP_USER,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_GROUP_USER,
    workTypesList,
  };
}
/**
 * @param(GROUP_USER): object: contains info GROUP_USER for update
 * @param(id) number: GROUP_USER id
 */
export function putMarketUpdate(id, groupUser) {
  return {
    type: UPDATE_GROUP_USER,
    groupUser,
    id,
  };
}

/**
 * @param(GROUP_USER): object: contains info GROUP_USER for add
 */
export function postMarketAdd(groupUser) {
  return {
    type: ADD_GROUP_USER,
    groupUser,
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
 * @param(id): number: id GROUP_USER for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_GROUP_USER,
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
 * @param(GROUP_USER) object , init GROUP_USER object get from api for add and edit
 */
export function getInitIndexMarketSuccess(groupUserModel) {
  return {
    type: INIT_INDEX_GROUP_USER_SUCCESS,
    groupUserModel,
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
 * @param(id) number: id GROUP_USER delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_GROUP_USER_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_GROUP_USER,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_GROUP_USER,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_GROUP_USER_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_GROUP_USER_INIT,
  };
}

/**
 * @param(ids) array: ids GROUP_USER delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_GROUP_USER,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_GROUP_USER_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_GROUP_USER_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_GROUP_USER_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id GROUP_USER is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_GROUP_USER_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids GROUP_USER is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_GROUP_USER_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_GROUP_USER_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_GROUP_USER_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_GROUP_USER,
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
    type: SET_USER_GROUP_USER,
    userList,
  };
}
