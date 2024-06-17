/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPassword = (state) => state.get('joinGroup', initialState);

const makeSelectorPassword = () =>
  createSelector(selectPassword, (joinGroupState) =>
    joinGroupState.get('passwordModel'),
  );
const getUserListData = () =>
  createSelector(selectPassword, (joinGroupState) =>
    joinGroupState.get('userList'),
  );

const getRedirect = () =>
  createSelector(selectPassword, (joinGroupState) =>
    joinGroupState.get('isRedirect'),
  );

export { makeSelectorPassword, getRedirect, getUserListData };
