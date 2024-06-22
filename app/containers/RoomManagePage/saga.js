import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { checkRes, option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createRoomManageSuccess,
  deleteMultiesRoomManageSuccess,
  deleteRoomManageSuccess,
  getInitIndexRoomManageSuccess,
  getRoomManageDataSuccess,
  invalidModel,
  setDepartmentsListRoomManage,
  setGenderListRoomManage,
  setMetaRoomManage,
  setStatusListRoomManage,
  setStoreListWaiting,
  setWorkTypesListRoomManage,
  updateRoomManageSuccess,
} from './actions.js';
import {
  ADD_ROOM_MANAGE,
  CREATE_ROOM_MANAGE_SUCCESS,
  DELETE_MULTIES_ROOM_MANAGE,
  DELETE_MULTIES_ROOM_MANAGE_SUCCESS,
  DELETE_ROOM_MANAGE_ROW,
  DELETE_ROOM_MANAGE_SUCCESS,
  FETCH_ROOM_MANAGE_DATA,
  FETCH_ROOM_MANAGE_INIT,
  INIT_INDEX_ROOM_MANAGE,
  UPDATE_ROOM_MANAGE,
  UPDATE_ROOM_MANAGE_SUCCESS,
} from './constants.js';

import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';
import { mapIdsToQueryString, mapModelRoomManageApiToUI } from './functions.js';
import { getMetaPagingRoomManage } from './selectors.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaRoomManage = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'Name',
  };
  const metaPaging = meta ? meta.toJSON() : metaRoomManage;
  return `${URL_DOMAIN}/meeting-rooms?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn === 'idRoomManage' ? 'id' : metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    departmentIds
      ? `&departmentIds=${departmentIds.join('&departmentIds=')}`
      : ''
  }${status ? `&status=${status.join('&status=')}` : ''}${
    search ? `&search=${search.trim()}` : ''
  }`;
}

export function* getRoomManageData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingRoomManage());
  const getRoomManageURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when RoomManage enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getRoomManageURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      item.createdOn = convertShowDateTime(item.createdOn);
      item.idRoomManage = item.id;
    });
    // dispatch to RoomManage reducer

    yield put(getRoomManageDataSuccess(res.data));
    yield put(setMetaRoomManage(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomManage info from action
 */
export function* putRoomManageUpdate(action) {
  const urlUpdateRoomManage = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  let roomManage = action.roomManage;
  try {
    const res = yield call(
      request,
      urlUpdateRoomManage,
      option('PUT', roomManage),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateRoomManageSuccess(res.message));

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomManage info from action
 */
export function* postRoomManageAdd(action) {
  const urlAddRoomManage = `${URL_DOMAIN}/meeting-rooms`;
  let roomManage = action.roomManage;

  try {
    const res = yield call(
      request,
      urlAddRoomManage,
      option('POST', roomManage),
    );

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // success redirect to RoomManage page
    yield put(createRoomManageSuccess(res.message));
    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexRoomManage(action) {
  const urlInitIndexRoomManage = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexRoomManage, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to RoomManage or throw exception
        const err = { message: res.message };
        throw err;
      }

      yield put(getInitIndexRoomManageSuccess(mapModelRoomManageApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        name: '',
        isRunning: false,
        default: true,
        description: '',
        totalPeople: 0,
        currentPeople: 0,
        price: 0,
        passwordRoom: '',
        userListId: [],
      };
      yield put(getInitIndexRoomManageSuccess(mapModelRoomManageApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getRoomManageInit() {
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
export function* deleteRoomManage(action) {
  const urlDeleteRoomManage = `${URL_DOMAIN}/meeting-rooms?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteRoomManage, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to RoomManage or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomManage
    yield put(deleteRoomManageSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_RoomManage, ids: array }
 */
export function* deleteMultiesRoomManage(action) {
  const urlDeleteRoomManage = `${URL_DOMAIN}/meeting-rooms?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteRoomManage, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to RoomManage or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomManage
    yield put(deleteMultiesRoomManageSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* roomManageData() {
  yield takeLatest(FETCH_ROOM_MANAGE_INIT, getRoomManageInit);
  yield takeLatest(FETCH_ROOM_MANAGE_DATA, getRoomManageData);
  yield takeLatest(UPDATE_ROOM_MANAGE, putRoomManageUpdate);
  yield takeLatest(ADD_ROOM_MANAGE, postRoomManageAdd);
  yield takeLatest(INIT_INDEX_ROOM_MANAGE, getInitIndexRoomManage);
  yield takeLatest(DELETE_ROOM_MANAGE_ROW, deleteRoomManage);
  yield takeLatest(DELETE_MULTIES_ROOM_MANAGE, deleteMultiesRoomManage);
  yield takeLatest(DELETE_MULTIES_ROOM_MANAGE_SUCCESS, getRoomManageData);
  yield takeLatest(DELETE_ROOM_MANAGE_SUCCESS, getRoomManageData);
  yield takeLatest(UPDATE_ROOM_MANAGE_SUCCESS, getRoomManageData);
  yield takeLatest(CREATE_ROOM_MANAGE_SUCCESS, getRoomManageData);
}
