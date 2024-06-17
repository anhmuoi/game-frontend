/*
 * RANK Actions
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
  GET_RANK_DATA_SUCCESS,
  UPDATE_RANK,
  ADD_RANK,
  INIT_INDEX_RANK,
  INIT_INDEX_RANK_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_RANK_ROW,
  VALIDATE_RANK_ERROR,
  CREATE_RANK_SUCCESS,
  UPDATE_RANK_SUCCESS,
  DELETE_RANK_SUCCESS,
  SET_META_RANK,
  DELETE_MULTIES_RANK,
  DELETE_MULTIES_RANK_SUCCESS,
  CHANGE_PAGE_NUMBER_RANK,
  CHANGE_PAGE_SIZE_RANK,
  GET_SORT_RANK_LIST,
  GET_SORT_DIRECTION_RANK_LIST,
  VALIDATE_RANK,
  SET_STATUS_LIST_RANK,
  FETCH_RANK_INIT,
  FETCH_RANK_DATA,
  SET_GENDER_LIST_RANK,
  SET_DEPARTMENTS_LIST_RANK,
  SET_WORKTYPES_LIST_RANK,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_RANK,
} from './constants';

/**
 * Get RANK data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_RANK_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_RANK_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_RANK,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_RANK,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_RANK,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_RANK,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_RANK,
    workTypesList,
  };
}
/**
 * @param(RANK): object: contains info RANK for update
 * @param(id) number: RANK id
 */
export function putMarketUpdate(id, rank) {
  return {
    type: UPDATE_RANK,
    rank,
    id,
  };
}

/**
 * @param(RANK): object: contains info RANK for add
 */
export function postMarketAdd(rank) {
  return {
    type: ADD_RANK,
    rank,
  };
}

/**
 * @param(id): number: id RANK for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_RANK,
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
 * @param(RANK) object , init RANK object get from api for add and edit
 */
export function getInitIndexMarketSuccess(rankModel) {
  return {
    type: INIT_INDEX_RANK_SUCCESS,
    rankModel,
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
 * @param(id) number: id RANK delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_RANK_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_RANK,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_RANK,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_RANK_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_RANK_INIT,
  };
}

/**
 * @param(ids) array: ids RANK delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_RANK,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_RANK_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_RANK_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_RANK_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id RANK is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_RANK_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids RANK is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_RANK_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_RANK_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_RANK_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_RANK,
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
    type: SET_USER_RANK,
    userList,
  };
}
