/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('myGroup', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (myGroupState) => myGroupState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (myGroupState) => myGroupState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (myGroupState) =>
    myGroupState.get('myGroupModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMarket, (myGroupState) =>
    myGroupState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (myGroupState) =>
    myGroupState.get('metaPaging'),
  );
const getUserListData = () =>
  createSelector(selectMarket, (roomDetailState) =>
    roomDetailState.get('userList'),
  );
const getFriendListDataSelector = () =>
  createSelector(selectMarket, (roomDetailState) =>
    roomDetailState.get('friendList'),
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
  getFriendListDataSelector,
};
