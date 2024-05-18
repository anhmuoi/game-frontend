/*
 * ROOM_DETAIL Actions
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
  GET_ROOM_DETAIL_DATA_SUCCESS,
  UPDATE_ROOM_DETAIL,
  ADD_ROOM_DETAIL,
  INIT_INDEX_ROOM_DETAIL,
  INIT_INDEX_ROOM_DETAIL_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_ROOM_DETAIL_ROW,
  VALIDATE_ROOM_DETAIL_ERROR,
  CREATE_ROOM_DETAIL_SUCCESS,
  UPDATE_ROOM_DETAIL_SUCCESS,
  DELETE_ROOM_DETAIL_SUCCESS,
  SET_META_ROOM_DETAIL,
  DELETE_MULTIES_ROOM_DETAIL,
  DELETE_MULTIES_ROOM_DETAIL_SUCCESS,
  CHANGE_PAGE_NUMBER_ROOM_DETAIL,
  CHANGE_PAGE_SIZE_ROOM_DETAIL,
  GET_SORT_ROOM_DETAIL_LIST,
  GET_SORT_DIRECTION_ROOM_DETAIL_LIST,
  VALIDATE_ROOM_DETAIL,
  SET_STATUS_LIST_ROOM_DETAIL,
  FETCH_ROOM_DETAIL_INIT,
  FETCH_ROOM_DETAIL_DATA,
  SET_GENDER_LIST_ROOM_DETAIL,
  SET_DEPARTMENTS_LIST_ROOM_DETAIL,
  SET_WORKTYPES_LIST_ROOM_DETAIL,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
  FETCH_USER_ROOM_DETAIL,
  SET_USER_ROOM_DETAIL,
} from './constants';

/**
 * Get ROOM_DETAIL data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_ROOM_DETAIL_DATA_SUCCESS
 */
export function getRoomDetailDataSuccess(data) {
  return {
    type: GET_ROOM_DETAIL_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaRoomDetail(meta) {
  return {
    type: SET_META_ROOM_DETAIL,
    meta,
  };
}

export function setStatusListRoomDetail(statusList) {
  return {
    type: SET_STATUS_LIST_ROOM_DETAIL,
    statusList,
  };
}
export function setGenderListRoomDetail(genderList) {
  return {
    type: SET_GENDER_LIST_ROOM_DETAIL,
    genderList,
  };
}
export function setDepartmentsListRoomDetail(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_ROOM_DETAIL,
    departmentsList,
  };
}
export function setWorkTypesListRoomDetail(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_ROOM_DETAIL,
    workTypesList,
  };
}
/**
 * @param(ROOM_DETAIL): object: contains info ROOM_DETAIL for update
 * @param(id) number: ROOM_DETAIL id
 */
export function putRoomDetailUpdate(id, roomDetail) {
  return {
    type: UPDATE_ROOM_DETAIL,
    roomDetail,
    id,
  };
}

/**
 * @param(ROOM_DETAIL): object: contains info ROOM_DETAIL for add
 */
export function postRoomDetailAdd(roomDetail) {
  return {
    type: ADD_ROOM_DETAIL,
    roomDetail,
  };
}

/**
 * @param(id): number: id ROOM_DETAIL for get data
 */
export function getInitIndexRoomDetail(id) {
  return {
    type: INIT_INDEX_ROOM_DETAIL,
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
 * @param(ROOM_DETAIL) object , init ROOM_DETAIL object get from api for add and edit
 */
export function getInitIndexRoomDetailSuccess(roomDetailModel) {
  return {
    type: INIT_INDEX_ROOM_DETAIL_SUCCESS,
    roomDetailModel,
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
 * @param(id) number: id ROOM_DETAIL delete
 */
export function deleteRoomDetail(id) {
  return {
    type: DELETE_ROOM_DETAIL_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberRoomDetail(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_ROOM_DETAIL,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeRoomDetail(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_ROOM_DETAIL,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getRoomDetailData(departmentIds, status, search) {
  return {
    type: FETCH_ROOM_DETAIL_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getRoomDetailInit() {
  return {
    type: FETCH_ROOM_DETAIL_INIT,
  };
}

/**
 * @param(ids) array: ids ROOM_DETAIL delete
 */
export function deleteMultiesRoomDetail(ids) {
  return {
    type: DELETE_MULTIES_ROOM_DETAIL,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ROOM_DETAIL_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createRoomDetailSuccess(message) {
  return {
    type: CREATE_ROOM_DETAIL_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateRoomDetailSuccess(message) {
  return {
    type: UPDATE_ROOM_DETAIL_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id ROOM_DETAIL is deleted
 */
export function deleteRoomDetailSuccess(message, id) {
  return {
    type: DELETE_ROOM_DETAIL_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids ROOM_DETAIL is deleted
 */
export function deleteMultiesRoomDetailSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_ROOM_DETAIL_SUCCESS,
    message,
    ids,
  };
}

export function getSortRoomDetailList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_ROOM_DETAIL_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionRoomDetailList() {
  return {
    type: GET_SORT_DIRECTION_ROOM_DETAIL_LIST,
  };
}

export function validateRoomDetail(errors) {
  return {
    type: VALIDATE_ROOM_DETAIL,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}
export function getUserData() {
  return {
    type: FETCH_USER_ROOM_DETAIL,
  };
}
export function setUserData(userList) {
  return {
    type: SET_USER_ROOM_DETAIL,
    userList,
  };
}
