/*
 * MY_NFT Actions
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
  GET_MY_NFT_DATA_SUCCESS,
  UPDATE_MY_NFT,
  ADD_MY_NFT,
  INIT_INDEX_MY_NFT,
  INIT_INDEX_MY_NFT_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_MY_NFT_ROW,
  VALIDATE_MY_NFT_ERROR,
  CREATE_MY_NFT_SUCCESS,
  UPDATE_MY_NFT_SUCCESS,
  DELETE_MY_NFT_SUCCESS,
  SET_META_MY_NFT,
  DELETE_MULTIES_MY_NFT,
  DELETE_MULTIES_MY_NFT_SUCCESS,
  CHANGE_PAGE_NUMBER_MY_NFT,
  CHANGE_PAGE_SIZE_MY_NFT,
  GET_SORT_MY_NFT_LIST,
  GET_SORT_DIRECTION_MY_NFT_LIST,
  VALIDATE_MY_NFT,
  SET_STATUS_LIST_MY_NFT,
  FETCH_MY_NFT_INIT,
  FETCH_MY_NFT_DATA,
  SET_GENDER_LIST_MY_NFT,
  SET_DEPARTMENTS_LIST_MY_NFT,
  SET_WORKTYPES_LIST_MY_NFT,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_MY_NFT,
} from './constants';

/**
 * Get MY_NFT data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_MY_NFT_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_MY_NFT_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_MY_NFT,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_MY_NFT,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_MY_NFT,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_MY_NFT,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_MY_NFT,
    workTypesList,
  };
}
/**
 * @param(MY_NFT): object: contains info MY_NFT for update
 * @param(id) number: MY_NFT id
 */
export function putMarketUpdate(id, myNft) {
  return {
    type: UPDATE_MY_NFT,
    myNft,
    id,
  };
}

/**
 * @param(MY_NFT): object: contains info MY_NFT for add
 */
export function postMarketAdd(myNft) {
  return {
    type: ADD_MY_NFT,
    myNft,
  };
}

/**
 * @param(id): number: id MY_NFT for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_MY_NFT,
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
 * @param(MY_NFT) object , init MY_NFT object get from api for add and edit
 */
export function getInitIndexMarketSuccess(myNftModel) {
  return {
    type: INIT_INDEX_MY_NFT_SUCCESS,
    myNftModel,
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
 * @param(id) number: id MY_NFT delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_MY_NFT_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_MY_NFT,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_MY_NFT,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_MY_NFT_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_MY_NFT_INIT,
  };
}

/**
 * @param(ids) array: ids MY_NFT delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_MY_NFT,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_MY_NFT_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_MY_NFT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_MY_NFT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id MY_NFT is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_MY_NFT_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids MY_NFT is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_MY_NFT_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_MY_NFT_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_MY_NFT_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_MY_NFT,
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
    type: SET_USER_MY_NFT,
    userList,
  };
}