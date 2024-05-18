import { Map } from 'immutable';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess } from 'containers/App/actions';

import { URL_DOMAIN } from 'utils/constants';

import {
  GET_CATEGORY,
  UPDATE_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY_ROW,
  DELETE_MULTIPLE_CATEGORY,
  GET_CATEGORY_INFO,
  GET_CATEGORY_INIT
} from './constants';
import {
  getCategoryDataSuccess,
  mapInfoToModel,
  invalidModel,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  deleteMultipleCategorySuccess,
  setMetaPagingCategory,
  setTypeListCategory
} from './actions';
import { mapIdsToQueryString } from './categoryUtilities';
import { getMetaPagingCategory } from './selectors';

export function getMeta(meta, search, types) {
  const metaStore = {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  };
  const metaPaging = Map.isMap(meta) ? meta.toJSON() : metaStore;
  return `${URL_DOMAIN}/categories?pageNumber=${metaPaging.pageNumber}&pageSize=${
    metaPaging.pageSize
  }&sortColumn=${metaPaging.sortColumn}&sortDirection=${
    metaPaging.sortDirection
  }${search ? `&name=${search.trim()}` : ''}${
    types
      ? `&types=${types.join('&types=')}`
      : ''
  }`;
}

export function* getCategorySaga(action) {
  console.log(action.queries);
  const search = action.queries ? action.queries.search : '';
  const types = action.queries ? action.queries.types : [];
  const meta = yield select(getMetaPagingCategory());
  const getCategoryUrl = getMeta(meta, search, types);

  try {
    if (search) {
      yield call(delay, 1000);
    }
    const res = yield call(request, getCategoryUrl, option('GET'));

    if (!res.data) {
      const err = { message: res.message };
      throw err;
    }

    yield put(getCategoryDataSuccess(res.data));
    yield put(setMetaPagingCategory(res.meta));

    // hide progress
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains category id
 */
export function* getCategoryInfoSaga(action) {
  const urlUpdateCategory = `${URL_DOMAIN}/categories/${action.id}`;
  try {
    const res = yield call(request, urlUpdateCategory, option('GET'));

    // model invalid
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    // update categoryModel
    res.id = action.id;
    yield put(mapInfoToModel(res));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains category info from action
 */
export function* putCategoryUpdateSaga(action) {
  const urlUpdateCategory = `${URL_DOMAIN}/categories/${action.id}`;
  try {
    const res = yield call(
      request,
      urlUpdateCategory,
      option('PUT', action.category),
    );

    // model invalid
    if (res.statusCode === responseCode.validationFailed) {
      // hightlight field error
      yield put(invalidModel(res.errors));
      const err = { message: res.message };
      throw err;
    }

    // update success
    yield put(updateCategorySuccess(res.message));

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param {Object.<string, any>} action - payload contains category info from action
 */
export function* postCategoryAddSaga(action) {
  const urlAddCategory = `${URL_DOMAIN}/categories`;
  try {
    const res = yield call(
      request,
      urlAddCategory,
      option('POST', action.category),
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
    yield put(createCategorySuccess(res.message));
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

/**
 * @param(action) object: action dispatched from UI
 */
export function* deleteCategorySaga(action) {
  const urlDeleteCategory = `${URL_DOMAIN}/categories/${action.id}`;
  try {
    const res = yield call(request, urlDeleteCategory, option('DELETE'));

    if (res.statusCode && res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    // notify to category
    yield put(deleteCategorySuccess(res.message));
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getCategoryInitSaga() {
  const urlCategoryInit = `${URL_DOMAIN}/categories/init`;
  try {
    const res = yield call(request, urlCategoryInit, option('GET'));
    if (res.statusCode && res.statusCode === responseCode.internalServer) {
      // notify to SystemCATEGORY or throw exception
      const err = { message: res.message };
      throw err;
    }
    yield put(setTypeListCategory(res.types))
    return res;
  } catch (err) {
    yield put(fetchApiError(err));
  }
  return false;
}


/**
 * @param(action) object: action dispatched from UI {type: DELETE_MULTIES_CATEGORY, ids: array }
 */
export function* deleteMultipleCategorySaga(action) {
  const urlDeleteCategory = `${URL_DOMAIN}/categories?${mapIdsToQueryString(
    action.ids,
  )}`;

  try {
    const res = yield call(request, urlDeleteCategory, option('DELETE'));

    if (
      res.statusCode &&
      res.statusCode !== responseCode.ok &&
      res.statusCode !== responseCode.createNew
    ) {
      const err = { message: res.message };
      throw err;
    }

    // notify to category
    yield put(deleteMultipleCategorySuccess(res.message));
    yield delay(800);
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* categorySaga() {
  yield takeLatest(GET_CATEGORY, getCategorySaga);
  yield takeLatest(GET_CATEGORY_INIT, getCategoryInitSaga);
  yield takeLatest(GET_CATEGORY_INFO, getCategoryInfoSaga);
  yield takeLatest(UPDATE_CATEGORY, putCategoryUpdateSaga);
  yield takeLatest(ADD_CATEGORY, postCategoryAddSaga);
  yield takeLatest(DELETE_CATEGORY_ROW, deleteCategorySaga);
  yield takeLatest(DELETE_MULTIPLE_CATEGORY, deleteMultipleCategorySaga);
}
