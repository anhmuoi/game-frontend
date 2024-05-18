import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectRole = state => state.get('roleSetting', initialState);

export const makeSelectRoleList = () =>
  createSelector(selectRole, state => state.get('roleData'));

export const makeSelectRoleModel = () =>
  createSelector(selectRole, state => state.get('roleModel'));

export const makeSelectSimilarId = () =>
  createSelector(selectRole, state => state.get('similarId'));
