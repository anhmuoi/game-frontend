/*
 * HISTORY Actions
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
  GET_HISTORY_DATA_SUCCESS,
  UPDATE_HISTORY,
  ADD_HISTORY,
  INIT_INDEX_HISTORY,
  INIT_INDEX_HISTORY_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_HISTORY_ROW,
  VALIDATE_HISTORY_ERROR,
  CREATE_HISTORY_SUCCESS,
  UPDATE_HISTORY_SUCCESS,
  DELETE_HISTORY_SUCCESS,
  SET_META_HISTORY,
  DELETE_MULTIES_HISTORY,
  DELETE_MULTIES_HISTORY_SUCCESS,
  CHANGE_PAGE_NUMBER_HISTORY,
  CHANGE_PAGE_SIZE_HISTORY,
  GET_SORT_HISTORY_LIST,
  GET_SORT_DIRECTION_HISTORY_LIST,
  VALIDATE_HISTORY,
  SET_STATUS_LIST_HISTORY,
  FETCH_HISTORY_INIT,
  FETCH_HISTORY_DATA,
  SET_GENDER_LIST_HISTORY,
  SET_DEPARTMENTS_LIST_HISTORY,
  SET_WORKTYPES_LIST_HISTORY,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_HISTORY,
} from './constants';

/**
 * Get HISTORY data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_HISTORY_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_HISTORY_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_HISTORY,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_HISTORY,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_HISTORY,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_HISTORY,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_HISTORY,
    workTypesList,
  };
}
/**
 * @param(HISTORY): object: contains info HISTORY for update
 * @param(id) number: HISTORY id
 */
export function putMarketUpdate(id, history) {
  return {
    type: UPDATE_HISTORY,
    history,
    id,
  };
}

/**
 * @param(HISTORY): object: contains info HISTORY for add
 */
export function postMarketAdd(history) {
  return {
    type: ADD_HISTORY,
    history,
  };
}

/**
 * @param(id): number: id HISTORY for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_HISTORY,
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
 * @param(HISTORY) object , init HISTORY object get from api for add and edit
 */
export function getInitIndexMarketSuccess(historyModel) {
  return {
    type: INIT_INDEX_HISTORY_SUCCESS,
    historyModel,
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
 * @param(id) number: id HISTORY delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_HISTORY_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_HISTORY,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_HISTORY,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_HISTORY_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_HISTORY_INIT,
  };
}

/**
 * @param(ids) array: ids HISTORY delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_HISTORY,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_HISTORY_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_HISTORY_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_HISTORY_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id HISTORY is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_HISTORY_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids HISTORY is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_HISTORY_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_HISTORY_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_HISTORY_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_HISTORY,
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
    type: SET_USER_HISTORY,
    userList,
  };
}
