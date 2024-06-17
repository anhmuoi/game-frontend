/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('groupUser', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (groupUserState) => groupUserState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (groupUserState) =>
    groupUserState.get('storeList'),
  );

const getMarketDataModified = () =>
  createSelector(selectMarket, (groupUserState) =>
    groupUserState.get('groupUserModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMarket, (groupUserState) =>
    groupUserState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (groupUserState) =>
    groupUserState.get('metaPaging'),
  );
const getUserListData = () =>
  createSelector(selectMarket, (roomDetailState) =>
    roomDetailState.get('userList'),
  );

export {
  selectMarket,
  getMarketDataSelector,
  getMarketDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingMarket,
  getstoreListData,
  getUserListData,
};
