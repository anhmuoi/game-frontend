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
} from './actions.js';
import {
  ADD_MARKET,
  CREATE_MARKET_SUCCESS,
  DELETE_MULTIES_MARKET,
  DELETE_MULTIES_MARKET_SUCCESS,
  DELETE_MARKET_ROW,
  DELETE_MARKET_SUCCESS,
  FETCH_MARKET_DATA,
  FETCH_MARKET_INIT,
  INIT_INDEX_MARKET,
  UPDATE_MARKET,
  UPDATE_MARKET_SUCCESS,
} from './constants.js';

import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';
import { mapIdsToQueryString, mapModelMarketApiToUI } from './functions.js';
import { getMetaPagingMarket } from './selectors.js';
import { localstoreUtilites } from '../../utils/persistenceData.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaMarket = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 100,
  };
  const metaPaging = meta ? meta.toJSON() : metaMarket;
  return `${URL_DOMAIN}/item-nft-users?status=1&getAll=true${
    search ? `&search=${search.trim()}` : ''
  }`;
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
  let market = action.market;
  try {
    const res = yield call(request, urlUpdateMarket, option('PUT', market));
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
  let market = action.market;

  try {
    const res = yield call(request, urlAddMarket, option('POST', market));

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

/**
 * Root saga manages watcher lifecycle
 */
export default function* marketData() {
  yield takeLatest(FETCH_MARKET_INIT, getMarketInit);
  yield takeLatest(FETCH_MARKET_DATA, getMarketData);
  yield takeLatest(UPDATE_MARKET, putMarketUpdate);
  yield takeLatest(ADD_MARKET, postMarketAdd);
  yield takeLatest(INIT_INDEX_MARKET, getInitIndexMarket);
  yield takeLatest(DELETE_MARKET_ROW, deleteMarket);
  yield takeLatest(DELETE_MULTIES_MARKET, deleteMultiesMarket);
  yield takeLatest(DELETE_MULTIES_MARKET_SUCCESS, getMarketData);
  yield takeLatest(DELETE_MARKET_SUCCESS, getMarketData);
  yield takeLatest(UPDATE_MARKET_SUCCESS, getMarketData);
  yield takeLatest(CREATE_MARKET_SUCCESS, getMarketData);
}
