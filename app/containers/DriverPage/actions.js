import {
  GET_INIT_SUCCESS,
  GET_INIT,
  GET_DOCUMENT_BY_ID,
  GET_DOCUMENT_BY_ID_SUCCESS,
  ADD_FOLDER,
  ADD_FILE,
  DELETE_FOLDER,
  DELETE_FILE,
  EDIT_FOLDER,
  EDIT_FILE,
  DOWNLOAD_FOLDER,
  DOWNLOAD_FILE,
  ADD_ITEM_TO_LIST_LINK_FOLDER,
  ADD_ITEM_TO_LIST_LINK_FOLDER_SUCCESS,
  GET_USERS_SHARED,
  GET_USERS_SHARED_SUCCESS,
  SHARE_DOCUMENT,
  UN_SHARE_DOCUMENT,
  GET_USERS_NOT_SHARED,
  GET_USERS_NOT_SHARED_SUCCESS,
  GET_DOCUMENT_SHARED_WITH_ME,
  GET_DOCUMENT_SHARED_WITH_ME_SUCCESS,
} from './constants';

export function getInitSuccess(data) {
  return {
    type: GET_INIT_SUCCESS,
    data: data
  };
}

export function getInit(rootFolderId) {
  return {
    type: GET_INIT,
    rootFolderId,
  };
}

export function getDocumentById(id, meta) {
  return {
    type: GET_DOCUMENT_BY_ID,
    id,
    meta,
  };
}

export function getDocumentByIdSuccess(data) {
  return {
    type: GET_DOCUMENT_BY_ID_SUCCESS,
    data: data
  };
}

export function addFolder(folder, rootFolderId) {
  return {
    type: ADD_FOLDER,
    folder,
    rootFolderId,
  };
}

export function addFile(files, rootFolderId, parentId) {
  return {
    type: ADD_FILE,
    files,
    rootFolderId,
    parentId,
  };
}

export function deleteFolder(ids, parentId) {
  return {
    type: DELETE_FOLDER,
    ids,
    parentId,
  };
}

export function deleteFile(ids, parentId) {
  return {
    type: DELETE_FILE,
    ids,
    parentId,
  };
}

export function editFolder(data, parentId) {
  return {
    type: EDIT_FOLDER,
    parentId,
    data,
  };
}

export function editFile(data, parentId) {
  return {
    type: EDIT_FILE,
    parentId,
    data,
  };
}

export function downloadFolder(id, name) {
  return {
    type: DOWNLOAD_FOLDER,
    id,
    name,
  };
}

export function downloadFile(id, name) {
  return {
    type: DOWNLOAD_FILE,
    id,
    name,
  };
}

export function addItemToListLinkFolder(data) {
  return {
    type: ADD_ITEM_TO_LIST_LINK_FOLDER,
    data,
  }
}

export function addItemToListLinkFolderSuccess(data) {
  return {
    type: ADD_ITEM_TO_LIST_LINK_FOLDER_SUCCESS,
    data,
  }
}

export function getUsersShared(meta, folderId, fileId) {
  return {
    type: GET_USERS_SHARED,
    meta,
    folderId,
    fileId,
  }
}

export function getUsersSharedSuccess(data, meta) {
  return {
    type: GET_USERS_SHARED_SUCCESS,
    data,
    meta,
  }
}

// data: userIds, permissionId, folderId, fileId, metaShared, metaNotShared
export function shareDocument(data) {
  return {
    type: SHARE_DOCUMENT,
    data,
  }
}

// data: userIds, permissionId, folderId, fileId, metaShared, metaNotShared
export function unShareDocument(data) {
  return {
    type: UN_SHARE_DOCUMENT,
    data,
  }
}

export function getUsersNotShared(meta, folderId, fileId) {
  return {
    type: GET_USERS_NOT_SHARED,
    meta,
    folderId,
    fileId,
  }
}

export function getUsersNotSharedSuccess(data, meta) {
  return {
    type: GET_USERS_NOT_SHARED_SUCCESS,
    data,
    meta,
  }
}

export function getDocumentSharedWithMe(meta) {
  return {
    type: GET_DOCUMENT_SHARED_WITH_ME,
    meta,
  };
}

export function getDocumentSharedWithMeSuccess(data) {
  return {
    type: GET_DOCUMENT_SHARED_WITH_ME_SUCCESS,
    data: data
  };
}