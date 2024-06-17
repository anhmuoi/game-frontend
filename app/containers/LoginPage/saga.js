/**
 * Gets the repositories of the user from Github
 */
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  SUBMIT_LOGIN,
  SEND_EMAIL_FORGOT_PASSWORD,
} from 'containers/App/constants';
import {
  fetchApiError,
  loginSuccess,
  sendEmailSuccess,
  // getTimezoneSuccess,
} from 'containers/App/actions';

// import request, { option, responseCode } from 'utils/request';
import request, { responseCode, option } from 'utils/request';
import { URL_DOMAIN, cookieExpires } from 'utils/constants';
import { localstoreUtilites } from 'utils/persistenceData';

export const loginOption = (body, method = 'GET') => ({
  method,
  body: JSON.stringify(body), // data can be `string` or {object}!
  headers: {
    'Content-Type': 'application/json',
  },
});

export function* loginRemote(action) {
  console.log(action);
  const loginURL = action.payload.password
    ? `${URL_DOMAIN}/login?haveAddress=${action.haveAddress}`
    : `${URL_DOMAIN}/login-step2`;
  // const getTzURL = `${URL_DOMAIN}/accounts/get-timezone-by-standard`;
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(request, loginURL, option('POST', action.payload));
    if (!res.authToken) {
      const err = { message: res.message };
      throw err;
    }
    // Save to localStorage for persistance data
    if (action.rememberMe) {
      localstoreUtilites.saveToLocalStorage(
        res.authToken,
        res.accountType,
        14 * 24 * 60,
      );
    } else {
      localstoreUtilites.saveToLocalStorage(
        res.authToken,
        res.accountType,
        14 * 24 * 60,
      );
    }
    localstoreUtilites.saveRefreshTokenToLocalStorage(res.refreshToken);
    localstoreUtilites.saveConfigWSToLocalStorage(res.queueService);
    localstoreUtilites.savePluginsToLocalStorage(res.plugIn);
    localstoreUtilites.saveUserIdToLocalStorage(res.accountId);
    localstoreUtilites.saveUserCompanyIdToLocalStorage(res.userId);
    localstoreUtilites.saveUsernameToLocalStorage(action.payload.username);
    localstoreUtilites.saveCompanycodeToLocalStorage(res.companyCode);
    localstoreUtilites.saveAccountTzToLocalStorage(res.userTimeZone);
    localstoreUtilites.savePermissionsToLocalStorage(res.permissions);
    localstoreUtilites.savePreferredSystemToLocalStorage(
      res.userPreferredSystem,
    );
    const lang =
      res.userLanguage && res.userLanguage !== 'null'
        ? res.userLanguage
        : 'en-us';
    localstoreUtilites.saveLanguageToLocalStorage(lang);

    // const resTz = yield call(request, getTzURL, option('GET'));
    // yield put(getTimezoneSuccess(resTz));

    yield put(
      loginSuccess(
        action.payload.username,
        res.authToken,
        res.accountType,
        res.companyCode,
        res.userTimeZone,
      ),
    );
  } catch (err) {
    yield put(fetchApiError(err));
    // window.location.assign('/login');
  } finally {
    // document.location.reload(true);
  }
}

export function* sendEmailForgotPass(action) {
  try {
    const res = yield call(
      request,
      `${URL_DOMAIN}/accounts/forgot-password`,
      option('POST', { email: action.email }),
    );

    if (res.statusCode === responseCode.validationFailed) {
      const err = { message: res.errors[0].message };
      throw err;
    }

    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(sendEmailSuccess({ message: res.message }));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* loginFlow() {
  // Watches for SUBMIT_LOGIN actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SUBMIT_LOGIN, loginRemote);
  yield takeLatest(SEND_EMAIL_FORGOT_PASSWORD, sendEmailForgotPass);
}
