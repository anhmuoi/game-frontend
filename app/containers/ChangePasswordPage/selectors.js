/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('ChangePassword', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (ChangePasswordState) =>
    ChangePasswordState.get('data'),
  );

const getstoreListData = () =>
  createSelector(selectMarket, (ChangePasswordState) =>
    ChangePasswordState.get('storeList'),
  );

const getMarketDataModified = () =>
  createSelector(selectMarket, (ChangePasswordState) =>
    ChangePasswordState.get('ChangePasswordModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMarket, (ChangePasswordState) =>
    ChangePasswordState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (ChangePasswordState) =>
    ChangePasswordState.get('metaPaging'),
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
