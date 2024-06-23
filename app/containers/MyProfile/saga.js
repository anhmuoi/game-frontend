import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  UPDATE_MY_PROFILE,
  ADD_MY_PROFILE,
  INIT_INDEX_MY_PROFILE,
  DELETE_MY_PROFILE_ROW,
  DELETE_MULTIES_MY_PROFILE,
  FETCH_MY_PROFILE_DATA,
  DELETE_MULTIES_MY_PROFILE_SUCCESS,
  DELETE_MY_PROFILE_SUCCESS,
  UPDATE_MY_PROFILE_SUCCESS,
  CREATE_MY_PROFILE_SUCCESS,
  FETCH_MY_PROFILE_INIT,
  EXPORT_MY_PROFILE,
  IMPORT_MY_PROFILE,
} from './constants';
import {
  getMyProfileDataSuccess,
  getInitIndexMyProfileSuccess,
  invalidModel,
  createMyProfileSuccess,
  updateMyProfileSuccess,
  deleteMyProfileSuccess,
  setMetaMyProfile,
  deleteMultiesMyProfileSuccess,
  setStatusListMyProfile,
  setGenderListMyProfile,
  setRoleListMyProfile,
  setDepartmentsListMyProfile,
} from './actions';

import { getMetaPagingMyProfile, getRolesListData } from './selectors';
import { mapIdsToQueryString, mapModelMyProfileApiToUI } from './functions.js';
import { notifySuccess } from '../App/actions.js';
import { getFullTime } from '../App/appUtilities.js';
import {
  convertShowDateTime,
  formatDateToSend,
  formatDateUtils,
} from '../../utils/utils.js';

export function getMeta(meta, departmentIds, status, search) {
  const metaMyProfile = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaMyProfile;
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

export function* getMyProfileData(action) {
  const departmentIds = action.departmentIds;
  const status = action.status;
  const search = action.search;
  const meta = yield select(getMetaPagingMyProfile());
  const getMyProfileURL = getMeta(meta, departmentIds, status, search);

  try {
    // Debouncing when MyProfile enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getMyProfileURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      item.expiredDate = convertShowDateTime(item.expiredDate);
    });
    // dispatch to MyProfile reducer

    yield put(getMyProfileDataSuccess(res.data));
    yield put(setMetaMyProfile(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains MyProfile info from action
 */
export function* putMyProfileUpdate(action) {
  const urlUpdateMyProfile = `${URL_DOMAIN}/users/${action.id}`;
  let myProfile = action.myProfile;
  try {
    const res = yield call(
      request,
      urlUpdateMyProfile,
      option('PUT', myProfile),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(notifySuccess(res.message));
    yield put(updateMyProfileSuccess(res.message));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains MyProfile info from action
 */
export function* postMyProfileAdd(action) {
  const urlAddMyProfile = `${URL_DOMAIN}/users`;
  let myProfile = action.myProfile;
  try {
    const res = yield call(request, urlAddMyProfile, option('POST', myProfile));

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
    // success redirect to MyProfile page
    yield put(createMyProfileSuccess(res.message));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexMyProfile(action) {
  const urlInitIndexMyProfile = `${URL_DOMAIN}/users/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexMyProfile, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to MyProfile or throw exception
        const err = { message: res.message };
        throw err;
      }
      res.confirmPassword = '';
      yield put(getInitIndexMyProfileSuccess(mapModelMyProfileApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const roleList = yield select(getRolesListData());
      const roleDefault = roleList.find((i) => i.isDefault === true);
      const data = {
        id: 0,
        avatar: '',
        name: '',
        userName: '1',
        phone: '',
        departmentId: null,
        position: '',
        email: '',
        status: 0,
        holiday: 0,
        password: '',
        confirmPassword: '',
        walletAddress: '',
        ownerRoom: 0,
        roleId: roleDefault !== null ? roleDefault.id : 0,
        language: 'en-US',
        timezone: 'Etc/UTC',
        createdOn: formatDateToSend(new Date()),
      };
      yield put(getInitIndexMyProfileSuccess(mapModelMyProfileApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getMyProfileInit() {
  const urlMyProfileTypes = `${URL_DOMAIN}/users/init`;
  try {
    const res = yield call(request, urlMyProfileTypes, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemMyProfile or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setStatusListMyProfile(res.myProfileStatus));
    yield put(setDepartmentsListMyProfile(res.departments));
    yield put(setRoleListMyProfile(res.roles));
    // yield put(setGenderListMyProfile(res.genders));
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteMyProfile(action) {
  const urlDeleteMyProfile = `${URL_DOMAIN}/users?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteMyProfile, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to MyProfile or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to MyProfile
    yield put(notifySuccess(res.message));
    yield put(deleteMyProfileSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_MyProfile, ids: array }
 */
export function* deleteMultiesMyProfile(action) {
  const urlDeleteMyProfile = `${URL_DOMAIN}/users?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteMyProfile, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to MyProfile or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to MyProfile
    yield put(notifySuccess(res.message));
    yield put(deleteMultiesMyProfileSuccess(res.message, action.ids));
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
          `MyProfile_${getFullTime(new Date())}.${fileType}`,
        );
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers['content-type'] }),
        );
        if (text === 'example') {
          link.download = `example.${fileType}`;
        } else {
          link.download = `MyProfile_${getFullTime(new Date())}.${fileType}`;
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
    yield getMyProfileData({ types: [], phone: null });
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield getMyProfileData({ types: [], phone: null });
    yield put(fetchApiError(e));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* myProfileData() {
  yield takeLatest(FETCH_MY_PROFILE_INIT, getMyProfileInit);
  yield takeLatest(FETCH_MY_PROFILE_DATA, getMyProfileData);
  yield takeLatest(UPDATE_MY_PROFILE, putMyProfileUpdate);
  yield takeLatest(ADD_MY_PROFILE, postMyProfileAdd);
  yield takeLatest(INIT_INDEX_MY_PROFILE, getInitIndexMyProfile);
  yield takeLatest(DELETE_MY_PROFILE_ROW, deleteMyProfile);
  yield takeLatest(DELETE_MULTIES_MY_PROFILE, deleteMultiesMyProfile);
  yield takeLatest(DELETE_MULTIES_MY_PROFILE_SUCCESS, getMyProfileData);
  yield takeLatest(DELETE_MY_PROFILE_SUCCESS, getMyProfileData);
  yield takeLatest(UPDATE_MY_PROFILE_SUCCESS, getMyProfileData);
  // yield takeLatest(CREATE_MY_PROFILE_SUCCESS, getMyProfileData);
  yield takeLatest(EXPORT_MY_PROFILE, exportFile);
  yield takeLatest(IMPORT_MY_PROFILE, importFile);
}
