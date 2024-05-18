import { Map } from 'immutable';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  GET_SCHEDULE,
  UPDATE_SCHEDULE,
  ADD_SCHEDULE,
  DELETE_SCHEDULE_ROW,
  DELETE_MULTIPLE_SCHEDULE,
  GET_SCHEDULE_INFO,
  GET_SCHEDULE_INIT,
  CREATE_SCHEDULE_SUCCESS,
  UPDATE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_MULTIPLE_SCHEDULE_SUCCESS,
  GET_REMAINING_HOLIDAY
} from './constants';
import {
  getScheduleDataSuccess,
  mapInfoToModel,
  invalidModel,
  createScheduleSuccess,
  updateScheduleSuccess,
  deleteScheduleSuccess,
  deleteMultipleScheduleSuccess,
  setMetaPagingSchedule,
  setTypeListSchedule,
  setCategoryList,
  setCreatedBy,
  setDepartments,
  setCategoryTypes,
  setRemainingHoliday
} from './actions';
import { mapIdsToQueryString } from './scheduleUtilities';
import { getMetaPagingSchedule } from './selectors';
import {
  convertShowDateTime,
  formatDateTimeToSend,
  formatDateTimeToSendWithoutUTC
} from '../../utils/utils.js';

export function getMeta(meta, search, types, categories, folderLogId, date, accounts, categoryTypes, departments) {
  const metaStore = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 999999,
  };
  const metaPaging = Map.isMap(meta) ? meta.toJSON() : metaStore;
  return `${URL_DOMAIN}/schedules?pageNumber=${metaPaging.pageNumber}&pageSize=${
    metaPaging.pageSize
  }&sortColumn=${metaPaging.sortColumn}&sortDirection=${
    metaPaging.sortDirection
  }&date=${date.trim()}${search ? `&search=${search.trim()}` : ''}${accounts ? `&accounts=${accounts.trim()}` : ''}
  ${categoryTypes ? `&categoryTypes=${categoryTypes.trim()}` : ''}${departments ? `&departments=${departments.trim()}` : ''}${
    types
      ? `&types=${types.join('&types=')}`
      : ''
  }${
    categories
      ? `&categories=${categories.join('&categories=')}`
      : ''
  }${
    folderLogId
      ? `&folderLogs=${folderLogId.join('&folderLogs=')}`
      : ''
  }`;
}

