import { fromJS } from 'immutable';

import {
  GET_INIT_SUCCESS,
  GET_DOCUMENT_BY_ID_SUCCESS,
  ADD_ITEM_TO_LIST_LINK_FOLDER_SUCCESS,
  GET_USERS_SHARED_SUCCESS,
  GET_USERS_NOT_SHARED_SUCCESS,
  GET_DOCUMENT_SHARED_WITH_ME_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  permissions: [],
  rootFolderId: 0,
  document: {
    data: [],
    meta: {},
  },
  listLinkFolders: [],
  usersShared: [],
  metaUsersShared: {
    name: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'name',
    sortDirection: 'asc',
    recordsTotal: 0,
    recordsFiltered: 0,
  },
  usersNotShared: [],
  metaUsersNotShared: {
    name: '',
    pageNumber: 1,
    pageSize: 25,
    sortColumn: 'name',
    sortDirection: 'asc',
    recordsTotal: 0,
    recordsFiltered: 0,
  },
});

function driverReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INIT_SUCCESS:
      return state.set('permissions', action.data.permissions)
        .set('rootFolderId', action.data.rootFolderId);
    case GET_DOCUMENT_BY_ID_SUCCESS:
    case GET_DOCUMENT_SHARED_WITH_ME_SUCCESS:
      return state.setIn(['document', 'data'], action.data.data)
        .setIn(['document', 'meta'], action.data.meta);
    case ADD_ITEM_TO_LIST_LINK_FOLDER_SUCCESS:
      return state.set('listLinkFolders', action.data);
    case GET_USERS_SHARED_SUCCESS:
      return state.set('usersShared', action.data)
        .set('metaUsersShared', action.meta);
    case GET_USERS_NOT_SHARED_SUCCESS:
      return state.set('usersNotShared', action.data)
        .set('metaUsersNotShared', action.meta);
    default:
      return state;
  }
}

export default driverReducer;