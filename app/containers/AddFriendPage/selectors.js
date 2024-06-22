/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPassword = (state) => state.get('addFriend', initialState);

const makeSelectorPassword = () =>
  createSelector(selectPassword, (addFriendState) =>
    addFriendState.get('passwordModel'),
  );
const getUserListData = () =>
  createSelector(selectPassword, (addFriendState) =>
    addFriendState.get('userList'),
  );

const getRedirect = () =>
  createSelector(selectPassword, (addFriendState) =>
    addFriendState.get('isRedirect'),
  );

export { makeSelectorPassword, getRedirect, getUserListData };
