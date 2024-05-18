import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectNotification = state =>
  state.get('notification', initialState);

export const makeNotificationSelector = () =>
  createSelector(selectNotification, state => state.get('notificationList'));

export const makeNotificationShortListSelector = () =>
  createSelector(selectNotification, state =>
    state.get('notificationShortList'),
  );

export const makeUnreadCountNotificationSelector = () =>
  createSelector(selectNotification, state => state.get('totalUnRead'));

export const getMetaPaging = () =>
  createSelector(selectNotification, state => state.get('metaPaging'));
