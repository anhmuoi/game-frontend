/*
 * FRIEND Actions
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
  GET_FRIEND_DATA_SUCCESS,
  UPDATE_FRIEND,
  ADD_FRIEND,
  INIT_INDEX_FRIEND,
  INIT_INDEX_FRIEND_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_FRIEND_ROW,
  VALIDATE_FRIEND_ERROR,
  CREATE_FRIEND_SUCCESS,
  UPDATE_FRIEND_SUCCESS,
  DELETE_FRIEND_SUCCESS,
  SET_META_FRIEND,
  DELETE_MULTIES_FRIEND,
  DELETE_MULTIES_FRIEND_SUCCESS,
  CHANGE_PAGE_NUMBER_FRIEND,
  CHANGE_PAGE_SIZE_FRIEND,
  GET_SORT_FRIEND_LIST,
  GET_SORT_DIRECTION_FRIEND_LIST,
  VALIDATE_FRIEND,
  SET_STATUS_LIST_FRIEND,
  FETCH_FRIEND_INIT,
  FETCH_FRIEND_DATA,
  SET_GENDER_LIST_FRIEND,
  SET_DEPARTMENTS_LIST_FRIEND,
  SET_WORKTYPES_LIST_FRIEND,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_FRIEND,
} from './constants';

/**
 * Get FRIEND data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_FRIEND_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_FRIEND_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_FRIEND,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_FRIEND,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_FRIEND,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_FRIEND,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_FRIEND,
    workTypesList,
  };
}
/**
 * @param(FRIEND): object: contains info FRIEND for update
 * @param(id) number: FRIEND id
 */
export function putMarketUpdate(id, friend) {
  return {
    type: UPDATE_FRIEND,
    friend,
    id,
  };
}

/**
 * @param(FRIEND): object: contains info FRIEND for add
 */
export function postMarketAdd(friend) {
  return {
    type: ADD_FRIEND,
    friend,
  };
}

/**
 * @param(id): number: id FRIEND for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_FRIEND,
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
 * @param(FRIEND) object , init FRIEND object get from api for add and edit
 */
export function getInitIndexMarketSuccess(friendModel) {
  return {
    type: INIT_INDEX_FRIEND_SUCCESS,
    friendModel,
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
 * @param(id) number: id FRIEND delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_FRIEND_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_FRIEND,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_FRIEND,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_FRIEND_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_FRIEND_INIT,
  };
}

/**
 * @param(ids) array: ids FRIEND delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_FRIEND,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_FRIEND_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_FRIEND_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_FRIEND_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id FRIEND is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_FRIEND_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids FRIEND is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_FRIEND_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_FRIEND_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_FRIEND_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_FRIEND,
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
    type: SET_USER_FRIEND,
    userList,
  };
}
