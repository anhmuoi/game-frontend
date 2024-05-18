import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  UPDATE_ACCOUNT,
  ADD_ACCOUNT,
  INIT_INDEX_ACCOUNT,
  DELETE_ACCOUNT_ROW,
  DELETE_MULTIES_ACCOUNT,
  FETCH_ACCOUNT_INIT,
  DELETE_MULTIES_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_SUCCESS,
} from './constants';
import {
  getAccountDataSuccess,
  getInitIndexAccountSuccess,
  invalidModel,
  createAccountSuccess,
  updateAccountSuccess,
  deleteAccountSuccess,
  setMetaAccount,
  deleteMultiesAccountSucces,
} from './actions';
import {
  mapModelAccountApiToUI,
  mapIdsToQueryString,
} from './accountUtilities';
import { getMetaPagingAccount } from './selectors';

export function getMeta(meta, search) {
  const metaStore = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaStore;
  return `${URL_DOMAIN}/accounts?pageNumber=${metaPaging.pageNumber}&pageSize=${
    metaPaging.pageSize
  }&sortColumn=${metaPaging.sortColumn}&sortDirection=${
    metaPaging.sortDirection
  }${search ? `&search=${search.trim()}` : ''}`;
}

export function* getAccountDataInit(action) {
  const search = action.searchText;
  const meta = yield select(getMetaPagingAccount());
  const getAccountURL = getMeta(meta, search);

  try {
    // Debouncing when Account enter search box
    if (search) {
      yield call(delay, 2000);
    }
    // Call our request helper (see 'utils/request')
    const res = yield call(request, getAccountURL, option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }
    // dispatch to Account reducer
    yield put(getAccountDataSuccess(res.data));
    yield put(setMetaAccount(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Account info from action
 */
export function* putAccountUpdate(action) {
  const urlUpdateAccount = `${URL_DOMAIN}/accounts/${action.id}`;
  try {
    const res = yield call(
      request,
      urlUpdateAccount,
      option('PUT', action.account),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateAccountSuccess(res.message));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains Account info from action
 */
export function* postAccountAdd(action) {
  const urlAddAccount = `${URL_DOMAIN}/accounts`;
  try {
    const res = yield call(
      request,
      urlAddAccount,
      option('POST', action.account),
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

    // success redirect to Account page
    yield put(createAccountSuccess(res.message));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexAccount(action) {
  const urlInitIndexAccount = `${URL_DOMAIN}/accounts/${action.id}`;
  try {
    const res = yield call(request, urlInitIndexAccount, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to Account or throw exception
      const err = { message: res.message };
      throw err;
    }
    const accountTypes = yield call(getAccountTypes);

    const data = {
      ...res,
      roleList: accountTypes,
    };
    // console.log(data);
    yield put(getInitIndexAccountSuccess(mapModelAccountApiToUI(data)));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getAccountTypes() {
  const urlAccountTypes = `${URL_DOMAIN}/accounts/type`;
  try {
    const res = yield call(request, urlAccountTypes, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemAccount or throw exception
      const err = { message: res.message };
      throw err;
    }
    return res;
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteAccount(action) {
  const urlDeleteAccount = `${URL_DOMAIN}/accounts?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteAccount, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to Account or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Account
    yield put(deleteAccountSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_ACCOUNT, ids: array }
 */
export function* deleteMultiesAccount(action) {
  const urlDeleteAccount = `${URL_DOMAIN}/accounts?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteAccount, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to Account or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to Account
    yield put(deleteMultiesAccountSucces(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* accountData() {
  yield takeLatest(FETCH_ACCOUNT_INIT, getAccountDataInit);
  yield takeLatest(UPDATE_ACCOUNT, putAccountUpdate);
  yield takeLatest(ADD_ACCOUNT, postAccountAdd);
  yield takeLatest(INIT_INDEX_ACCOUNT, getInitIndexAccount);
  yield takeLatest(DELETE_ACCOUNT_ROW, deleteAccount);
  yield takeLatest(DELETE_MULTIES_ACCOUNT, deleteMultiesAccount);
  yield takeLatest(DELETE_MULTIES_ACCOUNT_SUCCESS, getAccountDataInit);
  yield takeLatest(DELETE_ACCOUNT_SUCCESS, getAccountDataInit);
  yield takeLatest(UPDATE_ACCOUNT_SUCCESS, getAccountDataInit);
  yield takeLatest(CREATE_ACCOUNT_SUCCESS, getAccountDataInit);
}
