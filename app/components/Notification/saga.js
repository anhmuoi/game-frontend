import { takeLatest, put, call, select } from 'redux-saga/effects';
import { URL_DOMAIN } from 'utils/constants';
import request, { option } from '../../utils/request';
import {
  GET_LIST_NOTIFICATION,
  GET_LIST_SHORT_NOTIFICATION,
  GET_LIST_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION,
  CHANGE_NOTIFICATION_STATUS,
  DELETE_ALL_READ,
  MARK_ALL_AS_READ,
  GO_NOTIFICATION_DETAIL,
  GET_LIST_SHORT_NOTIFICATION_SUCCESS,
} from './constants';
import { getMetaPaging } from './selectors';
import { isOnNotificationPage } from './utils';

export function* getListNotifications() {
  try {
    const paging = yield select(getMetaPaging());
    const paramsUrl = new URLSearchParams(paging).toString();
    const res = yield call(
      request,
      `${URL_DOMAIN}/notifications?${paramsUrl}`,
      option('GET'),
    );
    yield put({ type: GET_LIST_NOTIFICATION_SUCCESS, notifications: res });
  } catch (err) {
    console.log(err);
  }
}

export function* getListShortNotifications() {
  try {
    const paramsUrl = new URLSearchParams({
      pageNumber: 1,
      pageSize: 10,
      sortDirection: 'desc',
      sortColumn: 1,
    }).toString();
    const res = yield call(
      request,
      `${URL_DOMAIN}/notifications?${paramsUrl}`,
      option('GET'),
    );
    yield put({
      type: GET_LIST_SHORT_NOTIFICATION_SUCCESS,
      shortNotifications: res,
    });
  } catch (err) {
    console.log(err);
  }
}

export function* deleteNotification(action) {
  try {
    yield call(
      request,
      `${URL_DOMAIN}/notifications/${action.id}`,
      option('DELETE'),
    );
    if (isOnNotificationPage()) {
      const paging = yield select(getMetaPaging());
      yield put({ type: GET_LIST_NOTIFICATION, paging });
    }
    yield put({ type: GET_LIST_SHORT_NOTIFICATION });
  } catch (err) {
    console.log(err);
  }
}

export function* deleteAllReadNotification() {
  try {
    yield call(
      request,
      `${URL_DOMAIN}/delete-all-notifications`,
      option('DELETE'),
    );
    if (isOnNotificationPage()) {
      const paging = yield select(getMetaPaging());
      yield put({ type: GET_LIST_NOTIFICATION, paging });
    }
    yield put({ type: GET_LIST_SHORT_NOTIFICATION });
  } catch (err) {
    console.log(err);
  }
}

export function* changeNotificationStatus(action) {
  try {
    yield call(
      request,
      `${URL_DOMAIN}/notifications/${action.id}`,
      option('PUT', { status: action.status }),
    );
    if (action.isGoDetail) {
      window.location.href = action.url;
    } else {
      if (isOnNotificationPage()) {
        const paging = yield select(getMetaPaging());
        yield put({ type: GET_LIST_NOTIFICATION, paging });
      }
      yield put({ type: GET_LIST_SHORT_NOTIFICATION });
    }
  } catch (err) {
    console.log(err);
  }
}

export function* markAllNotificationsAsRead() {
  try {
    yield call(request, `${URL_DOMAIN}/read-all-notifications`, option('PUT'));
    if (isOnNotificationPage()) {
      const paging = yield select(getMetaPaging());
      yield put({ type: GET_LIST_NOTIFICATION, paging });
    }
    yield put({ type: GET_LIST_SHORT_NOTIFICATION });
  } catch (err) {
    console.log(err);
  }
}

export default function* notificationsWatcher() {
  yield takeLatest(GET_LIST_NOTIFICATION, getListNotifications);
  yield takeLatest(GET_LIST_SHORT_NOTIFICATION, getListShortNotifications);
  yield takeLatest(DELETE_NOTIFICATION, deleteNotification);
  yield takeLatest(CHANGE_NOTIFICATION_STATUS, changeNotificationStatus);
  yield takeLatest(DELETE_ALL_READ, deleteAllReadNotification);
  yield takeLatest(MARK_ALL_AS_READ, markAllNotificationsAsRead);
  yield takeLatest(GO_NOTIFICATION_DETAIL, changeNotificationStatus);
}
