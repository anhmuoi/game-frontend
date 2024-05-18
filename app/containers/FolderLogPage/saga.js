/* eslint-disable no-restricted-syntax */
import { fetchApiError, loadSuccess } from 'containers/App/actions';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { URL_DOMAIN } from 'utils/constants';
import request, { option, responseCode } from '../../utils/request';
import {
  createGroupSuccess,
  createMeetingSuccess,
  createWorkLogSuccess,
  deleteDailyReportSuccess,
  deleteMeetingSuccess,
  deleteMultiesFolderLogSuccess,
  deleteMultiesMeetingSuccess,
  deleteMultiesWorkLogSuccess,
  deleteScheduleSuccess,
  deleteWorkLogSuccess,
  editMeetingSuccess,
  editWorkLogSuccess,
  getFolderLogDatasSuccess,
  getGroupDetailSuccess,
  getMeetingDetailSuccess,
  getSelectGroupItemSuccess,
  getUserDataSuccess,
  getWorkLogDataSuccess,
  getWorkLogDetailSuccess,
  invalidMeetingModel,
  invalidModel,
  invalidWorkLogModel,
  setAccountList,
  setFolderLogMeta,
  setMetaWorkLog,
  setSearchData,
} from './actions';
import {
  mapIdsToQueryString,
  mapModelApiToUI,
  mapModelgroupApiToUI,
} from './folderLogUtilities';
import {
  CREATE_MEETING,
  CREATE_MEETING_SUCCESS,
  CREATE_WORK_LOG,
  CREATE_WORK_LOG_SUCCESS,
  DELETE_DAILY_REPORT,
  DELETE_DAILY_REPORT_SUCCESS,
  DELETE_MEETING,
  DELETE_MEETING_SUCCESS,
  DELETE_MULTIES_MEETING,
  DELETE_MULTIES_MEETING_SUCCESS,
  DELETE_MULTIES_WORK_LOG,
  DELETE_MULTIES_WORK_LOG_SUCCESS,
  DELETE_MULTIPLE_FOLDER_LOG,
  DELETE_MULTIPLE_FOLDER_LOG_SUCCESS,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_WORK_LOG,
  DELETE_WORK_LOG_SUCCESS,
  EDIT_MEETING,
  EDIT_MEETING_SUCCESS,
  EDIT_WORK_LOG,
  EDIT_WORK_LOG_SUCCESS,
  FETCH_WORK_LOG_DATA,
  GET_GROUP_DETAIL,
  GET_INIT_FOLDER_LOG,
  GET_LIST_FOLDER_LOG,
  GET_MEETING_DETAIL,
  GET_WORK_LOG_DETAIL,
  SAVE_FOLDER_LOG,
  SAVE_FOLDER_LOG_SUCCESS,
  SELECT_FOLDER_LOG_ITEM,
  SET_SEARCH,
} from './constants';
import {
  getAccountListSelector,
  getMetaPagingWorkLog,
  makeDoorPagingSelector,
  makeGroupDataSelector,
  makeGroupPagingSelector,
} from './selectors';
import {
  convertShowDateTime,
  formatDateTimeToSend,
  mapWorkMeetingToChildrenFolder,
} from '../../utils/utils.js';
import { notifySuccess } from '../App/actions.js';

export const getMeta = (meta, search, queryString = '') => {
  const metaPaging = meta ? meta.toJS() : {};
  const searchTxt = search || metaPaging.search || '';
  return `${URL_DOMAIN}/folder-logs?${queryString}&search=${searchTxt}&pageNumber=${metaPaging.pageNumber}&pageSize=${metaPaging.pageSize}&sortColumn=${metaPaging.sortColumn}&sortDirection=${metaPaging.sortDirection}`;
};

