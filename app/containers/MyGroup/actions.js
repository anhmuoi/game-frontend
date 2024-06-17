/*
 * MY_GROUP Actions
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
  GET_MY_GROUP_DATA_SUCCESS,
  UPDATE_MY_GROUP,
  ADD_MY_GROUP,
  INIT_INDEX_MY_GROUP,
  INIT_INDEX_MY_GROUP_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_MY_GROUP_ROW,
  VALIDATE_MY_GROUP_ERROR,
  CREATE_MY_GROUP_SUCCESS,
  UPDATE_MY_GROUP_SUCCESS,
  DELETE_MY_GROUP_SUCCESS,
  SET_META_MY_GROUP,
  DELETE_MULTIES_MY_GROUP,
  DELETE_MULTIES_MY_GROUP_SUCCESS,
  CHANGE_PAGE_NUMBER_MY_GROUP,
  CHANGE_PAGE_SIZE_MY_GROUP,
  GET_SORT_MY_GROUP_LIST,
  GET_SORT_DIRECTION_MY_GROUP_LIST,
  VALIDATE_MY_GROUP,
  SET_STATUS_LIST_MY_GROUP,
  FETCH_MY_GROUP_INIT,
  FETCH_MY_GROUP_DATA,
  SET_GENDER_LIST_MY_GROUP,
  SET_DEPARTMENTS_LIST_MY_GROUP,
  SET_WORKTYPES_LIST_MY_GROUP,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  SET_USER_MY_GROUP,
  REQUEST_JOIN_GROUP,
  GET_FRIEND_DATA,
  GET_FRIEND_DATA_SUCCESS,
  DELETE_MULTIES_FRIEND,
  DELETE_MULTIES_FRIEND_SUCCESS,
  USER_OUT_GROUP_SUCCESS,
  USER_OUT_GROUP,
} from './constants';

/**
 * Get MY_GROUP data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_MY_GROUP_DATA_SUCCESS
 */
export function getMarketDataSuccess(data) {
  return {
    type: GET_MY_GROUP_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaMarket(meta) {
  return {
    type: SET_META_MY_GROUP,
    meta,
  };
}

export function setStatusListMarket(statusList) {
  return {
    type: SET_STATUS_LIST_MY_GROUP,
    statusList,
  };
}
export function setGenderListMarket(genderList) {
  return {
    type: SET_GENDER_LIST_MY_GROUP,
    genderList,
  };
}
export function setDepartmentsListMarket(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_MY_GROUP,
    departmentsList,
  };
}
export function setWorkTypesListMarket(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_MY_GROUP,
    workTypesList,
  };
}
/**
 * @param(MY_GROUP): object: contains info MY_GROUP for update
 * @param(id) number: MY_GROUP id
 */
export function putMarketUpdate(id, myGroup) {
  return {
    type: UPDATE_MY_GROUP,
    myGroup,
    id,
  };
}

/**
 * @param(MY_GROUP): object: contains info MY_GROUP for add
 */
export function postMarketAdd(myGroup) {
  return {
    type: ADD_MY_GROUP,
    myGroup,
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
 * @param(id): number: id MY_GROUP for get data
 */
export function getInitIndexMarket(id) {
  return {
    type: INIT_INDEX_MY_GROUP,
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
 * @param(MY_GROUP) object , init MY_GROUP object get from api for add and edit
 */
export function getInitIndexMarketSuccess(myGroupModel) {
  return {
    type: INIT_INDEX_MY_GROUP_SUCCESS,
    myGroupModel,
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
 * @param(id) number: id MY_GROUP delete
 */
export function deleteMarket(id) {
  return {
    type: DELETE_MY_GROUP_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberMarket(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_MY_GROUP,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeMarket(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_MY_GROUP,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getMarketData(departmentIds, status, search) {
  return {
    type: FETCH_MY_GROUP_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getMarketInit() {
  return {
    type: FETCH_MY_GROUP_INIT,
  };
}

/**
 * @param(ids) array: ids MY_GROUP delete
 */
export function deleteMultiesMarket(ids) {
  return {
    type: DELETE_MULTIES_MY_GROUP,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_MY_GROUP_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createMarketSuccess(message) {
  return {
    type: CREATE_MY_GROUP_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateMarketSuccess(message) {
  return {
    type: UPDATE_MY_GROUP_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id MY_GROUP is deleted
 */
export function deleteMarketSuccess(message, id) {
  return {
    type: DELETE_MY_GROUP_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids MY_GROUP is deleted
 */
export function deleteMultiesMarketSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_MY_GROUP_SUCCESS,
    message,
    ids,
  };
}

export function getSortMarketList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_MY_GROUP_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionMarketList() {
  return {
    type: GET_SORT_DIRECTION_MY_GROUP_LIST,
  };
}

export function validateMarket(errors) {
  return {
    type: VALIDATE_MY_GROUP,
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
    type: SET_USER_MY_GROUP,
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
