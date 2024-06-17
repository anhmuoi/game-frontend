/*
 * setting Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  ADD_COUPON,
  CHANGE_PAGE_NUMBER_COUPON,
  CHANGE_PAGE_SIZE_COUPON,
  CHANGE_TEXT_FIELD,
  CHANGE_TEXT_FIELD_COUPON,
  CREATE_COUPON_SUCCESS,
  DELETE_COUPON_ROW,
  DELETE_COUPON_SUCCESS,
  DELETE_MULTIES_COUPON,
  DELETE_MULTIES_COUPON_SUCCESS,
  GET_COUPON_DATA,
  GET_COUPON_DATA_SUCCESS,
  GET_INIT_COUPON,
  GET_ITEMNFT_INIT,
  GET_ITEMNFT_INIT_SUCCESS,
  GET_SORT_COUPON_LIST,
  GET_SORT_DIRECTION_COUPON_LIST,
  INIT_INDEX_COUPON,
  INIT_INDEX_COUPON_SUCCESS,
  INIT_INDEX_ITEMNFT,
  INIT_INDEX_ITEMNFT_SUCCESS,
  SET_COUPON_LIST_ITEMNFT,
  SET_EXPIRED_TYPE_COUPON,
  SET_META_COUPON,
  SET_REFUND_TYPE_COUPON,
  UPDATE_COUPON,
  UPDATE_COUPON_SUCCESS,
  UPDATE_ITEMNFT,
  UPDATE_ITEMNFT_SUCCESS,
  VALIDATE_COUPON,
  VALIDATE_COUPON_ERROR,
  VALIDATE_ITEMNFT,
  VALIDATE_ITEMNFT_ERROR,
} from './constants';

export function getSettingCouponInit() {
  return {
    type: GET_ITEMNFT_INIT,
  };
}
export function getSettingCouponInitSuccess() {
  return {
    type: GET_ITEMNFT_INIT_SUCCESS,
  };
}

/**
 * @param(SETtiNG): object: contains info SETtiNG for update
 * @param(id) number: setting id
 */
export function putSettingUpdate(setting) {
  return {
    type: UPDATE_ITEMNFT,
    setting,
  };
}

/**
 * @param(id): number: id setting for get data
 */
export function getInitIndexSetting() {
  return {
    type: INIT_INDEX_ITEMNFT,
  };
}

/**
 * @param(id): number: id Coupon for get data
 */
export function getInitIndexCoupon(id) {
  return {
    type: INIT_INDEX_COUPON,
    id,
  };
}

/**
 * @param(COUPON) object , init coupon object get from api for add and edit
 */
export function getInitIndexCouponSuccess(couponModel) {
  return {
    type: INIT_INDEX_COUPON_SUCCESS,
    couponModel,
  };
}

export function setCouponListSetting(couponList) {
  return {
    type: SET_COUPON_LIST_ITEMNFT,
    couponList,
  };
}

/**
 * @param(Setting) object , init Setting object get from api for add and edit
 */
export function getInitIndexSettingSuccess(settingModel) {
  return {
    type: INIT_INDEX_ITEMNFT_SUCCESS,
    settingModel,
  };
}

/**
 * @param(name) string : name of field
 * @param(value) string: value of field
 */
export function changeTextField(name, value) {
  return {
    type: CHANGE_TEXT_FIELD,
    name,
    value,
  };
}
/**
 * @param(name) string : name of field
 * @param(value) string: value of field
 */
export function changeTextFieldCoupon(name, value) {
  return {
    type: CHANGE_TEXT_FIELD_COUPON,
    name,
    value,
  };
}

/**
 * @param(COUPON): object: contains info COUPON for update
 * @param(id) number: COUPON id
 */
export function putCouponUpdate(id, coupon) {
  return {
    type: UPDATE_COUPON,
    coupon,
    id,
  };
}

/**
 * @param(COUPON): object: contains info COUPON for add
 */
export function postCouponAdd(coupon) {
  return {
    type: ADD_COUPON,
    coupon,
  };
}

/**
 * @param(message) string: message return from server when create success
 */
export function createCouponSuccess(message) {
  return {
    type: CREATE_COUPON_SUCCESS,
    message,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateCouponSuccess(message) {
  return {
    type: UPDATE_COUPON_SUCCESS,
    message,
  };
}

/**
 * @param(id) number: id COUPON delete
 */
export function deleteCoupon(id) {
  return {
    type: DELETE_COUPON_ROW,
    id,
  };
}
/**
 * @param(message) string: message return from server when  delete success
 * @param(id) number: id COUPON is deleted
 */
export function deleteCouponSuccess(message, id) {
  return {
    type: DELETE_COUPON_SUCCESS,
    message,
    id,
  };
}

/**
 * @param(errors) object: object contains error info validation
 */
export function invalidModel(errors) {
  return {
    type: VALIDATE_ITEMNFT_ERROR,
    errors,
  };
}

/**
 * @param(message) string: message return from server when update success
 */
export function updateSettingSuccess(message) {
  return {
    type: UPDATE_ITEMNFT_SUCCESS,
    message,
  };
}

export function validateSetting(errors) {
  return {
    type: VALIDATE_ITEMNFT,
    errors,
  };
}
export function validateCoupon(errors) {
  return {
    type: VALIDATE_COUPON,
    errors,
  };
}
export function invalidModelCoupon(errors) {
  return {
    type: VALIDATE_COUPON_ERROR,
    errors,
  };
}

export function getCouponInit() {
  return {
    type: GET_INIT_COUPON,
  };
}

export function setTypeExpiredCoupon(expiredTypeCoupon) {
  return {
    type: SET_EXPIRED_TYPE_COUPON,
    expiredTypeCoupon,
  };
}
export function setTypeRefundCoupon(refundTypeCoupon) {
  return {
    type: SET_REFUND_TYPE_COUPON,
    refundTypeCoupon,
  };
}

// table coupon
export function getCouponData(title) {
  return {
    type: GET_COUPON_DATA,
    title,
  };
}
export function getCouponDataSuccess(data) {
  return {
    type: GET_COUPON_DATA_SUCCESS,
    data,
  };
}

/**
 * @param  {meta} object contains info paging
 */
export function setMetaCoupon(meta) {
  return {
    type: SET_META_COUPON,
    meta,
  };
}

/**
 * @param(pageNumber) number
 */
export function changePageNumberCoupon(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER_COUPON,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSizeCoupon(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE_COUPON,
    pageSize,
  };
}

export function getSortCouponList(sortColumn, cloneSortColumn) {
  return {
    type: GET_SORT_COUPON_LIST,
    sortColumn,
    cloneSortColumn,
  };
}

export function getSortDirectionCouponList() {
  return {
    type: GET_SORT_DIRECTION_COUPON_LIST,
  };
}

/**
 * @param(ids) array: ids COUPON delete
 */
export function deleteMultiesCoupon(ids) {
  return {
    type: DELETE_MULTIES_COUPON,
    ids,
  };
}

export function deleteMultiesCouponSuccess(message, ids) {
  return {
    type: DELETE_MULTIES_COUPON_SUCCESS,
    message,
    ids,
  };
}
