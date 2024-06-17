/*
 * ITEMNFTReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  CHANGE_PAGE_NUMBER_COUPON,
  CHANGE_PAGE_SIZE_COUPON,
  CHANGE_TEXT_FIELD,
  CHANGE_TEXT_FIELD_COUPON,
  CREATE_COUPON_SUCCESS,
  DELETE_COUPON_SUCCESS,
  DELETE_MULTIES_COUPON_SUCCESS,
  GET_COUPON_DATA_SUCCESS,
  GET_ITEMNFT_INIT_SUCCESS,
  GET_SORT_COUPON_LIST,
  GET_SORT_DIRECTION_COUPON_LIST,
  INIT_INDEX_COUPON_SUCCESS,
  INIT_INDEX_ITEMNFT_SUCCESS,
  SET_COUPON_LIST_ITEMNFT,
  SET_EXPIRED_TYPE_COUPON,
  SET_META_COUPON,
  SET_REFUND_TYPE_COUPON,
  UPDATE_COUPON_SUCCESS,
  UPDATE_ITEMNFT_SUCCESS,
  VALIDATE_COUPON,
  VALIDATE_COUPON_ERROR,
  VALIDATE_ITEMNFT,
  VALIDATE_ITEMNFT_ERROR,
} from './constants';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  settingModel: {
    welcomeCoupon: {
      value: {
        couponId: 0,
      },
      errorMessage: false,
    },
    visitCoupon: {
      value: {
        couponId: 0,
        visitedTime: 5,
      },
      errorMessage: false,
    },
    memberLevel: {
      value: {
        couponId: 0,
        point: 5000,
      },
      errorMessage: false,
    },
    birthdayCoupon: {
      value: {
        couponId: 0,
      },
      errorMessage: false,
    },
  },

  couponModel: {
    name: { value: '', message: '' },
    description: { value: '', message: '' },
    aliasId: { value: '', message: '' },
    image: { value: '', message: '' },
    mana: { value: 0, message: '' },
  },

  couponList: [],
  expiredTypeCoupon: [],

  ajaxSuccess: { value: false, message: '' },

  couponData: [],
  metaPagingCoupon: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'asc',
    sortColumn: 'title',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function settingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXPIRED_TYPE_COUPON:
      return state.set('expiredTypeCoupon', action.expiredTypeCoupon);
    case SET_REFUND_TYPE_COUPON:
      return state.set('refundTypeCoupon', action.refundTypeCoupon);
    case SET_COUPON_LIST_ITEMNFT:
      return state.set('couponList', action.couponList);

    case UPDATE_ITEMNFT_SUCCESS:
      return state;
    case VALIDATE_ITEMNFT_ERROR:
      return state.set(
        'settingModel',
        fromJS(mergeState(state.toJS().settingModel, action.errors)),
      );
    case VALIDATE_ITEMNFT:
      return state.set(
        'settingModel',
        fromJS(mergeState(state.toJS().settingModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['settingModel', action.name], {
        value: action.value,
        errorMessage: false,
      });

    case INIT_INDEX_ITEMNFT_SUCCESS:
      return state
        .set('settingModel', fromJS(action.settingModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case CHANGE_TEXT_FIELD_COUPON:
      return state.setIn(['couponModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case INIT_INDEX_COUPON_SUCCESS:
      return state
        .set('couponModel', fromJS(action.couponModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));
    case GET_ITEMNFT_INIT_SUCCESS:
      return state.set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case VALIDATE_COUPON_ERROR:
      return state.set(
        'couponModel',
        fromJS(mergeState(state.toJS().couponModel, action.errors)),
      );
    case VALIDATE_COUPON:
      return state.set(
        'couponModel',
        fromJS(mergeState(state.toJS().couponModel, action.errors)),
      );
    case DELETE_COUPON_SUCCESS:
    case UPDATE_COUPON_SUCCESS:
    case DELETE_MULTIES_COUPON_SUCCESS:
    case CREATE_COUPON_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );

    // table coupon
    case GET_COUPON_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('couponData', action.data);
    case CHANGE_PAGE_NUMBER_COUPON:
      return state.setIn(['metaPagingCoupon', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_COUPON:
      return state.setIn(['metaPagingCoupon', 'pageSize'], action.pageSize);
    case SET_META_COUPON:
      return state.set(
        'metaPagingCoupon',
        fromJS(mergeMetaPaging(state.toJS().metaPagingCoupon, action.meta)),
      );
    case GET_SORT_COUPON_LIST:
      return state
        .setIn(['metaPagingCoupon', 'sortColumn'], action.sortColumn)
        .setIn(['metaPagingCoupon', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_COUPON_LIST:
      if (state.getIn(['metaPagingCoupon', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPagingCoupon', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPagingCoupon', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default settingReducer;
