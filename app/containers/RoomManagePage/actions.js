/*
 * ROOM_MANAGE Actions
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
  GET_ROOM_MANAGE_DATA_SUCCESS,
  UPDATE_ROOM_MANAGE,
  ADD_ROOM_MANAGE,
  INIT_INDEX_ROOM_MANAGE,
  INIT_INDEX_ROOM_MANAGE_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_ROOM_MANAGE_ROW,
  VALIDATE_ROOM_MANAGE_ERROR,
  CREATE_ROOM_MANAGE_SUCCESS,
  UPDATE_ROOM_MANAGE_SUCCESS,
  DELETE_ROOM_MANAGE_SUCCESS,
  SET_META_ROOM_MANAGE,
  DELETE_MULTIES_ROOM_MANAGE,
  DELETE_MULTIES_ROOM_MANAGE_SUCCESS,
  CHANGE_PAGE_NUMBER_ROOM_MANAGE,
  CHANGE_PAGE_SIZE_ROOM_MANAGE,
  GET_SORT_ROOM_MANAGE_LIST,
  GET_SORT_DIRECTION_ROOM_MANAGE_LIST,
  VALIDATE_ROOM_MANAGE,
  SET_STATUS_LIST_ROOM_MANAGE,
  FETCH_ROOM_MANAGE_INIT,
  FETCH_ROOM_MANAGE_DATA,
  SET_GENDER_LIST_ROOM_MANAGE,
  SET_DEPARTMENTS_LIST_ROOM_MANAGE,
  SET_WORKTYPES_LIST_ROOM_MANAGE,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
} from './constants';

/**
 * Get ROOM_MANAGE data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_ROOM_MANAGE_DATA_SUCCESS
 */
export function getRoomManageDataSuccess(data) {
  return {
    type: GET_ROOM_MANAGE_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaRoomManage(meta) {
  return {
    type: SET_META_ROOM_MANAGE,
    meta,
  };
}

export function setStatusListRoomManage(statusList) {
  return {
    type: SET_STATUS_LIST_ROOM_MANAGE,
    statusList,
  };
}
export function setGenderListRoomManage(genderList) {
  return {
    type: SET_GENDER_LIST_ROOM_MANAGE,
    genderList,
  };
}
export function setDepartmentsListRoomManage(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_ROOM_MANAGE,
    departmentsList,
  };
}
export function setWorkTypesListRoomManage(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_ROOM_MANAGE,
    workTypesList,
  };
}
/**
 * @param(ROOM_MANAGE): object: contains info ROOM_MANAGE for update
 * @param(id) number: ROOM_MANAGE id
 */
export function putRoomManageUpdate(id, roomManage) {
  return {
    type: UPDATE_ROOM_MANAGE,
    roomManage,
    id,
  };
}

/**
 * @param(ROOM_MANAGE): object: contains info ROOM_MANAGE for add
 */
export function postRoomManageAdd(roomManage) {
  return {
    type: ADD_ROOM_MANAGE,
    roomManage,
  };
}

/**
 * @param(id): number: id ROOM_MANAGE for get data
 */
export function getInitIndexRoomManage(id) {
  return {
    type: INIT_INDEX_ROOM_MANAGE,
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
 * @param(ROOM_MANAGE) object , init ROOM_MANAGE object get from api for add and edit
 */
export function getInitIndexRoomManageSuccess(roomManageModel) {
  return {
    type: INIT_INDEX_ROOM_MANAGE_SUCCESS,
    roomManageModel,
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
 * @param(id) number: id ROOM_MANAGE delete
 */
export function deleteRoomManage(id) {
  return {
    type: DELETE_ROOM_MANAGE_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberRoomManage(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_ROOM_MANAGE,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeRoomManage(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_ROOM_MANAGE,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getRoomManageData(departmentIds, status, search) {
  return {
    type: FETCH_ROOM_MANAGE_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getRoomManageInit() {
  return {
    type: FETCH_ROOM_MANAGE_INIT,
  };
}

/**
 * @param(ids) array: ids ROOM_MANAGE delete
 */
export function deleteMultiesRoomManage(ids) {
  return {
    type: DELETE_MULTIES_ROOM_MANAGE,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ROOM_MANAGE_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createRoomManageSuccess(message) {
  return {
    type: CREATE_ROOM_MANAGE_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateRoomManageSuccess(message) {
  return {
    type: UPDATE_ROOM_MANAGE_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id ROOM_MANAGE is deleted
 */
export function deleteRoomManageSuccess(message, id) {
  return {
    type: DELETE_ROOM_MANAGE_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids ROOM_MANAGE is deleted
 */
export function deleteMultiesRoomManageSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_ROOM_MANAGE_SUCCESS,
    message,
    ids,
  };
}

export function getSortRoomManageList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_ROOM_MANAGE_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionRoomManageList() {
  return {
    type: GET_SORT_DIRECTION_ROOM_MANAGE_LIST,
  };
}

export function validateRoomManage(errors) {
  return {
    type: VALIDATE_ROOM_MANAGE,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}
