import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request, { checkRes, option, responseCode } from 'utils/request';

import { URL_DOMAIN } from 'utils/constants';

import {
  createDailyReportSuccess,
  deleteDailyReportSuccess,
  deleteMultiesDailyReportSuccess,
  getDailyReportDataSuccess,
  getInitIndexDailyReportSuccess,
  getUserDataSuccess,
  invalidModel,
  setDepartmentList,
  setFolderLogList,
  setMetaDailyReport,
  setReporterList,
  updateDailyReportSuccess,
} from './actions';
import {
  ADD_DAILY_REPORT,
  CREATE_DAILY_REPORT_SUCCESS,
  DELETE_DAILY_REPORT_ROW,
  DELETE_DAILY_REPORT_SUCCESS,
  DELETE_MULTIES_DAILY_REPORT,
  DELETE_MULTIES_DAILY_REPORT_SUCCESS,
  FETCH_DAILY_REPORT_DATA,
  FETCH_DAILY_REPORT_INIT,
  GET_INDEX_DAILY_REPORT_BY_USER,
  INIT_INDEX_DAILY_REPORT,
  UPDATE_DAILY_REPORT,
  UPDATE_DAILY_REPORT_SUCCESS,
} from './constants';

import {
  convertShowDate,
  convertShowDateTime,
  formatDateTimeToSend,
  formatDateToSend,
} from '../../utils/utils.js';
import {
  mapIdsToQueryString,
  mapModelDailyReportApiToUI,
} from './functions.js';
import { getFilterSelector, getMetaPagingDailyReport } from './selectors';
import { localstoreUtilites } from '../../utils/persistenceData.js';