export function* getScheduleSaga(action) {
  const search = action.queries ? action.queries.search : '';
  const types = action.queries ? action.queries.types : [];
  const categories = action.queries ? action.queries.categories : [];
  const folderLogId = action.queries ? action.queries.folderLogId : [];
  const accounts = (action.queries && action.queries.accounts) ? action.queries.accounts.join(',') : null;
  const categoryTypes = (action.queries && action.queries.categoryTypes) ? action.queries.categoryTypes.join(',') : null;
  const departments = (action.queries && action.queries.departments) ? action.queries.departments.join(',') : null;
  const date = (action.queries && action.queries.date) ? formatDateTimeToSendWithoutUTC(action.queries.date) : '';
  const meta = yield select(getMetaPagingSchedule());
  const getScheduleUrl = getMeta(meta, search, types, categories, folderLogId, date, accounts, categoryTypes, departments);

  try {
    if (search) {
      yield call(delay, 1000);
    }
    const res = yield call(request, getScheduleUrl, option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }
    res.data.map((item) => {
      if (item.startDate) {
        item.startDate = convertShowDateTime(item.startDate);
      }
      if (item.endDate) {
        item.endDate = convertShowDateTime(item.endDate);
      }
    });
    

    yield put(getScheduleDataSuccess(res.data));
    yield put(setMetaPagingSchedule(res.meta));

    // hide progress
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains schedule id
 */
export function* getScheduleInfoSaga(action) {
  const urlUpdateSchedule = `${URL_DOMAIN}/schedules/${action.id}`;
  try {
    const res = yield call(request, urlUpdateSchedule, option('GET'));

    // model invalid
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }
    console.log(res);
    if (res.startDate) {
      res.startDate = convertShowDateTime(res.startDate);
    }
    if (res.endDate) {
      res.endDate = convertShowDateTime(res.endDate);
    }
    console.log(res);

    // update scheduleModel
    res.id = action.id;
    yield put(mapInfoToModel(res));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains schedule info from action
 */
export function* putScheduleUpdateSaga(action) {
  const urlUpdateSchedule = `${URL_DOMAIN}/schedules/${action.id}`;
  try {
    let schedule = action.schedule;
    if (schedule.startDate) {
      schedule.startDate = formatDateTimeToSend(schedule.startDate);
    }
    if (schedule.endDate) {
      schedule.endDate = formatDateTimeToSend(schedule.endDate);
    }

    const res = yield call(
      request,
      urlUpdateSchedule,
      option('PUT', action.schedule),
    );

    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }

    // update success
    yield put(updateScheduleSuccess(res.message));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains schedule info from action
 */
export function* postScheduleAddSaga(action) {
  const urlAddSchedule = `${URL_DOMAIN}/schedules`;
  try {
    let schedule = action.schedule;
    if (schedule.startDate) {
      schedule.startDate = formatDateTimeToSend(schedule.startDate);
    }
    if (schedule.endDate) {
      schedule.endDate = formatDateTimeToSend(schedule.endDate);
    }

    const res = yield call(
      request,
      urlAddSchedule,
      option('POST', action.schedule),
    );

    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      action.errorCallBack(res.errors);
      const err = { message: res.message };
      throw err;
    }

    if (res.statusCode === responseCode.internalServer) {
      const err = { message: res.message };
      throw err;
    }

    // success
    action.callBack();
    yield put(createScheduleSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteScheduleSaga(action) {
  const urlDeleteSchedule = `${URL_DOMAIN}/schedules/${action.id}`;
  try {
    const res = yield call(request, urlDeleteSchedule, option('DELETE'));

    if (res.statusCode && res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    // notify to schedule
    yield put(deleteScheduleSuccess(res.message));
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getScheduleInitSaga() {
  const urlScheduleInit = `${URL_DOMAIN}/schedules/init`;
  try {
    const res = yield call(request, urlScheduleInit, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemSCHEDULE or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setTypeListSchedule(res.types))
    yield put(setCategoryList(res.categories))
    yield put(setCreatedBy(res.accounts))
    yield put(setCategoryTypes(res.categoryTypes))
    yield put(setDepartments(res.departments))
    return res;
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}


/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_SCHEDULE, ids: array }
 */
export function* deleteMultipleScheduleSaga(action) {
  const urlDeleteSchedule = `${URL_DOMAIN}/schedules?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteSchedule, option('DELETE'));

    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      const err = { message: res.message };
      throw err;
    }

    // notify to schedule
    yield put(deleteMultipleScheduleSuccess(res.message));
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI {type: GET_REMAINING_HOLIDAY, ids: array }
 */
export function* getRemainingHoliday(action) {
  const urlRemainingHoliday = `${URL_DOMAIN}/schedules/remaining-holiday`;

  try {
    const res = yield call(request, urlRemainingHoliday, option('GET'));

    // notify to schedule
    yield put(setRemainingHoliday(res));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* scheduleSaga() {
  yield takeLatest(GET_SCHEDULE, getScheduleSaga);
  yield takeLatest(GET_SCHEDULE_INIT, getScheduleInitSaga);
  yield takeLatest(GET_SCHEDULE_INFO, getScheduleInfoSaga);
  yield takeLatest(UPDATE_SCHEDULE, putScheduleUpdateSaga);
  yield takeLatest(ADD_SCHEDULE, postScheduleAddSaga);
  yield takeLatest(DELETE_SCHEDULE_ROW, deleteScheduleSaga);
  yield takeLatest(DELETE_MULTIPLE_SCHEDULE, deleteMultipleScheduleSaga);
  yield takeLatest(CREATE_SCHEDULE_SUCCESS, getScheduleSaga);
  yield takeLatest(UPDATE_SCHEDULE_SUCCESS, getScheduleSaga);
  yield takeLatest(DELETE_SCHEDULE_SUCCESS, getScheduleSaga);
  yield takeLatest(DELETE_MULTIPLE_SCHEDULE_SUCCESS, getScheduleSaga);
  yield takeLatest(GET_REMAINING_HOLIDAY, getRemainingHoliday);
}
