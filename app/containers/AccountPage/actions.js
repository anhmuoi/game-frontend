/*
 * Account Actions
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
  GET_ACCOUNT_DATA_SUCCESS,
  UPDATE_ACCOUNT,
  ADD_ACCOUNT,
  INIT_INDEX_ACCOUNT,
  INIT_INDEX_ACCOUNT_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_ACCOUNT_ROW,
  VALIDATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  SET_META_ACCOUNT,
  DELETE_MULTIES_ACCOUNT,
  DELETE_MULTIES_ACCOUNT_SUCCESS,
  CHANGE_PAGE_NUMBER_ACCOUNT,
  CHANGE_PAGE_SIZE_ACCOUNT,
  FETCH_ACCOUNT_INIT,
  GET_SORT_ACCOUNT_LIST,
  GET_SORT_DIRECTION_ACCOUNT_LIST,
  VALIDATE_ACCOUNT,
} from './constants';

/**
 * Get Account data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_ACCOUNT_DATA_SUCCESS
 */
export function getAccountDataSuccess(data) {
  return {
    type: GET_ACCOUNT_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaAccount(meta) {
  return {
    type: SET_META_ACCOUNT,
    meta,
  };
}

/**
 * @param(Account): object: contains info Account for update
 * @param(id) number: Account id
 */
export function putAccountUpdate(id, account) {
  return {
    type: UPDATE_ACCOUNT,
    account,
    id,
  };
}

/**
 * @param(Account): object: contains info Account for add
 */
export function postAccountAdd(account) {
  return {
    type: ADD_ACCOUNT,
    account,
  };
}

/**
 * @param(id): number: id Account for get data
 */
export function getInitIndexAccount(id) {
  return {
    type: INIT_INDEX_ACCOUNT,
    id,
  };
}

/**
 * @param(Account) object , init Account object get from api for add and edit
 */
export function getInitIndexAccountSuccess(accountModel) {
  return {
    type: INIT_INDEX_ACCOUNT_SUCCESS,
    accountModel,
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
 * @param(id) number: id Account delete
 */
export function deleteAccount(id) {
  return {
    type: DELETE_ACCOUNT_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberAccount(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_ACCOUNT,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeAccount(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_ACCOUNT,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getAccountInit(searchText) {
  return {
    type: FETCH_ACCOUNT_INIT,
    searchText,
  };
}

/**
 * @param(ids) array: ids Account delete
 */
export function deleteMultiesAccount(ids) {
  return {
    type: DELETE_MULTIES_ACCOUNT,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ACCOUNT_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createAccountSuccess(message) {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateAccountSuccess(message) {
  return {
    type: UPDATE_ACCOUNT_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id Account is deleted
 */
export function deleteAccountSuccess(message, id) {
  return {
    type: DELETE_ACCOUNT_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids Account is deleted
 */
export function deleteMultiesAccountSucces(message, ids) {
  return {
    type: DELETE_MULTIES_ACCOUNT_SUCCESS,
    message,
    ids,
  };
}

export function getSortAccountList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_ACCOUNT_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionAccountList() {
  return {
    type: GET_SORT_DIRECTION_ACCOUNT_LIST,
  };
}

export function validateAccount(errors) {
  return {
    type: VALIDATE_ACCOUNT,
    errors,
  };
}
