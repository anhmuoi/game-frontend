/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectItemNft = (state) => state.get('itemNft', initialState);

const getSettingDataModified = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('settingModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('ajaxSuccess'),
  );
const getCouponList = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('couponList'),
  );
const getExpiredTypeCoupon = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('expiredTypeCoupon'),
  );
const getRefundTypeCoupon = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('refundTypeCoupon'),
  );
const getCouponDataModified = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('couponModel'),
  );

// coupon table
const getMetaPagingCoupon = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('metaPagingCoupon'),
  );
const getCouponDataSelector = () =>
  createSelector(selectItemNft, (settingState) =>
    settingState.get('couponData'),
  );

export {
  selectItemNft,
  getSettingDataModified,
  getAjaxInfo,
  getCouponList,
  getCouponDataModified,
  getExpiredTypeCoupon,
  getRefundTypeCoupon,
  // table coupon
  getMetaPagingCoupon,
  getCouponDataSelector,
};
