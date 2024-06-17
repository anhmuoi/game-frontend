/*
 * MARKETReducer
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
  CHANGE_PAGE_NUMBER_MARKET,
  CHANGE_PAGE_SIZE_MARKET,
  CHANGE_TEXT_FIELD,
  CREATE_MARKET_SUCCESS,
  DELETE_MULTIES_MARKET_SUCCESS,
  DELETE_MARKET_SUCCESS,
  GET_SORT_DIRECTION_MARKET_LIST,
  GET_SORT_MARKET_LIST,
  GET_MARKET_DATA_SUCCESS,
  INIT_INDEX_MARKET_SUCCESS,
  SET_META_MARKET,
  SET_STATUS_LIST_MARKET,
  UPDATE_MARKET_SUCCESS,
  VALIDATE_MARKET,
  VALIDATE_MARKET_ERROR,
  SET_GENDER_LIST_MARKET,
  SET_DEPARTMENTS_LIST_MARKET,
  SET_WORKTYPES_LIST_MARKET,
  UPDATE_AVATAR,
  SET_STORE_LIST_WAITING,
} from './constants.js';
import { mergeMetaPaging, mergeState } from './functions.js';

// The initial state of the App
export const initialState = fromJS({
  data: [],
  marketModel: {
    id: { value: 0, errorMessage: false },
    address: { value: '', errorMessage: false },
    name: { value: '', errorMessage: false },
    description: { value: '', errorMessage: false },
    image: { value: '', errorMessage: false },
    mana: { value: 0, errorMessage: false },
    aliasId: { value: '', errorMessage: false },
    price: { value: 0, errorMessage: false },
    status: { value: 0, errorMessage: false },
    itemNftId: { value: 0, errorMessage: false },
    userId: { value: 0, errorMessage: false },
  },

  storeList: [],

  ajaxSuccess: { value: false, message: '' },
  isRedirect: { value: false, route: '' },
  metaPaging: {
    recordsTotal: 1,
    recordsFiltered: 1,
    sortDirection: 'desc',
    sortColumn: 'Name',
    cloneSortColumn: 0,
    orderBy: '',
    pageNumber: 1,
    pageSize: 25,
  },
});

function marketReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE_NUMBER_MARKET:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE_MARKET:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case SET_META_MARKET:
      return state.set(
        'metaPaging',
        fromJS(mergeMetaPaging(state.toJS().metaPaging, action.meta)),
      );

    case SET_STORE_LIST_WAITING:
      return state.set('storeList', action.storeList);

    case DELETE_MULTIES_MARKET_SUCCESS:
    case DELETE_MARKET_SUCCESS:
    case UPDATE_MARKET_SUCCESS:
    case CREATE_MARKET_SUCCESS:
      return state.set(
        'ajaxSuccess',
        fromJS({ value: true, message: action.message }),
      );
    case VALIDATE_MARKET_ERROR:
      return state.set(
        'marketModel',
        fromJS(mergeState(state.toJS().marketModel, action.errors)),
      );
    case VALIDATE_MARKET:
      return state.set(
        'marketModel',
        fromJS(mergeState(state.toJS().marketModel, action.errors)),
      );
    case CHANGE_TEXT_FIELD:
      return state.setIn(['marketModel', action.name], {
        value: action.value,
        errorMessage: false,
      });
    case GET_MARKET_DATA_SUCCESS:
      return state
        .set('ajaxSuccess', fromJS({ value: false, message: '' }))
        .set('data', action.data)
        .set('isRedirect', fromJS({ value: false, route: '' }));
    case INIT_INDEX_MARKET_SUCCESS:
      return state
        .set('marketModel', fromJS(action.marketModel))
        .set('ajaxSuccess', fromJS({ value: false, message: '' }));

    case GET_SORT_MARKET_LIST:
      return state
        .setIn(['metaPaging', 'sortColumn'], action.sortColumn)
        .setIn(['metaPaging', 'cloneSortColumn'], action.cloneSortColumn);
    case GET_SORT_DIRECTION_MARKET_LIST:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}

export default marketReducer;
