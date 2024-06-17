/*
 * MARKET Actions
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
  GET_MARKET_DATA_SUCCESS,
  UPDATE_MARKET,
  ADD_MARKET,
  INIT_INDEX_MARKET,
  INIT_INDEX_MARKET_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_MARKET_ROW,
  VALIDATE_MARKET_ERROR,
  CREATE_MARKET_SUCCESS,
  UPDATE_MARKET_SUCCESS,
  DELETE_MARKET_SUCCESS,
  SET_META_MARKET,
  DELETE_MULTIES_MARKET,
  DELETE_MULTIES_MARKET_SUCCESS,
  CHANGE_PAGE_NUMBER_MARKET,
  CHANGE_PAGE_SIZE_MARKET,
  GET_SORT_MARKET_LIST,
  GET_SORT_DIRECTION_MARKET_LIST,
  VALIDATE_MARKET,
  SET_STATUS_LIST_MARKET,
  FETCH_MARKET_INIT,
  FETCH_MARKET_DATA,
  SET_GENDER_LIST_MARKET,
  SET_DEPARTMENTS_LIST_MARKET,
  SET_WORKTYPES_LIST_MARKET,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
} from './constants';

/**
 * Get MARKET data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_MARKET_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_MARKET_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_MARKET,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_MARKET,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_MARKET,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_MARKET,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_MARKET,
    workTypesList,
  };
}
/**
 * @param(MARKET): object: contains info MARKET for update
 * @param(id) number: MARKET id
 */
export function putMarketUpdate(id, market) {
  return {
    type: UPDATE_MARKET,
    market,
    id,
  };
}

/**
 * @param(MARKET): object: contains info MARKET for add
 */
export function postMarketAdd(market) {
  return {
    type: ADD_MARKET,
    market,
  };
}

/**
 * @param(id): number: id MARKET for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_MARKET,
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
 * @param(MARKET) object , init MARKET object get from api for add and edit
 */
export function getInitIndexMarketSuccess(marketModel) {
  return {
    type: INIT_INDEX_MARKET_SUCCESS,
    marketModel,
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
 * @param(id) number: id MARKET delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_MARKET_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_MARKET,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_MARKET,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_MARKET_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_MARKET_INIT,
  };
}

/**
 * @param(ids) array: ids MARKET delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_MARKET,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_MARKET_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_MARKET_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_MARKET_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id MARKET is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_MARKET_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids MARKET is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_MARKET_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_MARKET_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_MARKET_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_MARKET,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}
