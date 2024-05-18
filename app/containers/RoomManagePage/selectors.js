/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRoomManage = (state) => state.get('roomManage', initialState);

const getRoomManageDataSelector = () =>
  createSelector(selectRoomManage, (roomManageState) =>
    roomManageState.get('data'),
  );

const getstoreListData = () =>
  createSelector(selectRoomManage, (roomManageState) =>
    roomManageState.get('storeList'),
  );

const getRoomManageDataModified = () =>
  createSelector(selectRoomManage, (roomManageState) =>
    roomManageState.get('roomManageModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectRoomManage, (roomManageState) =>
    roomManageState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectRoomManage, (userState) => userState.get('isRedirect'));

const getMetaPagingRoomManage = () =>
  createSelector(selectRoomManage, (roomManageState) =>
    roomManageState.get('metaPaging'),
  );

export {
  selectRoomManage,
  getRoomManageDataSelector,
  getRoomManageDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingRoomManage,
  getstoreListData,
};
