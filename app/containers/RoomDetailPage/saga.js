import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { checkRes, option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createRoomDetailSuccess,
  deleteMultiesRoomDetailSuccess,
  deleteRoomDetailSuccess,
  getInitIndexMeetingLogsSuccess,
  getInitIndexRoomDetailSuccess,
  getRoomDetailDataSuccess,
  invalidModel,
  setDepartmentsListRoomDetail,
  setGenderListRoomDetail,
  setMetaRoomDetail,
  setStatusListRoomDetail,
  setStoreListWaiting,
  setUserData,
  setWorkTypesListRoomDetail,
  updateRoomDetailSuccess,
} from './actions.js';
import {
  ADD_ROOM_DETAIL,
  CREATE_ROOM_DETAIL_SUCCESS,
  DELETE_MULTIES_ROOM_DETAIL,
  DELETE_MULTIES_ROOM_DETAIL_SUCCESS,
  DELETE_ROOM_DETAIL_ROW,
  DELETE_ROOM_DETAIL_SUCCESS,
  FETCH_ROOM_DETAIL_DATA,
  FETCH_ROOM_DETAIL_INIT,
  FETCH_USER_ROOM_DETAIL,
  GET_MEETING_LOGS_BY_ID,
  INIT_INDEX_ROOM_DETAIL,
  UPDATE_ROOM_DETAIL,
  UPDATE_ROOM_DETAIL_SUCCESS,
} from './constants.js';

import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';
import { mapIdsToQueryString, mapModelRoomDetailApiToUI } from './functions.js';
import { getMetaPagingRoomDetail } from './selectors.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaRoomDetail = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 100,
  };
  const metaPaging = meta ? meta.toJSON() : metaRoomDetail;
  return `${URL_DOMAIN}/meeting-rooms?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn === 'idRoomDetail' ? 'id' : metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    departmentIds
      ? `&departmentIds=${departmentIds.join('&departmentIds=')}`
      : ''
  }${status ? `&status=${status.join('&status=')}` : ''}${
    search ? `&search=${search.trim()}` : ''
  }`;
}

export function* getRoomDetailData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingRoomDetail());
  const getRoomDetailURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when RoomDetail enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getRoomDetailURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      item.createdOn = convertShowDateTime(item.createdOn);
      item.idRoomDetail = item.id;
    });
    // dispatch to RoomDetail reducer

    yield put(getRoomDetailDataSuccess(res.data));
    yield put(setMetaRoomDetail(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomDetail info from action
 */
export function* putRoomDetailUpdate(action) {
  const urlUpdateRoomDetail = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  let roomDetail = action.roomDetail;
  try {
    const res = yield call(
      request,
      urlUpdateRoomDetail,
      option('PUT', roomDetail),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateRoomDetailSuccess(res.message));

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains RoomDetail info from action
 */
export function* postRoomDetailAdd(action) {
  const urlAddRoomDetail = `${URL_DOMAIN}/meeting-rooms`;
  let roomDetail = action.roomDetail;

  try {
    const res = yield call(
      request,
      urlAddRoomDetail,
      option('POST', roomDetail),
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

    // success redirect to RoomDetail page
    yield put(createRoomDetailSuccess(res.message));
    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexRoomDetail(action) {
  console.log(action.id);
  const urlInitIndexRoomDetail = `${URL_DOMAIN}/meeting-rooms/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexRoomDetail, option('GET'));
      console.log(mapModelRoomDetailApiToUI(res), res);
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to RoomDetail or throw exception
        const err = { message: res.message };
        throw err;
      }

      yield put(getInitIndexRoomDetailSuccess(mapModelRoomDetailApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        name: '',
        isRunning: false,
        description: '',
        totalPeople: 0,
        currentPeople: 0,
        currentMeetingLogId: 0,
        price: 0,
      };
      yield put(getInitIndexRoomDetailSuccess(mapModelRoomDetailApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getRoomDetailInit() {
  const urlStoreIdList = `${URL_DOMAIN}/users?pageNumber=1&pageSize=9999`;
  try {
    const res = yield call(request, urlStoreIdList, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemStore or throw exception
      const err = { message: res.message };
      throw err;
    }

    yield put(setUserData(res.data));
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteRoomDetail(action) {
  const urlDeleteRoomDetail = `${URL_DOMAIN}/meeting-rooms?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteRoomDetail, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to RoomDetail or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomDetail
    yield put(deleteRoomDetailSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_RoomDetail, ids: array }
 */
export function* deleteMultiesRoomDetail(action) {
  const urlDeleteRoomDetail = `${URL_DOMAIN}/meeting-rooms?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteRoomDetail, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to RoomDetail or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to RoomDetail
    yield put(deleteMultiesRoomDetailSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getMeetingLogsById(action) {
  console.log(action.id);
  const urlInitIndexRoomDetail = `${URL_DOMAIN}/meeting-logs/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexRoomDetail, option('GET'));
      console.log(res);
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to RoomDetail or throw exception
        const err = { message: res.message };
        throw err;
      }

      yield put(getInitIndexMeetingLogsSuccess(res));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* roomDetailData() {
  yield takeLatest(FETCH_USER_ROOM_DETAIL, getRoomDetailInit);
  yield takeLatest(FETCH_ROOM_DETAIL_INIT, getRoomDetailInit);
  yield takeLatest(FETCH_ROOM_DETAIL_DATA, getRoomDetailData);
  yield takeLatest(UPDATE_ROOM_DETAIL, putRoomDetailUpdate);
  yield takeLatest(ADD_ROOM_DETAIL, postRoomDetailAdd);
  yield takeLatest(INIT_INDEX_ROOM_DETAIL, getInitIndexRoomDetail);
  yield takeLatest(DELETE_ROOM_DETAIL_ROW, deleteRoomDetail);
  yield takeLatest(DELETE_MULTIES_ROOM_DETAIL, deleteMultiesRoomDetail);
  yield takeLatest(DELETE_MULTIES_ROOM_DETAIL_SUCCESS, getRoomDetailData);
  yield takeLatest(DELETE_ROOM_DETAIL_SUCCESS, getRoomDetailData);
  yield takeLatest(UPDATE_ROOM_DETAIL_SUCCESS, getRoomDetailData);
  yield takeLatest(CREATE_ROOM_DETAIL_SUCCESS, getRoomDetailData);
  yield takeLatest(GET_MEETING_LOGS_BY_ID, getMeetingLogsById);
}
