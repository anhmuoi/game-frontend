/*
 * ROOM_GAME Actions
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
  GET_ROOM_GAME_DATA_SUCCESS,
  UPDATE_ROOM_GAME,
  ADD_ROOM_GAME,
  INIT_INDEX_ROOM_GAME,
  INIT_INDEX_ROOM_GAME_SUCCESS,
  CHANGE_TEXT_FIELD,
  DELETE_ROOM_GAME_ROW,
  VALIDATE_ROOM_GAME_ERROR,
  CREATE_ROOM_GAME_SUCCESS,
  UPDATE_ROOM_GAME_SUCCESS,
  DELETE_ROOM_GAME_SUCCESS,
  SET_META_ROOM_GAME,
  DELETE_MULTIES_ROOM_GAME,
  DELETE_MULTIES_ROOM_GAME_SUCCESS,
  CHANGE_PAGE_NUMBER_ROOM_GAME,
  CHANGE_PAGE_SIZE_ROOM_GAME,
  GET_SORT_ROOM_GAME_LIST,
  GET_SORT_DIRECTION_ROOM_GAME_LIST,
  VALIDATE_ROOM_GAME,
  SET_STATUS_LIST_ROOM_GAME,
  FETCH_ROOM_GAME_INIT,
  FETCH_ROOM_GAME_DATA,
  SET_GENDER_LIST_ROOM_GAME,
  SET_DEPARTMENTS_LIST_ROOM_GAME,
  SET_WORKTYPES_LIST_ROOM_GAME,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
} from './constants';

/**
 * Get ROOM_GAME data when init page
 *
 * @param  {datas}  array of object response from api remote
 * @return {object}    An action object with a type of GET_ROOM_GAME_DATA_SUCCESS
 */
export function getRoomGameDataSuccess(data) {
  return {
    type: GET_ROOM_GAME_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaRoomGame(meta) {
  return {
    type: SET_META_ROOM_GAME,
    meta,
  };
}

export function setStatusListRoomGame(statusList) {
  return {
    type: SET_STATUS_LIST_ROOM_GAME,
    statusList,
  };
}
export function setGenderListRoomGame(genderList) {
  return {
    type: SET_GENDER_LIST_ROOM_GAME,
    genderList,
  };
}
export function setDepartmentsListRoomGame(departmentsList) {
  return {
    type: SET_DEPARTMENTS_LIST_ROOM_GAME,
    departmentsList,
  };
}
export function setWorkTypesListRoomGame(workTypesList) {
  return {
    type: SET_WORKTYPES_LIST_ROOM_GAME,
    workTypesList,
  };
}
/**
 * @param(ROOM_GAME): object: contains info ROOM_GAME for update
 * @param(id) number: ROOM_GAME id
 */
export function putRoomGameUpdate(id, roomGame) {
  return {
    type: UPDATE_ROOM_GAME,
    roomGame,
    id,
  };
}

/**
 * @param(ROOM_GAME): object: contains info ROOM_GAME for add
 */
export function postRoomGameAdd(roomGame) {
  return {
    type: ADD_ROOM_GAME,
    roomGame,
  };
}

/**
 * @param(id): number: id ROOM_GAME for get data
 */
export function getInitIndexRoomGame(id) {
  return {
    type: INIT_INDEX_ROOM_GAME,
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
 * @param(ROOM_GAME) object , init ROOM_GAME object get from api for add and edit
 */
export function getInitIndexRoomGameSuccess(roomGameModel) {
  return {
    type: INIT_INDEX_ROOM_GAME_SUCCESS,
    roomGameModel,
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
 * @param(id) number: id ROOM_GAME delete
 */
export function deleteRoomGame(id) {
  return {
    type: DELETE_ROOM_GAME_ROW,
    id,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberRoomGame(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_ROOM_GAME,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeRoomGame(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_ROOM_GAME,
    pageSize,
  };
}

/**
 * @param {paging} contains infor param url
 */
export function getRoomGameData(departmentIds, status, search) {
  return {
    type: FETCH_ROOM_GAME_DATA,
    departmentIds,
    status,
    search,
  };
}

export function getRoomGameInit() {
  return {
    type: FETCH_ROOM_GAME_INIT,
  };
}

/**
 * @param(ids) array: ids ROOM_GAME delete
 */
export function deleteMultiesRoomGame(ids) {
  return {
    type: DELETE_MULTIES_ROOM_GAME,
    ids,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ROOM_GAME_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createRoomGameSuccess(message) {
  return {
    type: CREATE_ROOM_GAME_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateRoomGameSuccess(message) {
  return {
    type: UPDATE_ROOM_GAME_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id ROOM_GAME is deleted
 */
export function deleteRoomGameSuccess(message, id) {
  return {
    type: DELETE_ROOM_GAME_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(message) string: message return from server when  delete success
 * @param(ids) array of number: ids ROOM_GAME is deleted
 */
export function deleteMultiesRoomGameSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_ROOM_GAME_SUCCESS,
    message,
    ids,
  };
}

export function getSortRoomGameList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_ROOM_GAME_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionRoomGameList() {
  return {
    type: GET_SORT_DIRECTION_ROOM_GAME_LIST,
  };
}

export function validateRoomGame(errors) {
  return {
    type: VALIDATE_ROOM_GAME,
    errors,
  };
}

export function updateAvatar(file) {
  return {
    type: UPDATE_AVATAR,
    file,
  };
}