export function* getInit() {
  const url = `${URL_DOMAIN}/daily-reports/init`;
  try {
    const res = yield call(request, url, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemCATEGORY or throw exception
      const err = { message: res.message };
      throw err;
    }

    const newDate = new Date(new Date().setHours(0, 0, 0, 0));
    let dateStr =
      ('00' + (newDate.getMonth() + 1)).slice(-2) +
      '.' +
      ('00' + newDate.getDate()).slice(-2) +
      '.' +
      newDate.getFullYear() +
      ' ' +
      ('00' + newDate.getHours()).slice(-2) +
      ':' +
      ('00' + newDate.getMinutes()).slice(-2) +
      ':' +
      ('00' + newDate.getSeconds()).slice(-2);
    const urlGetByUser = `${URL_DOMAIN}/daily-reports/by-user?userId=${localstoreUtilites.getUserIdFromLocalStorage()}&date=${dateStr}`;

    const resDataByUser = yield call(request, urlGetByUser, option('GET'));
    if (resDataByUser.date) {
      resDataByUser.date = convertShowDateTime(resDataByUser.date);
    }
    yield put(
      getInitIndexDailyReportSuccess(mapModelDailyReportApiToUI(resDataByUser)),
    );
    yield put(setReporterList(res.reporter));
    yield put(setFolderLogList(res.folderLog));
    yield put(setDepartmentList(res.departments));
    yield getUserData();

    return res;
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

export function getMeta(
  meta,
  userIds,
  folderLogs,
  reporters,
  departments,
  search,
  startDate,
  endDate,
) {
  const metaDailyReport = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaDailyReport;
  return `${URL_DOMAIN}/daily-reports?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn === 'idDailyReport' ? 'id' : metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    userIds ? `&userIds=${userIds.join('&userIds=')}` : ''
  }&sortDirection=${metaPaging.sortDirection}${
    reporters ? `&reporters=${reporters.join('&reporters=')}` : ''
  }${folderLogs ? `&folderLogs=${folderLogs.join('&folderLogs=')}` : ''}${
    departments ? `&departmentIds=${departments.join('&departmentIds=')}` : ''
  }${search ? `&search=${search.trim()}` : ''}${
    startDate ? `&start=${startDate.trim()}` : ''
  }${endDate ? `&end=${endDate.trim()}` : ''}`;
}

export function* getDailyReportData(action) {
  const filter = yield select(getFilterSelector());
  const filterData = filter.toJS();
  const userIds = action.userIds ? action.userIds : filterData.userIdsFilter;
  const folderLogs = action.folderLogs
    ? action.folderLogs
    : filterData.folderLogsFilter;
  const reporters = action.reporters
    ? action.reporters
    : filterData.reportersFilter;
  const departments = action.departments
    ? action.departments
    : filterData.departmentsFilter;
  const search = action.search ? action.search : filterData.search;
  const startDate = formatDateTimeToSend(
    action.startDate ? action.startDate : filterData.startDate,
  );
  const endDate = formatDateTimeToSend(
    action.endDate ? action.endDate : filterData.endDate,
  );
  const meta = yield select(getMetaPagingDailyReport());
  const getDailyReportURL = getMeta(
    meta,
    userIds,
    folderLogs,
    reporters,
    departments,
    search,
    startDate,
    endDate,
  );

  try {
    // Debouncing when DailyReport enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getDailyReportURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    res.data.map((item) => {
      if (item.date) {
        item.date = convertShowDate(item.date);
      }
    });
    // dispatch to DailyReport reducer

    yield put(getDailyReportDataSuccess(res.data));
    yield put(setMetaDailyReport(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains DailyReport info from action
 */
export function* putDailyReportUpdate(action) {
  const urlUpdateDailyReport = `${URL_DOMAIN}/daily-reports/${action.id}`;
  let dailyReport = action.dailyReport;
  if (dailyReport.date) {
    dailyReport.date = formatDateTimeToSend(dailyReport.date);
  }
  try {
    const res = yield call(
      request,
      urlUpdateDailyReport,
      option('PUT', dailyReport),
    );
    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // update success
    yield put(updateDailyReportSuccess(res.message));

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action): payload contains DailyReport info from action
 */
export function* postDailyReportAdd(action) {
  const urlAddDailyReport = `${URL_DOMAIN}/daily-reports`;
  let dailyReport = action.dailyReport;
  if (dailyReport.date) {
    dailyReport.date = formatDateTimeToSend(dailyReport.date);
  }

  try {
    const res = yield call(
      request,
      urlAddDailyReport,
      option('POST', dailyReport),
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

    // success redirect to DailyReport page
    yield put(createDailyReportSuccess(res.message));
    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: {id: id}
 */
export function* getInitIndexDailyReport(action) {
  const urlInitIndexDailyReport = `${URL_DOMAIN}/daily-reports/${action.id}`;
  try {
    if (action.id) {
      const res = yield call(request, urlInitIndexDailyReport, option('GET'));
      if (res.statusCode && res.statusCode === responseCode.internalServer) {
        // notify to DailyReport or throw exception
        const err = { message: res.message };
        throw err;
      }
      if (res.date) {
        res.date = convertShowDateTime(res.date);
      }

      yield put(
        getInitIndexDailyReportSuccess(mapModelDailyReportApiToUI(res)),
      );
      yield put(loadSuccess());
    } else {
      const data = {
        title: '',
        content: '',
        userId: 0,
        reporterId: 0,
        folderLogId: 0,
        date: new Date(),
      };
      yield put(
        getInitIndexDailyReportSuccess(mapModelDailyReportApiToUI(data)),
      );
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* getIndexDailyReportByUser(action) {
  const urlGetByUser = `${URL_DOMAIN}/daily-reports/by-user?userId=${
    action.userId
  }&date=${formatDateTimeToSend(new Date(action.date))}`;
  try {
    const res = yield call(request, urlGetByUser, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to DailyReport or throw exception
      const err = { message: res.message };
      throw err;
    }
    if (res.date) {
      res.date = convertShowDateTime(res.date);
    }

    yield put(getInitIndexDailyReportSuccess(mapModelDailyReportApiToUI(res)));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteDailyReport(action) {
  const urlDeleteDailyReport = `${URL_DOMAIN}/daily-reports?ids=${action.id}`;
  try {
    const res = yield call(request, urlDeleteDailyReport, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to DailyReport or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to DailyReport
    yield put(deleteDailyReportSuccess(res.message, action.id));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_DailyReport, ids: array }
 */
export function* deleteMultiesDailyReport(action) {
  const urlDeleteDailyReport = `${URL_DOMAIN}/daily-reports?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteDailyReport, option('DELETE'));
    // const res = { message: 'dkgdfklg', statusCode: 200 };
    // handle error if not get data
    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      // notify to DailyReport or throw exception
      const err = { message: res.message };
      throw err;
    }

    // notify to DailyReport
    yield put(deleteMultiesDailyReportSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getUserData() {
  const getUserURL = `${URL_DOMAIN}/users?&pageSize=9999999`;

  try {
    // Call our request helper (see 'utils/request')

    const res = yield call(request, getUserURL.trim(), option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    yield put(getUserDataSuccess(res.data));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* dailyReportData() {
  yield takeLatest(FETCH_DAILY_REPORT_INIT, getInit);
  yield takeLatest(FETCH_DAILY_REPORT_DATA, getDailyReportData);
  yield takeLatest(UPDATE_DAILY_REPORT, putDailyReportUpdate);
  yield takeLatest(ADD_DAILY_REPORT, postDailyReportAdd);
  yield takeLatest(INIT_INDEX_DAILY_REPORT, getInitIndexDailyReport);
  yield takeLatest(GET_INDEX_DAILY_REPORT_BY_USER, getIndexDailyReportByUser);
  yield takeLatest(DELETE_DAILY_REPORT_ROW, deleteDailyReport);
  yield takeLatest(DELETE_MULTIES_DAILY_REPORT, deleteMultiesDailyReport);
  yield takeLatest(DELETE_MULTIES_DAILY_REPORT_SUCCESS, getDailyReportData);
  yield takeLatest(DELETE_DAILY_REPORT_SUCCESS, getDailyReportData);
  yield takeLatest(UPDATE_DAILY_REPORT_SUCCESS, getDailyReportData);
  yield takeLatest(CREATE_DAILY_REPORT_SUCCESS, getDailyReportData);
}
