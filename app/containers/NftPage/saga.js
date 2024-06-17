import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import request, { option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createCouponSuccess,
  deleteCouponSuccess,
  deleteMultiesCouponSuccess,
  getCouponDataSuccess,
  getInitIndexCouponSuccess,
  getInitIndexSettingSuccess,
  getSettingCouponInitSuccess,
  invalidModel,
  invalidModelCoupon,
  setCouponListSetting,
  setMetaCoupon,
  setTypeExpiredCoupon,
  setTypeRefundCoupon,
  updateCouponSuccess,
  updateSettingSuccess,
} from './actions';
import {
  ADD_COUPON,
  CREATE_COUPON_SUCCESS,
  DELETE_COUPON_ROW,
  DELETE_COUPON_SUCCESS,
  DELETE_MULTIES_COUPON,
  DELETE_MULTIES_COUPON_SUCCESS,
  GET_COUPON_DATA,
  GET_INIT_COUPON,
  GET_ITEMNFT_INIT,
  INIT_INDEX_COUPON,
  INIT_INDEX_ITEMNFT,
  UPDATE_COUPON,
  UPDATE_COUPON_SUCCESS,
  UPDATE_ITEMNFT,
  UPDATE_ITEMNFT_SUCCESS,
} from './constants';

import { mapIdsToQueryString, mapModelSettingApiToUI } from './functions.js';
import { notifySuccess } from '../App/actions.js';
import { checkRes } from '../../utils/request.js';
import { convertShowDateTime, formatDateToSend } from '../../utils/utils.js';
import { getMetaPagingCoupon } from './selectors.js';
import { delay } from 'redux-saga';

export function* getSettingCouponInit() {
  const urlCoupon = `${URL_DOMAIN}/item-nfts?pageNumber=${1}&pageSize=${9999999}`;
  try {
    const res = yield call(request, urlCoupon, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemMembers or throw exception
      const err = { message: res.message };
      throw err;
    }

    let newRes = [];
    res.data &&
      res.data.map((item) => {
        newRes.push({ ...item, name: item.name });
      });
    yield put(setCouponListSetting(newRes));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action): payload contains Setting info from action
 */
export function* putSettingUpdate(action) {
  const urlUpdateSetting = `${URL_DOMAIN}/setting/coupon`;
  try {
    const res = yield call(
      request,
      urlUpdateSetting,
      option('PUT', action.setting),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    // yield put(updateSettingSuccess(res.message));

    // hide progress
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexSetting() {
  const urlInitIndexSetting = `${URL_DOMAIN}/setting/coupon`;
  try {
    const res = yield call(request, urlInitIndexSetting, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to Setting or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(getInitIndexSettingSuccess(mapModelSettingApiToUI(res)));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
/**
 * @param(action) object: {id: id}
 */
export function* getInitCoupon() {
  const urlInitIndexSetting = `${URL_DOMAIN}/item-nfts/init`;
  try {
    const res = yield call(request, urlInitIndexSetting, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to Setting or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setTypeExpiredCoupon(res.expiredType));
    yield put(setTypeRefundCoupon(res.refundType));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexCoupon(action) {
  const urlInitIndexCoupon = `${URL_DOMAIN}/item-nfts/${action.id}`;
  try {
    if (action.id !== null) {
      const res = yield call(request, urlInitIndexCoupon, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to Coupon or throw exception
        const err = { message: res.message };
        throw err;
      }
      if (res.expiredDateOption) {
        res.expiredDateOption = convertShowDateTime(res.expiredDateOption);
      }

      yield put(getInitIndexCouponSuccess(mapModelSettingApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        name: '',
        description: '',
        image: '',
        mana: 0,
        aliasId: '',
      };
      yield put(getInitIndexCouponSuccess(mapModelSettingApiToUI(data)));
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Coupon info from action
 */
export function* putCouponUpdate(action) {
  const urlUpdateCoupon = `${URL_DOMAIN}/item-nfts/${action.id}`;
  let coupon = action.coupon;
  if (coupon.expiredDateOption) {
    coupon.expiredDateOption = formatDateToSend(coupon.expiredDateOption);
  }
  try {
    const res = yield call(request, urlUpdateCoupon, option('PUT', coupon));
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModelCoupon(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Coupon info from action
 */
export function* postCouponAdd(action) {
  const urlAddCoupon = `${URL_DOMAIN}/item-nfts`;

  let coupon = action.coupon;
  if (coupon.expiredDateOption) {
    coupon.expiredDateOption = formatDateToSend(coupon.expiredDateOption);
  }
  try {
    const res = yield call(request, urlAddCoupon, option('POST', coupon));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModelCoupon(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // success redirect to Coupon page
    yield put(createCouponSuccess(res.message));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteCoupon(action) {
  console.log(action.id);
  const urlDeleteCoupon = `${URL_DOMAIN}/item-nfts/${action.id}`;
  try {
    const res = yield call(request, urlDeleteCoupon, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to Coupon or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Coupon
    yield put(deleteCouponSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

// coupon table
export function getMeta(meta, title) {
  const metaCoupon = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaCoupon;
  return `${URL_DOMAIN}/item-nfts?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    title ? `&title=${title.trim()}` : ''
  }`;
}

export function* getCouponData(action) {
  const title = action.title;
  const meta = yield select(getMetaPagingCoupon());
  const getCouponURL = getMeta(meta, title);

  try {
    // Debouncing when coupon enter search box
    if (title) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getCouponURL, option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    // dispatch to coupon reducer
    yield put(getCouponDataSuccess(res.data));
    yield put(setMetaCoupon(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMultiesCoupon(action) {
  const urlDeleteStore = `${URL_DOMAIN}/item-nfts?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteStore, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to Store or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Store
    yield put(deleteMultiesCouponSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

function* handleActionCouponSuccess(action) {
  yield all([getCouponData(action), getSettingCouponInit(action)]);
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* setting() {
  yield takeLatest(GET_ITEMNFT_INIT, getSettingCouponInit);
  yield takeLatest(UPDATE_ITEMNFT, putSettingUpdate);
  yield takeLatest(UPDATE_ITEMNFT_SUCCESS, getInitIndexSetting);
  yield takeLatest(INIT_INDEX_COUPON, getInitIndexCoupon);
  yield takeLatest(INIT_INDEX_ITEMNFT, getInitIndexSetting);

  yield takeLatest(DELETE_COUPON_ROW, deleteCoupon);

  yield takeLatest(GET_INIT_COUPON, getInitCoupon);
  yield takeLatest(DELETE_COUPON_SUCCESS, handleActionCouponSuccess);
  yield takeLatest(UPDATE_COUPON, putCouponUpdate);
  yield takeLatest(ADD_COUPON, postCouponAdd);
  yield takeLatest(UPDATE_COUPON_SUCCESS, handleActionCouponSuccess);
  yield takeLatest(CREATE_COUPON_SUCCESS, handleActionCouponSuccess);

  // coupon table
  yield takeLatest(GET_COUPON_DATA, getCouponData);
  yield takeLatest(DELETE_MULTIES_COUPON, deleteMultiesCoupon);
  yield takeLatest(DELETE_MULTIES_COUPON_SUCCESS, handleActionCouponSuccess);
}
