import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSchedule = state => state.get('schedule', initialState);

const makeScheduleDataSelector = () =>
  createSelector(selectSchedule, scheduleState => scheduleState.get('data'));

const makeScheduleModelSelector = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('scheduleModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('ajaxSuccess'),
  );

const getMetaPagingSchedule = () =>
  createSelector(selectSchedule, scheduleState => scheduleState.get('metaPaging'));
const makeModalStatusSelector = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('isOpenModal'),
  );
  const getTypeScheduleListData = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('typeList'),
  );
  const getCategoryListData = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('categories'),
  );
  const getCreatedByListData = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('accounts'),
  );
  const getDepartmentListData = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('departments'),
  );
  const getCategoryTypesData = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('categoryTypes'),
  );
  const getRemainingHolidaySelector = () =>
  createSelector(selectSchedule, scheduleState =>
    scheduleState.get('remainingHoliday'),
  );

export {
  selectSchedule,
  makeScheduleDataSelector,
  makeScheduleModelSelector,
  getAjaxInfo,
  getMetaPagingSchedule,
  getTypeScheduleListData,
  getCategoryListData,
  makeModalStatusSelector,
  getCreatedByListData,
  getDepartmentListData,
  getCategoryTypesData,
  getRemainingHolidaySelector
};
