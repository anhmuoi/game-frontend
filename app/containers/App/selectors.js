/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

const selectGlobal = state => state.get('global');

const selectRoute = state => state.get('route');

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('loading'));

const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.get('error'));

const makeSelectNotifySuccess = () =>
  createSelector(selectGlobal, globalState => globalState.get('notifySuccess'));

const getAuthInfo = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'isAuthed']),
  );

const makeSelectLocation = () =>
  createSelector(selectRoute, routeState => routeState.get('location'));

const makeSelectMetaPaging = () =>
  createSelector(selectGlobal, globalState => globalState.get('metaPaging'));

const getRoleUser = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'accountType']),
  );

const makeSelectSuccess = () =>
  createSelector(selectGlobal, globalState => globalState.get('success'));

const makeSelectLogo = () =>
  createSelector(selectGlobal, globalState => globalState.get('logo'));

const getProcessListObj = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('processListObj'),
  );

const getStoredProcessListObj = pageName =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['storedProcessListObj', pageName], fromJS({})),
  );

const getUserName = () =>
  createSelector(selectGlobal, globalState => globalState.get('username'));

const getAccountTimezoneSelector = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('accountTimezone'),
  );
export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectNotifySuccess,
  makeSelectLocation,
  getAuthInfo,
  makeSelectMetaPaging,
  getRoleUser,
  makeSelectSuccess,
  makeSelectLogo,
  getProcessListObj,
  getStoredProcessListObj,
  getUserName,
  getAccountTimezoneSelector,
};
