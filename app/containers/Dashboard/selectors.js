/**
 * Homepage selectors
 */
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDashboard = (state) => state.get('dashboard', initialState);
const getDashboardDataSelector = () =>
  createSelector(selectDashboard, (state) => state.get('data'));

export {
  selectDashboard,
  getDashboardDataSelector
};