export function* getListFolderLog(action) {
  const meta = yield select(makeGroupPagingSelector());
  const getFolderLogURL = getMeta(meta, action.search);

  try {
    if (action.search) {
      yield delay(1000);
    }
    // Call our request helper (see 'utils/request')
    const res = yield call(request, getFolderLogURL, option('GET'));
    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }
    res.data = mapWorkMeetingToChildrenFolder(res.data);

    yield put(getFolderLogDatasSuccess(res.data));
    if (action.callback && res.data.length > 0) {
      action.callback([res.data[0].id], res.data[0].name);
    }
    yield put(setFolderLogMeta(res.meta));
    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* searchFolderAndFile(action) {
  const getFolderLogURL = `${URL_DOMAIN}/folder-logs/search?search=${action.search}`;

  try {
    if (action.search) {
      yield delay(1000);
    }
    // Call our request helper (see 'utils/request')
    const res = yield call(request, getFolderLogURL.trim(), option('GET'));
    if (!res) {
      const err = { message: res.message };
      throw err;
    }

    yield put(setSearchData(res));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getInit() {
  const url = `${URL_DOMAIN}/folder-logs/init`;
  try {
    const res = yield call(request, url, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemCATEGORY or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setAccountList(res.accounts));
    yield getUserData();

    return res;
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

export function* saveFolderLog(action) {
  try {
    let res = null;
    if (action.groupId) {
      res = yield call(
        request,
        `${URL_DOMAIN}/folder-logs/${action.groupId}`,
        option('PUT', action.folderLog),
      );
    } else {
      // create
      res = yield call(
        request,
        `${URL_DOMAIN}/folder-logs`,
        option('POST', action.folderLog),
      );
    }

    if (
      res.statusCode === responseCode.validationFailed &&
      res.statusCode !== responseCode.createNew &&
      res.statusCode !== responseCode.ok
    ) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // success redirect to user page
    yield put(createGroupSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action: object): {type: string, groupId: number}
 *
 * choose a group, call api get list doors and users of group
 */
export function* selectFolderLogItem(action) {
  // const idsQueryString = action.ids.map(id => `ids=${id}`).join('&');

  try {
    const accountList = yield select(getAccountListSelector());
    let idsQueryString = null;
    if (action.ids) {
      idsQueryString = action.ids.map((id) => `ids=${id}`).join('&');
    } else if (action.groupId) {
      idsQueryString = `ids=${action.groupId}`;
    }

    const url = `${URL_DOMAIN}/folder-logs/multi?${idsQueryString}`;
    const res = yield call(request, url, option('GET'));

    res.map((el) => {
      if (el.children) {
        el.children.map((item) => {
          const check = accountList.find((a) => a.id === item.updatedBy);
          if (check) {
            item.updatedBy = check.name;
            item.avatar = check.avatar;
          }
          if (item.updatedOn) {
            item.updatedOn = convertShowDateTime(item.updatedOn);
          }
        });
      }
      if (el.workLog) {
        el.workLog.map((item) => {
          item.name = item.title;
          item.parentId = el.id;
          const check = accountList.find((a) => a.id === item.updatedBy);
          if (check) {
            item.updatedBy = check.name;
            item.avatar = check.avatar;
          }
          if (item.updatedOn) {
            item.updatedOn = convertShowDateTime(item.updatedOn);
          }
        });
      }
      if (el.meeting) {
        el.meeting.map((item) => {
          item.name = item.title;
          item.parentId = el.id;
          const check = accountList.find((a) => a.id === item.updatedBy);
          if (check) {
            item.updatedBy = check.name;
            item.avatar = check.avatar;
          }
          if (item.updatedOn) {
            item.updatedOn = convertShowDateTime(item.updatedOn);
          }
        });
      }
    });

    yield put(getSelectGroupItemSuccess(res));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMultiesFolderLog(action) {
  const urlDeleteFolderLog = `${URL_DOMAIN}/folder-logs?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteFolderLog, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to user or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(deleteMultiesFolderLogSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getGroupDetail(action) {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/folder-logs/${action.groupId}`,
      option('GET'),
    );
    // model invalid
    if (res.statusCode === responseCode.internalServer) {
      const err = { message: res.message };
      throw err;
    }
    const folderLogList = yield select(makeGroupDataSelector());
    yield put(
      getGroupDetailSuccess(
        mapModelgroupApiToUI(res, folderLogList, action.groupId),
      ),
    );
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* getWorkLogDetail(action) {
  try {
    if (action.id) {
      const res = yield call(
        request,
        `${URL_DOMAIN}/work-logs/${action.id}`,
        option('GET'),
      );
      // model invalid
      if (res.statusCode === responseCode.internalServer) {
        const err = { message: res.message };
        throw err;
      }
      if (res.startDate) {
        res.startDate = convertShowDateTime(res.startDate);
      }
      if (res.endDate) {
        res.endDate = convertShowDateTime(res.endDate);
      }
      yield put(getWorkLogDetailSuccess(mapModelApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        id: 0,
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        folderLogId: null,
        userId: null,
      };
      yield put(getWorkLogDetailSuccess(mapModelApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* createWorkLog(action) {
  try {
    let workLog = action.workLog;
    if (workLog.startDate) {
      workLog.startDate = formatDateTimeToSend(workLog.startDate);
    }
    if (workLog.endDate) {
      workLog.endDate = formatDateTimeToSend(workLog.endDate);
    }
    const res = yield call(
      request,
      `${URL_DOMAIN}/work-logs`,
      option('POST', workLog),
    );
    if (
      res.statusCode === responseCode.validationFailed &&
      res.statusCode !== responseCode.createNew &&
      res.statusCode !== responseCode.ok
    ) {
      // hightlight field error
      yield put(invalidWorkLogModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // success redirect to user page
    yield put(createWorkLogSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* editWorkLog(action) {
  try {
    let workLog = action.workLog;
    if (workLog.startDate) {
      workLog.startDate = formatDateTimeToSend(workLog.startDate);
    }
    if (workLog.endDate) {
      workLog.endDate = formatDateTimeToSend(workLog.endDate);
    }
    const res = yield call(
      request,
      `${URL_DOMAIN}/work-logs/${action.id}`,
      option('PUT', workLog),
    );
    if (
      res.statusCode === responseCode.validationFailed &&
      res.statusCode !== responseCode.ok
    ) {
      // hightlight field error
      yield put(invalidWorkLogModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // success redirect to user page
    yield put(editWorkLogSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteWorkLog(action) {
  const urlDeleteFolderLog = `${URL_DOMAIN}/work-logs/${action.id}`;

  try {
    const res = yield call(request, urlDeleteFolderLog, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to user or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(deleteWorkLogSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function getMetaWorkLog(meta, userIds, folderLogs, search) {
  const metaNotice = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = meta ? meta.toJSON() : metaNotice;
  return `${URL_DOMAIN}/work-logs?pageNumber=${
    metaPaging.pageNumber
  }&pageSize=${metaPaging.pageSize}&sortColumn=${
    metaPaging.sortColumn
  }&sortDirection=${metaPaging.sortDirection}${
    userIds ? `&userIds=${userIds.join('&userIds=')}` : ''
  }${folderLogs ? `&folderLogs=${folderLogs.join('&folderLogs=')}` : ''}${
    search ? `&search=${search.trim()}` : ''
  }`;
}
export function* getDataWorkLog(action) {
  const userIds = action.userIds;
  const search = action.search;
  const folderLogs = action.folderLogs;
  const meta = yield select(getMetaPagingWorkLog());
  const url = getMetaWorkLog(meta, userIds, folderLogs, search);

  try {
    // Debouncing when Notice enter search box
    if (search) {
      yield call(delay, 500);
    }
    // Call our request helper (see 'utils/request')

    const res = yield call(request, url.trim(), option('GET'));

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

    yield getUserData();
    yield put(getWorkLogDataSuccess(res.data));
    yield put(setMetaWorkLog(res.meta));
    // hide progress
    yield put(loadSuccess());
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
export function* deleteMultiesWorkLog(action) {
  const urlDeleteUser = `${URL_DOMAIN}/work-logs?${mapIdsToQueryString(
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
    yield put(deleteMultiesWorkLogSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

// schedule
/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteSchedule(action) {
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

// daily report
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

// meeting
export function* getMeetingDetail(action) {
  try {
    if (action.id) {
      const res = yield call(
        request,
        `${URL_DOMAIN}/meeting-logs/${action.id}`,
        option('GET'),
      );
      // model invalid
      if (res.statusCode === responseCode.internalServer) {
        const err = { message: res.message };
        throw err;
      }
      if (res.startDate) {
        res.startDate = convertShowDateTime(res.startDate);
      }
      if (res.endDate) {
        res.endDate = convertShowDateTime(res.endDate);
      }
      yield put(getMeetingDetailSuccess(mapModelApiToUI(res)));
      yield put(loadSuccess());
    } else {
      const data = {
        id: 0,
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        folderLogId: null,
        meetingRoomId: null,
      };
      yield put(getMeetingDetailSuccess(mapModelApiToUI(data)));
      yield put(loadSuccess());
    }
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* createMeeting(action) {
  try {
    let meetingLog = action.meetingLog;
    if (meetingLog.startDate) {
      meetingLog.startDate = formatDateTimeToSend(meetingLog.startDate);
    }
    if (meetingLog.endDate) {
      meetingLog.endDate = formatDateTimeToSend(meetingLog.endDate);
    }
    const res = yield call(
      request,
      `${URL_DOMAIN}/meeting-logs`,
      option('POST', meetingLog),
    );
    if (
      res.statusCode === responseCode.validationFailed &&
      res.statusCode !== responseCode.createNew &&
      res.statusCode !== responseCode.ok
    ) {
      // hightlight field error
      yield put(invalidMeetingModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // success redirect to user page
    yield put(createMeetingSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
export function* editMeeting(action) {
  try {
    let meetingLog = action.meetingLog;
    if (meetingLog.startDate) {
      meetingLog.startDate = formatDateTimeToSend(meetingLog.startDate);
    }
    if (meetingLog.endDate) {
      meetingLog.endDate = formatDateTimeToSend(meetingLog.endDate);
    }
    const res = yield call(
      request,
      `${URL_DOMAIN}/meeting-logs/${action.id}`,
      option('PUT', meetingLog),
    );
    if (
      res.statusCode === responseCode.validationFailed &&
      res.statusCode !== responseCode.ok
    ) {
      // hightlight field error
      yield put(invalidMeetingModel(res.errors));
      const err = { message: res.message };
      throw err;
    }
    // success redirect to user page
    yield put(editMeetingSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMeeting(action) {
  const urlDeleteFolderLog = `${URL_DOMAIN}/meeting-logs/${action.id}`;

  try {
    const res = yield call(request, urlDeleteFolderLog, option('DELETE'));
    // handle error if not get data
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      // notify to user or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(deleteMeetingSuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteMultiesMeeting(action) {
  const urlDeleteUser = `${URL_DOMAIN}/meeting-logs?${mapIdsToQueryString(
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
    yield put(deleteMultiesMeetingSuccess(res.message, action.ids));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
/**
 * watcher saga for folderLog
 */
export default function* folderLogWatcher() {
  yield takeLatest(GET_INIT_FOLDER_LOG, getInit);
  yield takeLatest(GET_LIST_FOLDER_LOG, getListFolderLog);
  yield takeLatest(SET_SEARCH, searchFolderAndFile);
  yield takeLatest(SAVE_FOLDER_LOG, saveFolderLog);
  yield takeLatest(SAVE_FOLDER_LOG_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_MULTIPLE_FOLDER_LOG_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_MULTIPLE_FOLDER_LOG, deleteMultiesFolderLog);
  yield takeLatest(SELECT_FOLDER_LOG_ITEM, selectFolderLogItem);
  yield takeLatest(GET_GROUP_DETAIL, getGroupDetail);
  // work
  yield takeLatest(FETCH_WORK_LOG_DATA, getDataWorkLog);
  yield takeLatest(GET_WORK_LOG_DETAIL, getWorkLogDetail);
  yield takeLatest(CREATE_WORK_LOG, createWorkLog);
  yield takeLatest(CREATE_WORK_LOG_SUCCESS, getListFolderLog);
  yield takeLatest(EDIT_WORK_LOG, editWorkLog);
  yield takeLatest(EDIT_WORK_LOG_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_WORK_LOG, deleteWorkLog);
  yield takeLatest(DELETE_WORK_LOG_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_MULTIES_WORK_LOG, deleteMultiesWorkLog);
  yield takeLatest(DELETE_MULTIES_WORK_LOG_SUCCESS, getDataWorkLog);
  // meeting
  yield takeLatest(GET_MEETING_DETAIL, getMeetingDetail);
  yield takeLatest(CREATE_MEETING, createMeeting);
  yield takeLatest(CREATE_MEETING_SUCCESS, getListFolderLog);
  yield takeLatest(EDIT_MEETING, editMeeting);
  yield takeLatest(EDIT_MEETING_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_MEETING, deleteMeeting);
  yield takeLatest(DELETE_MEETING_SUCCESS, getListFolderLog);
  yield takeLatest(DELETE_MULTIES_MEETING, deleteMultiesMeeting);
  yield takeLatest(DELETE_MULTIES_MEETING_SUCCESS, getListFolderLog);
  // schedule
  yield takeLatest(DELETE_SCHEDULE, deleteSchedule);
  yield takeLatest(DELETE_SCHEDULE_SUCCESS, getListFolderLog);
  // daily report
  yield takeLatest(DELETE_DAILY_REPORT, deleteDailyReport);
  yield takeLatest(DELETE_DAILY_REPORT_SUCCESS, getListFolderLog);
}
