import { takeLatest, call, put } from 'redux-saga/effects';
import timez from 'timez';
import {
  fetchApiError,
  getLogoSuccess,
  loadSuccess,
  getTimezoneSuccess,
  // patchTimezoneSuccess,
  notifySuccess,
} from './actions';
import request, { option, checkRes } from '../../utils/request';
import { URL_DOMAIN } from '../../utils/constants';
import {
  GET_LOGO,
  GET_ACCOUNT_TZ,
  PATCH_ACCOUNT_TZ,
  PATCH_HEADER_COLUMNS,
} from './constants';
import { localstoreUtilites } from '../../utils/persistenceData';
import { mapHeadersUiToApi } from './appUtilities';

export function* getLogo() {
  try {
    const url = `${URL_DOMAIN}/current-logo`;
    const res = yield call(request, url, option('GET'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(getLogoSuccess(res.logo));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* getTimezoneData() {
  try {
    const url = `${URL_DOMAIN}/accounts/get-timezone-by-standard`;
    const res = yield call(request, url, option('GET'));
    const tz = localstoreUtilites.getAccountTzFromLocalStorage();
    if (tz === null || tz === 'null') {
      // console.log('getTimezoneData', tz, timez);
      yield call(patchTimezone, { payLoad: { timeZone: timez } });
    }
    yield put(getTimezoneSuccess(res));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* patchTimezone(action) {
  try {
    const url = `${URL_DOMAIN}/accounts/update-timezone`;
    const res = yield call(request, url, option('PATCH', action.payLoad));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  } finally {
    localstoreUtilites.saveAccountTzToLocalStorage(action.payLoad.timeZone);
    window.location.reload();
  }
}

export function* patchHeaderColumns(action) {
  const url = `${URL_DOMAIN}/header`;
  try {
    const res = yield call(
      request,
      url,
      option('PATCH', mapHeadersUiToApi(action.headers)),
    );
    if (res.statusCode && checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export default function* appWatcher() {
  yield takeLatest(GET_LOGO, getLogo);
  yield takeLatest(GET_ACCOUNT_TZ, getTimezoneData);
  yield takeLatest(PATCH_ACCOUNT_TZ, patchTimezone);
  yield takeLatest(PATCH_HEADER_COLUMNS, patchHeaderColumns);
}
