/*
 * ANALYSIS Actions
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
  GET_ANALYSIS_DATA_SUCCESS,
  UPDATE_ANALYSIS,
  ADD_ANALYSIS,
  INIT_INDEX_ANALYSIS,
  INIT_INDEX_ANALYSIS_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_ANALYSIS_ROW,
  VALIDATE_ANALYSIS_ERROR,
  CREATE_ANALYSIS_SUCCESS,
  UPDATE_ANALYSIS_SUCCESS,
  DELETE_ANALYSIS_SUCCESS,
  SET_META_ANALYSIS,
  DELETE_MULTIES_ANALYSIS,
  DELETE_MULTIES_ANALYSIS_SUCCESS,
  CHANGE_PAGE_NUMBER_ANALYSIS,
  CHANGE_PAGE_SIZE_ANALYSIS,
  GET_SORT_ANALYSIS_LIST,
  GET_SORT_DIRECTION_ANALYSIS_LIST,
  VALIDATE_ANALYSIS,
  SET_STATUS_LIST_ANALYSIS,
  FETCH_ANALYSIS_INIT,
  FETCH_ANALYSIS_DATA,
  SET_GENDER_LIST_ANALYSIS,
  SET_DEPARTMENTS_LIST_ANALYSIS,
  SET_WORKTYPES_LIST_ANALYSIS,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_ANALYSIS,
} from './constants';

/**
 * Get ANALYSIS data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_ANALYSIS_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_ANALYSIS_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_ANALYSIS,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_ANALYSIS,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_ANALYSIS,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_ANALYSIS,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_ANALYSIS,
    workTypesList,
  };
}
/**
 * @param(ANALYSIS): object: contains info ANALYSIS for update
 * @param(id) number: ANALYSIS id
 */
export function putMarketUpdate(id, analysis) {
  return {
    type: UPDATE_ANALYSIS,
    analysis,
    id,
  };
}

/**
 * @param(ANALYSIS): object: contains info ANALYSIS for add
 */
export function postMarketAdd(analysis) {
  return {
    type: ADD_ANALYSIS,
    analysis,
  };
}

/**
 * @param(id): number: id ANALYSIS for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_ANALYSIS,
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
 * @param(ANALYSIS) object , init ANALYSIS object get from api for add and edit
 */
export function getInitIndexMarketSuccess(analysisModel) {
  return {
    type: INIT_INDEX_ANALYSIS_SUCCESS,
    analysisModel,
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
 * @param(id) number: id ANALYSIS delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_ANALYSIS_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_ANALYSIS,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_ANALYSIS,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_ANALYSIS_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_ANALYSIS_INIT,
  };
}

/**
 * @param(ids) array: ids ANALYSIS delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_ANALYSIS,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ANALYSIS_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_ANALYSIS_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_ANALYSIS_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id ANALYSIS is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_ANALYSIS_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids ANALYSIS is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_ANALYSIS_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_ANALYSIS_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_ANALYSIS_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_ANALYSIS,
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
    type: SET_USER_ANALYSIS,
    userList,
  };
}
