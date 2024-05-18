import {
  GET_LIST_NOTIFICATION,
  GET_LIST_SHORT_NOTIFICATION,
  DELETE_NOTIFICATION,
  CHANGE_NOTIFICATION_STATUS,
  DELETE_ALL_READ,
  MARK_ALL_AS_READ,
  GO_NOTIFICATION_DETAIL,
  CHANGE_PAGE_NUMBER,
  CHANGE_PAGE_SIZE,
  GET_SORT_NOTIFICATION,
  GET_SORT_DIRECTION_NOTIFICATION,
} from './constants';

export function getNotificationList(paging) {
  return {
    type: GET_LIST_NOTIFICATION,
    paging,
  };
}

export function getNotificationShortList() {
  return {
    type: GET_LIST_SHORT_NOTIFICATION,
  };
}

export function deleteNotification(id) {
  return {
    type: DELETE_NOTIFICATION,
    id,
  };
}

export function changeNotificationStatus(id, status) {
  return {
    type: CHANGE_NOTIFICATION_STATUS,
    id,
    status,
  };
}

export function deleteAllRead() {
  return {
    type: DELETE_ALL_READ,
  };
}

export function markAllRead() {
  return {
    type: MARK_ALL_AS_READ,
  };
}

export function notificationDetail(notif) {
  return {
    type: GO_NOTIFICATION_DETAIL,
    id: notif.id,
    url: notif.relatedUrl,
    isGoDetail: true,
    status: true,
  };
}

/**
 * @param {number} pageNumber
 */
export function changePageNumber(pageNumber) {
  return {
    type: CHANGE_PAGE_NUMBER,
    pageNumber,
  };
}

/**
 * @param(pageSize) number
 */
export function changePageSize(pageSize) {
  return {
    type: CHANGE_PAGE_SIZE,
    pageSize,
  };
}

export function getSortNotification(sortColumn) {
  return {
    type: GET_SORT_NOTIFICATION,
    sortColumn,
  };
}

export function getSortDirectionNotification() {
  return {
    type: GET_SORT_DIRECTION_NOTIFICATION,
  };
}
