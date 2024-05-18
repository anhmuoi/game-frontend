import { fromJS } from 'immutable';
import {
  GET_LIST_SHORT_NOTIFICATION_SUCCESS,
  GET_LIST_NOTIFICATION_SUCCESS,
  CHANGE_PAGE_NUMBER,
  CHANGE_PAGE_SIZE,
  GET_SORT_NOTIFICATION,
  GET_SORT_DIRECTION_NOTIFICATION,
} from './constants';
import { mergeMetaPaging } from '../../containers/App/appUtilities';

export const initialState = fromJS({
  notificationShortList: [],
  notificationList: [],
  totalUnRead: 0,
  metaPaging: {
    recordsTotal: 0,
    recordsFiltered: 0,
    sortDirection: 'desc',
    sortColumn: 1,
    orderBy: '',
    pageNumber: 1,
    pageSize: 10,
  },
});

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LIST_NOTIFICATION_SUCCESS: {
      return state
        .set('totalUnRead', action.notifications.meta.totalUnRead)
        .set(
          'metaPaging',
          fromJS(
            mergeMetaPaging(
              state.get('metaPaging').toJSON(),
              action.notifications.meta,
            ),
          ),
        )
        .set('notificationList', action.notifications.data);
    }
    case GET_LIST_SHORT_NOTIFICATION_SUCCESS: {
      return state
        .set('totalUnRead', action.shortNotifications.meta.totalUnRead)
        .set('notificationShortList', action.shortNotifications.data);
    }
    case CHANGE_PAGE_NUMBER:
      return state.setIn(['metaPaging', 'pageNumber'], action.pageNumber);
    case CHANGE_PAGE_SIZE:
      return state.setIn(['metaPaging', 'pageSize'], action.pageSize);
    case GET_SORT_NOTIFICATION:
      return state.setIn(['metaPaging', 'sortColumn'], action.sortColumn);
    case GET_SORT_DIRECTION_NOTIFICATION:
      if (state.getIn(['metaPaging', 'sortDirection']) === 'asc') {
        return state.setIn(['metaPaging', 'sortDirection'], 'desc');
      }
      return state.setIn(['metaPaging', 'sortDirection'], 'asc');
    default:
      return state;
  }
}
