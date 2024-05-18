import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  UPDATE_USER,
  ADD_USER,
  INIT_INDEX_USER,
  DELETE_USER_ROW,
  DELETE_MULTIES_USER,
  FETCH_USER_DATA,
  DELETE_MULTIES_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  CREATE_USER_SUCCESS,
  FETCH_USER_INIT,
  EXPORT_USER,
  IMPORT_USER,
} from './constants';
import {
  getUserDataSuccess,
  getInitIndexUserSuccess,
  invalidModel,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  setMetaUser,
  deleteMultiesUserSuccess,
  setStatusListUser,
  setGenderListUser,
  setRoleListUser,
  setDepartmentsListUser,
} from './actions';

import { getMetaPagingUser, getRolesListData } from './selectors';
import { mapIdsToQueryString, mapModelUserApiToUI } from './functions.js';
import { notifySuccess } from '../App/actions.js';
import { getFullTime } from '../App/appUtilities.js';
import {
  convertShowDateTime,
  formatDateToSend,
  formatDateUtils,
} from '../../utils/utils.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaUser = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaUser;
  return `${URL_DOMAIN}/users?pageNumber=${metaPaging.pageNumber}&pageSize=${
    metaPaging.pageSize
  }&sortColumn=${metaPaging.sortColumn}&sortDirection=${
    metaPaging.sortDirection
  }${
    departmentIds
      ? `&departmentIds=${departmentIds.join('&departmentIds=')}`
      : ''
  }${status ? `&status=${status.join('&status=')}` : ''}${
    search ? `&search=${search.trim()}` : ''
  }`;
}

export function* getUserData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingUser());
  const getUserURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when User enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getUserURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      item.expiredDate = convertShowDateTime(item.expiredDate);
    });
    // dispatch to User reducer

    yield put(getUserDataSuccess(res.data));
    yield put(setMetaUser(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains User info from action
 */
export function* putUserUpdate(action) {
  const urlUpdateUser = `${URL_DOMAIN}/users/${action.id}`;
  let user = action.user;
  try {
    const res = yield call(request, urlUpdateUser, option('PUT', user));
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(notifySuccess(res.message));
    yield put(updateUserSuccess(res.message));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains User info from action
 */
export function* postUserAdd(action) {
  const urlAddUser = `${URL_DOMAIN}/users`;
  let user = action.user;
  try {
    const res = yield call(request, urlAddUser, option('POST', user));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    // success redirect to User page
    yield put(createUserSuccess(res.message));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexUser(action) {
  const urlInitIndexUser = `${URL_DOMAIN}/users/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexUser, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to User or throw exception
        const err = { message: res.message };
        throw err;
      }
      res.confirmPassword = '';
      yield put(getInitIndexUserSuccess(mapModelUserApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const roleList = yield select(getRolesListData());
      const roleDefault = roleList.find((i) => i.isDefault === true);
      const data = {
        avatar: '',
        name: '',
        userName: '',
        phone: '',
        departmentId: null,
        position: '',
        email: '',
        status: 0,
        holiday: 0,
        password: '',
        confirmPassword: '',
        roleId: roleDefault !== null ? roleDefault.id : 0,
        language: 'en-US',
        timezone: 'Etc/UTC',
        createdOn: formatDateToSend(new Date()),
      };
      yield put(getInitIndexUserSuccess(mapModelUserApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getUserInit() {
  const urlUserTypes = `${URL_DOMAIN}/users/init`;
  try {
    const res = yield call(request, urlUserTypes, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemUser or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setStatusListUser(res.userStatus));
    yield put(setDepartmentsListUser(res.departments));
    yield put(setRoleListUser(res.roles));
    // yield put(setGenderListUser(res.genders));
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteUser(action) {
  const urlDeleteUser = `${URL_DOMAIN}/users?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteUser, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to User or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to User
    yield put(notifySuccess(res.message));
    yield put(deleteUserSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_User, ids: array }
 */
export function* deleteMultiesUser(action) {
  const urlDeleteUser = `${URL_DOMAIN}/users?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteUser, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to User or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to User
    yield put(notifySuccess(res.message));
    yield put(deleteMultiesUserSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

const makeSaveFileFunc = (fileType, text) => {
  const saveFile = (response) => {
    if (response.status === responseCode.ok) {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(
          new Blob([response.data], { type: response.headers['content-type'] }),
          `User_${getFullTime(new Date())}.${fileType}`,
        );
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers['content-type'] }),
        );
        if (text === 'example') {
          link.download = `example.${fileType}`;
        } else {
          link.download = `User_${getFullTime(new Date())}.${fileType}`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    return response;
  };
  return saveFile;
};

function* exportFile(action) {
  let url = `${URL_DOMAIN}/users/export?type=${action.fileType.trim()}`;
  if (action.text === 'example') {
    url = `${URL_DOMAIN}/users/import/file-template`;
  }
  try {
    const res = yield call(
      request,
      url,
      option('GET', null, 'blob'),
      makeSaveFileFunc(
        action.fileType === 'excel' ? 'xlsx' : 'csv',
        action.text,
      ),
    );
    if (res.status !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

function* importFile(action) {
  const url = `${URL_DOMAIN}/users/import?type=${action.fileType}`;
  try {
    const formData = new FormData();
    formData.append('file', action.file);
    const res = yield call(request, url, option('POST', formData));
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }
    yield getUserData({ types: [], phone: null });
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield getUserData({ types: [], phone: null });
    yield put(fetchApiError(e));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userData() {
  yield takeLatest(FETCH_USER_INIT, getUserInit);
  yield takeLatest(FETCH_USER_DATA, getUserData);
  yield takeLatest(UPDATE_USER, putUserUpdate);
  yield takeLatest(ADD_USER, postUserAdd);
  yield takeLatest(INIT_INDEX_USER, getInitIndexUser);
  yield takeLatest(DELETE_USER_ROW, deleteUser);
  yield takeLatest(DELETE_MULTIES_USER, deleteMultiesUser);
  yield takeLatest(DELETE_MULTIES_USER_SUCCESS, getUserData);
  yield takeLatest(DELETE_USER_SUCCESS, getUserData);
  // yield takeLatest(UPDATE_USER_SUCCESS, getUserData);
  // yield takeLatest(CREATE_USER_SUCCESS, getUserData);
  yield takeLatest(EXPORT_USER, exportFile);
  yield takeLatest(IMPORT_USER, importFile);
}
