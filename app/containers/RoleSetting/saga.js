import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchApiError,
  loadSuccess,
  notifySuccess,
} from 'containers/App/actions';

import request, { option, checkRes } from 'utils/request';
import { URL_DOMAIN } from 'utils/constants';
import {
  getRoleListSuccess,
  getIndexRoleSuccess,
  // postAddRoleSuccess,
  // putEditRoleSuccess,
  // deleteRolesSuccess,
  resetSimilarId,
  getRoleList,
} from './actions';
import {
  GET_ROLE_LIST,
  GET_INDEX_ROLE,
  DELETE_ROLES,
  ADD_NEW_ROLE,
  EDIT_ROLE,
  SAVE_PERMISSION,
  // ADD_NEW_ROLE_SUCCESS,
  // EDIT_ROLE_SUCCESS,
  // DELETE_ROLES_SUCCESS,
  CHANGE_DEFAULT_ROLE,
} from './constants';

import { makeSelectSimilarId } from './selectors';

export function* getRoleListSaga() {
  const url = `${URL_DOMAIN}/roles?pageSize=9999`;
  try {
    const res = yield call(request, url, option('GET'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }

    yield put(getRoleListSuccess(res.data));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getIndexRole(action) {
  const url = `${URL_DOMAIN}/roles/${action.id}`;
  try {
    const res = yield call(request, url, option('GET'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(getIndexRoleSuccess(res));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteRoles(action) {
  const url = `${URL_DOMAIN}/roles?${action.ids
    .map(id => `ids=${id}`)
    .join('&')}`;
  try {
    const res = yield call(request, url, option('DELETE'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    // yield put(deleteRolesSuccess());
    yield put(getRoleList());
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* postAddRole(action) {
  const similarId = yield select(makeSelectSimilarId());
  const url = `${URL_DOMAIN}/roles?similarId=${similarId}`;
  try {
    const res = yield call(request, url, option('POST', action.role));
    if (checkRes(res.statusCode)) {
      const err = { messages: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    // yield put(postAddRoleSuccess());
    yield put(getRoleList());
    yield put(resetSimilarId());
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* putEditRole(action) {
  const similarId = yield select(makeSelectSimilarId());
  const url = `${URL_DOMAIN}/roles/${action.id}?similarId=${similarId}`;
  try {
    const res = yield call(request, url, option('PUT', action.role));
    if (checkRes(res.statusCode)) {
      const err = { messages: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    // yield put(putEditRoleSuccess());
    yield put(getRoleList());
    yield put(resetSimilarId());
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* putEditPermission(action) {
  const url = `${URL_DOMAIN}/roles/${action.id}`;
  try {
    const res = yield call(request, url, option('PUT', action.role));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError);
  }
}

export function* postDefaultRole(action) {
  const url = `${URL_DOMAIN}/roles/${action.id}/default-setting`;
  try {
    const res = yield call(request, url, option('POST'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(getRoleList());
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError);
  }
}

export default function* roleSettingWatcher() {
  yield takeLatest(GET_ROLE_LIST, getRoleListSaga);
  // yield takeLatest(ADD_NEW_ROLE_SUCCESS, getRoleList);
  // yield takeLatest(EDIT_ROLE_SUCCESS, getRoleList);
  // yield takeLatest(DELETE_ROLES_SUCCESS, getRoleList);
  yield takeLatest(GET_INDEX_ROLE, getIndexRole);
  yield takeLatest(DELETE_ROLES, deleteRoles);
  yield takeLatest(ADD_NEW_ROLE, postAddRole);
  yield takeLatest(EDIT_ROLE, putEditRole);
  yield takeLatest(SAVE_PERMISSION, putEditPermission);
  yield takeLatest(CHANGE_DEFAULT_ROLE, postDefaultRole);
}
