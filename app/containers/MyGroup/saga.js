import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { checkRes, option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createMarketSuccess,
  deleteMultiesMarketSuccess,
  deleteMarketSuccess,
  getInitIndexMarketSuccess,
  getMarketDataSuccess,
  invalidModel,
  setDepartmentsListMarket,
  setGenderListMarket,
  setMetaMarket,
  setStatusListMarket,
  setStoreListWaiting,
  setWorkTypesListMarket,
  updateMarketSuccess,
  setUserData,
  getFriendDataSuccess,
  deleteMultiesFriendSuccess,
  userOutGroupSuccess,
} from './actions.js';
import {
  ADD_MY_GROUP,
  CREATE_MY_GROUP_SUCCESS,
  DELETE_MULTIES_MY_GROUP,
  DELETE_MULTIES_MY_GROUP_SUCCESS,
  DELETE_MY_GROUP_ROW,
  DELETE_MY_GROUP_SUCCESS,
  FETCH_MY_GROUP_DATA,
  FETCH_MY_GROUP_INIT,
  INIT_INDEX_MY_GROUP,
  UPDATE_MY_GROUP,
  UPDATE_MY_GROUP_SUCCESS,
  REQUEST_JOIN_GROUP,
  GET_FRIEND_DATA,
  DELETE_MULTIES_FRIEND,
  DELETE_MULTIES_FRIEND_SUCCESS,
  USER_OUT_GROUP,
  USER_OUT_GROUP_SUCCESS,
  REQUEST_ADD_FRIEND,
} from './constants.js';

import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';
import { mapIdsToQueryString, mapModelMarketApiToUI } from './functions.js';
import { getMetaPagingMarket } from './selectors.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';

export function getMeta(meta, departmentIds, status, search) {
  const userId = localstoreUtilites.getUserIdFromLocalStorage();
  const metaMarket = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 100,
  };
  const metaPaging = meta ? meta.toJSON() : metaMarket;
  return `${URL_DOMAIN}/departments?getAll=true${
    search ? `&search=${search.trim()}` : ''
  }${userId ? `&userId=${Number(userId)}` : ''}`;
}

export function* getMarketData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingMarket());
  const getMarketURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when Market enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getMarketURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    // dispatch to Market reducer

    yield put(getMarketDataSuccess(res.data));
    yield put(setMetaMarket(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Market info from action
 */
export function* putMarketUpdate(action) {
  const urlUpdateMarket = `${URL_DOMAIN}/item-nft-users/${action.id}`;
  let myGroup = action.myGroup;
  try {
    const res = yield call(request, urlUpdateMarket, option('PUT', myGroup));
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateMarketSuccess(res.message));

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Market info from action
 */
export function* postMarketAdd(action) {
  const urlAddMarket = `${URL_DOMAIN}/meeting-rooms`;
  let myGroup = action.myGroup;

  try {
    const res = yield call(request, urlAddMarket, option('POST', myGroup));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // success redirect to Market page
    yield put(createMarketSuccess(res.message));
    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexMarket(action) {
  const urlInitIndexMarket = `${URL_DOMAIN}/item-nft-users/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexMarket, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to Market or throw exception
        const err = { message: res.message };
        throw err;
      }

      yield put(getInitIndexMarketSuccess(mapModelMarketApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        address: '',
        name: '',
        description: '',
        image: '',
        mana: 0,
        aliasId: '',
        price: 0,
        status: 0,
        itemNftId: 0,
        userId: 0,
      };
      yield put(getInitIndexMarketSuccess(mapModelMarketApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getMarketInit() {
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
export function* deleteMarket(action) {
  const urlDeleteMarket = `${URL_DOMAIN}/meeting-rooms?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteMarket, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to Market or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Market
    yield put(deleteMarketSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_Market, ids: array }
 */
export function* deleteMultiesMarket(action) {
  const urlDeleteMarket = `${URL_DOMAIN}/meeting-rooms?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteMarket, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to Market or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Market
    yield put(deleteMultiesMarketSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* requestJoinGroup(action) {
  const urlAddMarket = `${URL_DOMAIN}/departments/${action.id}/join-group?userId=${action.userId}`;

  try {
    const res = yield call(request, urlAddMarket, option('POST', {}));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getFriendData(action) {
  const userId = localstoreUtilites.getUserIdFromLocalStorage();

  const url = `${URL_DOMAIN}/friends?getAll=true${
    userId ? `&userId=${Number(userId)}` : ''
  }`;

  try {
    const res = yield call(request, url.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    // dispatch to Market reducer

    yield put(getFriendDataSuccess(res.data));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMultiesFriend(action) {
  const urlDeleteMarket = `${URL_DOMAIN}/friends?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteMarket, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to Market or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Market
    yield put(deleteMultiesFriendSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* userOutGroup(action) {
  const url = `${URL_DOMAIN}/users/${action.id}/out-group?groupId=${action.groupId}`;

  try {
    const res = yield call(request, url.trim(), option('POST', {}));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to Market or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Market
    yield put(userOutGroupSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* requestAddFriend(action) {
  const url = `${URL_DOMAIN}/friends/add-friend?userId1=${action.userId1}&userId2=${action.userId2}`;

  try {
    const res = yield call(request, url.trim(), option('POST', {}));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* myGroupData() {
  yield takeLatest(FETCH_MY_GROUP_INIT, getMarketInit);
  yield takeLatest(FETCH_MY_GROUP_DATA, getMarketData);
  yield takeLatest(UPDATE_MY_GROUP, putMarketUpdate);
  yield takeLatest(ADD_MY_GROUP, postMarketAdd);
  yield takeLatest(REQUEST_JOIN_GROUP, requestJoinGroup);
  yield takeLatest(INIT_INDEX_MY_GROUP, getInitIndexMarket);
  yield takeLatest(DELETE_MY_GROUP_ROW, deleteMarket);
  yield takeLatest(DELETE_MULTIES_MY_GROUP, deleteMultiesMarket);
  yield takeLatest(DELETE_MULTIES_MY_GROUP_SUCCESS, getMarketData);
  yield takeLatest(DELETE_MY_GROUP_SUCCESS, getMarketData);
  yield takeLatest(UPDATE_MY_GROUP_SUCCESS, getMarketData);
  yield takeLatest(CREATE_MY_GROUP_SUCCESS, getMarketData);

  yield takeLatest(GET_FRIEND_DATA, getFriendData);
  yield takeLatest(DELETE_MULTIES_FRIEND, deleteMultiesFriend);
  yield takeLatest(DELETE_MULTIES_FRIEND_SUCCESS, getFriendData);

  yield takeLatest(USER_OUT_GROUP, userOutGroup);
  yield takeLatest(USER_OUT_GROUP_SUCCESS, getMarketInit);

  yield takeLatest(REQUEST_ADD_FRIEND, requestAddFriend);
}
