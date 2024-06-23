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
  getBalanceChartSuccess,
} from './actions.js';
import {
  ADD_ANALYSIS,
  CREATE_ANALYSIS_SUCCESS,
  DELETE_MULTIES_ANALYSIS,
  DELETE_MULTIES_ANALYSIS_SUCCESS,
  DELETE_ANALYSIS_ROW,
  DELETE_ANALYSIS_SUCCESS,
  FETCH_ANALYSIS_DATA,
  FETCH_ANALYSIS_INIT,
  INIT_INDEX_ANALYSIS,
  UPDATE_ANALYSIS,
  UPDATE_ANALYSIS_SUCCESS,
  GET_BALANCE_CHART,
} from './constants.js';

import { convertShowDateTime, formatDateTimeToSendWithoutUTC, formatDateToSend } from '../../utils/utils.js';
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
  return `${URL_DOMAIN}/friends?getAll=true${
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

    res.data.map((item) => {
      item.createdOn = convertShowDateTime(item.createdOn);
      item.idMarket = item.id;
    });
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
  let analysis = action.analysis;
  try {
    const res = yield call(request, urlUpdateMarket, option('PUT', analysis));
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
  let analysis = action.analysis;

  try {
    const res = yield call(request, urlAddMarket, option('POST', analysis));

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

export function* getChartBalance(action) {
  const userId = action.userId;
  const startDate = action.startDate;
  const endDate = action.endDate;
  const url = `${URL_DOMAIN}/balances/chart?userId=${userId}&startDate=${formatDateTimeToSendWithoutUTC(
    new Date(startDate),
  )}&endDate=${formatDateTimeToSendWithoutUTC(new Date(endDate))}`;

  try {
    const res = yield call(request, url.trim(), option('GET'));

    if (!res) {
      const err = { message: res.message };
      throw err;
    }

    yield put(getBalanceChartSuccess(res));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* analysisData() {
  yield takeLatest(FETCH_ANALYSIS_INIT, getMarketInit);
  yield takeLatest(FETCH_ANALYSIS_DATA, getMarketData);
  yield takeLatest(UPDATE_ANALYSIS, putMarketUpdate);
  yield takeLatest(ADD_ANALYSIS, postMarketAdd);
  yield takeLatest(INIT_INDEX_ANALYSIS, getInitIndexMarket);
  yield takeLatest(DELETE_ANALYSIS_ROW, deleteMarket);
  yield takeLatest(DELETE_MULTIES_ANALYSIS, deleteMultiesMarket);
  yield takeLatest(DELETE_MULTIES_ANALYSIS_SUCCESS, getMarketData);
  yield takeLatest(DELETE_ANALYSIS_SUCCESS, getMarketData);
  yield takeLatest(UPDATE_ANALYSIS_SUCCESS, getMarketData);
  yield takeLatest(CREATE_ANALYSIS_SUCCESS, getMarketData);

  yield takeLatest(GET_BALANCE_CHART, getChartBalance);
}
