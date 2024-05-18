import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import {
  fetchApiError,
  loadSuccess,
  notifySuccess,
} from 'containers/App/actions';
import { URL_DOMAIN } from 'utils/constants';
import { isPluginEnabled } from 'utils/plugins';
import {
  GET_DEPARTMENT,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT_ROW,
  DELETE_MULTIES_DEPARTMENT,
  UPDATE_DEPARTMENT,
  EXPORT_DEPARTMENT,
  IMPORT_DEPARTMENT,
  GET_USER_LIST,
} from './constants';
import { getMetaDepartment, getUserMeta } from './selectors';
import {
  fetchDepartmentsSuccess,
  setMetaPagingDepartment,
  invalidModel,
  // addDepartmentSuccess,
  deleteDepartmentSuccess,
  deleteMultiesDepartmentSucces,
  // updateDepartmentSuccess,
  hideModal,
  getAccountSuccess,
  getUserListSuccess,
} from './actions';
import { getFullTime } from '../App/appUtilities';

export function getURL(meta, search) {
  const metaStore = {
    sortColumn: 0,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaStore;
  return `${URL_DOMAIN}/departments?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    search ? `&search=${search.trim()}` : ''
  }`;
}

export const mapIdsToQueryString = (ids) =>
  ids.map((id) => `ids=${id}`).join('&');

export function* getDepartments(action) {
  const { search } = action.paging;
  const meta = yield select(getMetaDepartment());
  const getDepartmentURL = getURL(meta, search);
  try {
    if (search) {
      yield delay(1000);
    }
    const res = yield call(request, getDepartmentURL, option('GET'));
    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }

    // console.log(res);
    yield call(getAccountData);
    // const departments = res.data.map(dep => {
    //   const manager = accounts.find(
    //     acc => `${acc.id}` === `${dep.departmentManagerId}`,
    //   );
    //   return {
    //     ...dep,
    //     managerEmail: manager ? manager.email : '',
    //   };
    // });
    // const metaData = {
    //   ...res.meta,
    //   accounts: accounts.map(acc => ({
    //     id: acc.id,
    //     name: acc.email,
    //   })),
    // };
    yield delay(800);
    yield put(fetchDepartmentsSuccess(res.data));
    yield put(setMetaPagingDepartment(res.meta));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* postDepartmentAdd(action) {
  const urlAddDepartment = `${URL_DOMAIN}/departments`;
  try {
    const res = yield call(
      request,
      urlAddDepartment,
      option('POST', action.department),
    );

    if (res.statusCode === responseCode.validationFailed) {
      yield put(invalidModel(res.errors));
      return;
    }
    // yield put(addDepartmentSuccess(res.message));
    yield put(notifySuccess(res.message));
    yield put(hideModal());
    yield getDepartments({ paging: {} });
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* updateDepartment(action) {
  const urlAddDepartment = `${URL_DOMAIN}/departments/${action.department.id}`;
  try {
    const res = yield call(
      request,
      urlAddDepartment,
      option('PUT', action.department),
    );

    if (res.statusCode === responseCode.validationFailed) {
      yield put(invalidModel(res.errors));
      return;
    }
    // yield put(updateDepartmentSuccess(res.message));
    yield put(notifySuccess(res.message));
    yield put(hideModal());
    yield getDepartments({ paging: {} });
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteDepartment(action) {
  const urlDeleteDepartment = `${URL_DOMAIN}/departments/${action.id}`;
  try {
    const res = yield call(request, urlDeleteDepartment, option('DELETE'));
    // console.log(res);
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to user or throw exception
      const err = { message: res.message };
      throw err;
    }
    // notify to user
    yield put(deleteDepartmentSuccess(res.message, action.id));
    yield put(notifySuccess(res.message));
    yield delay(800);
    yield getDepartments({ paging: {} });
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMultiesDepartment(action) {
  const urlDeleteMutltiesDepartment = `${URL_DOMAIN}/departments?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(
      request,
      urlDeleteMutltiesDepartment,
      option('DELETE'),
    );
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to user or throw exception
      const err = { message: res.message };
      throw err;
    }
    // notify to user
    yield put(deleteMultiesDepartmentSucces(res.message, action.ids));
    yield put(notifySuccess(res.message));
    yield getDepartments({ paging: {} });
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

const makeSaveFileFunc = (fileType) => {
  const saveFile = (response) => {
    if (response.status === responseCode.ok) {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(
          new Blob([response.data], { type: response.headers['content-type'] }),
          `Department_${getFullTime(new Date())}.${fileType}`,
        );
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers['content-type'] }),
        );
        link.download = `Department_${getFullTime(new Date())}.${fileType}`;
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
  const meta = yield select(getMetaDepartment());
  const url = `${URL_DOMAIN}/departments/export?type=${
    action.fileType === 'excel' ? 'excel' : 'csv'
  }&search=${meta.toJS().search ? meta.toJS().search : ''}&sortColumn=${
    meta.toJS().sortColumn
  }&sortDirection=${meta.toJS().sortDirection}`;
  try {
    const res = yield call(
      request,
      url,
      option('GET', null, 'blob'),
      makeSaveFileFunc(action.fileType === 'excel' ? 'xlsx' : 'csv'),
    );
    if (res.status !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

function* importFile(action) {
  const url = `${URL_DOMAIN}/departments/import?type=${action.fileType}`;
  try {
    const formData = new FormData();
    formData.append('file', action.file);
    const res = yield call(request, url, option('POST', formData));
    yield getDepartments({ paging: {} });
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }
    yield put(notifySuccess(res.message));
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* getAccountData() {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/users/pageSize=999999`,
      option('GET'),
    );

    if (checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }

    const options = res.data.map((acc) => ({
      id: acc.id,
      name: acc.email,
    }));
    yield put(getAccountSuccess(options));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getUserList() {
  const meta = yield select(getUserMeta());
  const extendUrl = isPluginEnabled('armyManagement')
    ? '/army-users'
    : '/users';
  const {
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    search,
  } = meta.toJS();
  const url = `${URL_DOMAIN}${extendUrl}?isValid=0&pageNumber=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortDirection=${sortDirection}&search=${search}`;
  if (search) {
    yield delay(1000);
  }
  try {
    const res = yield call(request, url, option('GET'));
    if (res.statusCode && checkRes(res.statusCode)) {
      const err = { message: res.message };
      throw err;
    }
    const { data, header } = res;
    console.log(res);
    yield put(getUserListSuccess(data, res.meta, header));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* departmentDatas() {
  yield takeLatest(GET_DEPARTMENT, getDepartments);
  yield takeLatest(ADD_DEPARTMENT, postDepartmentAdd);
  yield takeLatest(DELETE_DEPARTMENT_ROW, deleteDepartment);
  yield takeLatest(DELETE_MULTIES_DEPARTMENT, deleteMultiesDepartment);
  yield takeLatest(UPDATE_DEPARTMENT, updateDepartment);
  yield takeLatest(EXPORT_DEPARTMENT, exportFile);
  yield takeLatest(IMPORT_DEPARTMENT, importFile);
  yield takeLatest(GET_USER_LIST, getUserList);
}
