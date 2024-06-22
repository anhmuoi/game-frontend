/**
 * Gets the repositories of the user from Github
 */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import request, { responseCode, option } from 'utils/request';
import { URL_DOMAIN } from 'utils/constants';
import {
  JOIN_GROUP,
  CHANGE_PASSWORD,
  GET_USER_LIST_JOIN_GROUP,
  CONFIRM_JOIN_GROUP,
} from './constants';
import {
  addFriendSuccess,
  invalidModel,
  changePassSuccess,
  setUserData,
} from './actions';
import { checkRes } from '../../utils/request.js';

export function* addFriend(action) {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/accounts/add-friend`,
      option('POST', {
        newPassword: action.newPass,
        confirmNewPassword: action.confirmPass,
        token: action.token,
      }),
    );
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      if (res.errors) {
        yield put(invalidModel(res.errors));
      }
      const err = { message: res.message };
      throw err;
    }

    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(addFriendSuccess({ message: res.message }));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* changePassword(action) {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/accounts/change-password-no-login`,
      option('POST', action.model),
    );
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      if (res.errors) {
        yield put(invalidModel(res.errors));
      }
      const err = { message: res.message };
      throw err;
    }

    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(changePassSuccess({ message: res.message }));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getUserList() {
  const urlStoreIdList = `${URL_DOMAIN}/users?pageNumber=1&pageSize=9999`;
  try {
    const res = yield call(request, urlStoreIdList, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemStore or throw exception
      const err = { message: res.message };
      throw err;
    }

    yield put(setUserData(res.data));
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}

export function* confirmAddFriend(action) {
  const url = `${URL_DOMAIN}/friends/confirm-add?userId1=${action.userId1}&userId2=${action.userId2}&confirm=${action.confirm}&token=${action.token}`;

  try {
    const res = yield call(request, url.trim(), option('POST', {}));

    if (checkRes(res.statusCode)) {
      // model invalid
      if (res.statusCode === responseCode.validationFailed) {
        // hightlight field error
        yield put(invalidModel(res.errors));
      }

      const err = { message: res.message };
      throw err;
    }

    // hide progress
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* addFriendWather() {
  yield takeLatest(GET_USER_LIST_JOIN_GROUP, getUserList);
  yield takeLatest(CONFIRM_JOIN_GROUP, confirmAddFriend);
  yield takeLatest(JOIN_GROUP, addFriend);
  yield takeLatest(CHANGE_PASSWORD, changePassword);
}
