import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { checkRes, option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createRoomGameSuccess,
  deleteMultiesRoomGameSuccess,
  deleteRoomGameSuccess,
  getInitIndexRoomGameSuccess,
  getRoomGameDataSuccess,
  invalidModel,
  setDepartmentsListRoomGame,
  setGenderListRoomGame,
  setMetaRoomGame,
  setStatusListRoomGame,
  setStoreListWaiting,
  setWorkTypesListRoomGame,
  updateRoomGameSuccess,
} from './actions.js';
import {
  ADD_ROOM_GAME,
  CREATE_ROOM_GAME_SUCCESS,
  DELETE_MULTIES_ROOM_GAME,
  DELETE_MULTIES_ROOM_GAME_SUCCESS,
  DELETE_ROOM_GAME_ROW,
  DELETE_ROOM_GAME_SUCCESS,
  FETCH_ROOM_GAME_DATA,
  FETCH_ROOM_GAME_INIT,
  INIT_INDEX_ROOM_GAME,
  UPDATE_ROOM_GAME,
  UPDATE_ROOM_GAME_SUCCESS,
} from './constants.js';

import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';
import { mapIdsToQueryString, mapModelRoomGameApiToUI } from './functions.js';
import { getMetaPagingRoomGame } from './selectors.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaRoomGame = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 100,
  };
  const metaPaging = meta ? meta.toJSON() : metaRoomGame;
  return `${URL_DOMAIN}/meeting-rooms?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn === 'idRoomGame' ? 'id' : metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    departmentIds
      ? `&departmentIds=${departmentIds.join('&departmentIds=')}`
      : ''
  }${status ? `&status=${status.join('&status=')}` : ''}${
    search ? `&search=${search.trim()}` : ''
  }`;
}

export function* getRoomGameData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingRoomGame());
  const getRoomGameURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when RoomGame enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getRoomGameURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      item.createdOn = convertShowDateTime(item.createdOn);
      item.idRoomGame = item.id;
    });
    // dispatch to RoomGame reducer

    yield put(getRoomGameDataSuccess(res.data));
    yield put(setMetaRoomGame(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomGame info from action
 */
export function* putRoomGameUpdate(action) {
  const urlUpdateRoomGame = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  let roomGame = action.roomGame;
  try {
    const res = yield call(request, urlUpdateRoomGame, option('PUT', roomGame));
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateRoomGameSuccess(res.message));

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomGame info from action
 */
export function* postRoomGameAdd(action) {
  const urlAddRoomGame = `${URL_DOMAIN}/meeting-rooms`;
  let roomGame = action.roomGame;

  try {
    const res = yield call(request, urlAddRoomGame, option('POST', roomGame));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // success redirect to RoomGame page
    yield put(createRoomGameSuccess(res.message));
    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexRoomGame(action) {
  const urlInitIndexRoomGame = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexRoomGame, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to RoomGame or throw exception
        const err = { message: res.message };
        throw err;
      }

      yield put(getInitIndexRoomGameSuccess(mapModelRoomGameApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        name: '',
        isRunning: false,
        description: '',
        totalPeople: 0,
        currentPeople: 0,
        price: 0,
      };
      yield put(getInitIndexRoomGameSuccess(mapModelRoomGameApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getRoomGameInit() {
  const urlStoreIdList = `${URL_DOMAIN}/stores?pageNumber=1&pageSize=9999`;
  try {
    const res = yield call(request, urlStoreIdList, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemStore or throw exception
      const err = { message: res.message };
      throw err;
    }

    if (res.data) {
      res.data.map((item) => {
        delete item.address;
        delete item.businessNumber;
        delete item.businessType;
        delete item.code;
        delete item.phone;
        delete item.posOpenDate;
        delete item.representativeName;
        delete item.productClassificationLevel;
        delete item.status;
        delete item.type;
      });
    }
    yield put(setStoreListWaiting(res.data));
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteRoomGame(action) {
  const urlDeleteRoomGame = `${URL_DOMAIN}/meeting-rooms?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteRoomGame, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to RoomGame or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomGame
    yield put(deleteRoomGameSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_RoomGame, ids: array }
 */
export function* deleteMultiesRoomGame(action) {
  const urlDeleteRoomGame = `${URL_DOMAIN}/meeting-rooms?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteRoomGame, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to RoomGame or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomGame
    yield put(deleteMultiesRoomGameSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* roomGameData() {
  yield takeLatest(FETCH_ROOM_GAME_INIT, getRoomGameInit);
  yield takeLatest(FETCH_ROOM_GAME_DATA, getRoomGameData);
  yield takeLatest(UPDATE_ROOM_GAME, putRoomGameUpdate);
  yield takeLatest(ADD_ROOM_GAME, postRoomGameAdd);
  yield takeLatest(INIT_INDEX_ROOM_GAME, getInitIndexRoomGame);
  yield takeLatest(DELETE_ROOM_GAME_ROW, deleteRoomGame);
  yield takeLatest(DELETE_MULTIES_ROOM_GAME, deleteMultiesRoomGame);
  yield takeLatest(DELETE_MULTIES_ROOM_GAME_SUCCESS, getRoomGameData);
  yield takeLatest(DELETE_ROOM_GAME_SUCCESS, getRoomGameData);
  yield takeLatest(UPDATE_ROOM_GAME_SUCCESS, getRoomGameData);
  yield takeLatest(CREATE_ROOM_GAME_SUCCESS, getRoomGameData);
}
