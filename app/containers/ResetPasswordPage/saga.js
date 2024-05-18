/**
 * Gets the repositories of the user from Github
 */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import request, { responseCode, option } from 'utils/request';
import { URL_DOMAIN } from 'utils/constants';
import { RESET_PASSWORD, CHANGE_PASSWORD } from './constants';
import { resetPassSuccess, invalidModel, changePassSuccess } from './actions';

export function* resetPassword(action) {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/accounts/reset-password`,
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

    yield put(resetPassSuccess({ message: res.message }));
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

/**
 * Root saga manages watcher lifecycle
 */
export default function* resetPassWather() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
  yield takeLatest(CHANGE_PASSWORD, changePassword);
}
