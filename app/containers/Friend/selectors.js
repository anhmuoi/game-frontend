/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('friend', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (friendState) => friendState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (friendState) => friendState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (friendState) => friendState.get('friendModel'));

const getAjaxInfo = () =>
  createSelector(selectMarket, (friendState) => friendState.get('ajaxSuccess'));
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (friendState) => friendState.get('metaPaging'));
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
