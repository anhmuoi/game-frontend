import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  FETCH_DATA,
} from './constants';
import {
  getDataSuccess
} from './actions';

import { getMetaPagingUser } from './selectors';
import { notifySuccess } from '../App/actions.js';
import { getFullTime } from '../App/appUtilities.js';
import {
  convertShowDateTime,
} from '../../utils/utils.js';

export function* getData() {
    const urlDataDashboard = `${URL_DOMAIN}/dashboard`;
    try {
      const res = yield call(request, urlDataDashboard, option('GET'));

      res.schedules.map((item) => {
        if (item.startDate) {
          item.startDate = convertShowDateTime(item.startDate);
        }
        if (item.endDate) {
          item.endDate = convertShowDateTime(item.endDate);
        }
      });
      console.log(res);

      yield put(getDataSuccess(res));
      // hide progress
      yield put(loadSuccess());
    } catch (err) {
      yield put(fetchApiError(err));
    }
  }

/**
 * Root saga manages watcher lifecycle
 */
export default function* dashboardData() {
  yield takeLatest(FETCH_DATA, getData);
}
