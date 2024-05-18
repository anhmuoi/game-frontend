import { URL_DOMAIN } from 'utils/constants';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request, { option, responseCode, checkRes } from 'utils/request';
import { fetchApiError, loadSuccess, notifySuccess } from 'containers/App/actions';
import {
  GET_INIT,
  GET_DOCUMENT_BY_ID,
  ADD_FOLDER,
  ADD_FILE,
  DELETE_FOLDER,
  DELETE_FILE,
  GET_ROOT_FOLDER,
  EDIT_FOLDER,
  EDIT_FILE,
  DOWNLOAD_FOLDER,
  DOWNLOAD_FILE,
  ADD_ITEM_TO_LIST_LINK_FOLDER,
  GET_USERS_SHARED,
  SHARE_DOCUMENT,
  UN_SHARE_DOCUMENT,
  GET_USERS_NOT_SHARED,
  GET_DOCUMENT_SHARED_WITH_ME,
} from './constants';
import {
  getInitSuccess,
  getDocumentByIdSuccess,
  addItemToListLinkFolderSuccess,
  getUsersSharedSuccess,
  getUsersNotSharedSuccess,
  getDocumentSharedWithMeSuccess,
} from './actions';

export function* getInit(action) {
  let url = `${URL_DOMAIN}/driver/init`;
  if (action.rootFolderId != null) {
    url += `?rootFolderId=${action.rootFolderId}`;
  }
  try {
    const res = yield call(request, url, option('GET'));

    if (!action.rootFolderId) {
      if (action.rootFolderId === 0) {
        // shared with me
        const urlGetRootFolder = `${URL_DOMAIN}/driver/shared-with-me?pageSize=-1`;
        const resGetRootFolder = yield call(request, urlGetRootFolder, option('GET'));
        yield put(getDocumentSharedWithMeSuccess(resGetRootFolder));

        yield put(getInitSuccess(res));
        yield put(addItemToListLinkFolderSuccess([{
          id: res.rootFolderId,
          name: res.rootFolderName,
        }]));
      } else {
        // my drive
        const urlGetRootFolder = `${URL_DOMAIN}/folders/${res.rootFolderId}/document?pageSize=-1`;
        const resGetRootFolder = yield call(request, urlGetRootFolder, option('GET'));
        yield put(getDocumentByIdSuccess(resGetRootFolder));

        yield put(getInitSuccess(res));
        yield put(addItemToListLinkFolderSuccess([{
          id: res.rootFolderId,
          name: res.rootFolderName,
        }]));
      }
    } else {
      const urlGetRootFolder = `${URL_DOMAIN}/folders/${action.rootFolderId}/document?pageSize=-1`;
      const resGetRootFolder = yield call(request, urlGetRootFolder, option('GET'));
      yield put(getDocumentByIdSuccess(resGetRootFolder));

      yield put(getInitSuccess({ ...res, rootFolderId: action.rootFolderId }));
      yield put(addItemToListLinkFolderSuccess([{
        id: res.rootFolderId,
        name: res.rootFolderName,
      }]));
    }

    // hide progress
    yield put(loadSuccess());
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* getDocumentById(action) {
  let url = `${URL_DOMAIN}/folders/${action.id}/document?pageSize=-1`;
  if (action.meta) {
    if (action.meta.sortColumn) {
      url += `&sortColumn=${action.meta.sortColumn}`;
    }
    if (action.meta.sortDirection) {
      url += `&sortDirection=${action.meta.sortDirection}`;
    }
  }

  try {
    const res = yield call(request, url, option('GET'));
    let cloneMeta = action.meta ? action.meta : {};
    yield put(getDocumentByIdSuccess({
      data: res.data,
      meta: {
        ...res.data,
        ...cloneMeta,
      }
    }));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* addFolder(action) {
  const url = `${URL_DOMAIN}/folders`;
  try {
    const res = yield call(request, url, option('POST', action.folder));
    if (res.statusCode !== responseCode.createNew) {
      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    yield put(loadSuccess());

    // get root folder
    yield call(getRootFolder, action.rootFolderId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* addFile(action) {
  try {
    const url = `${URL_DOMAIN}/files`;
    for (let i = 0; i < action.files.length; i++) {
      const formData = new FormData();
      const file = action.files[i];
      formData.append('file', file);
      formData.append('folderId', action.parentId ? action.parentId : action.rootFolderId);
      const res = yield call(request, url, option('POST', formData));
      if (res.statusCode !== responseCode.createNew) {
        const err = { message: res.message };
        throw err;
      }

      yield put(notifySuccess(res.message + `(${file.name})`));
    }

    yield put(loadSuccess());
    // get root folder
    yield call(getRootFolder, action.rootFolderId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteFolder(action) {
  try {
    let url = `${URL_DOMAIN}/folders?`;
    action.ids.forEach((e, i) => {
      url += `ids=${e}&`;
    });
    const res = yield call(request, url, option('DELETE'));
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    yield put(loadSuccess());

    // get root folder
    yield call(getRootFolder, action.parentId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* deleteFile(action) {
  try {
    let url = `${URL_DOMAIN}/files?`;
    action.ids.forEach((e, i) => {
      url += `ids=${e}&`;
    });
    const res = yield call(request, url, option('DELETE'));
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    yield put(loadSuccess());

    // get root folder
    yield call(getRootFolder, action.parentId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* editFolder(action) {
  try {
    const url = `${URL_DOMAIN}/folders/${action.data.id}`;
    const res = yield call(request, url, option('PUT', action.data));
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    yield put(loadSuccess());

    // get root folder
    yield call(getRootFolder, action.parentId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* editFile(action) {
  try {
    const url = `${URL_DOMAIN}/files/${action.data.id}`;
    const res = yield call(request, url, option('PUT', action.data));
    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.message };
      throw err;
    }

    yield put(notifySuccess(res.message));
    yield put(loadSuccess());

    // get root folder
    yield call(getRootFolder, action.parentId);
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export function* downloadFolder(action) {
  let url = `${URL_DOMAIN}/folders/${action.id}/download`;

  try {
    const res = yield call(
      request,
      url,
      option('GET', null, 'blob'),
      makeSaveFileFunc(`${action.name}.zip`),
    );
    if (res.status !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* downloadFile(action) {
  let url = `${URL_DOMAIN}/files/${action.id}/download`;

  try {
    const res = yield call(
      request,
      url,
      option('GET', null, 'blob'),
      makeSaveFileFunc(action.name),
    );
    if (res.status !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }
    yield put(notifySuccess(res.message));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

const makeSaveFileFunc = (fileName) => {
  const saveFile = (response) => {
    if (response.status === responseCode.ok) {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(
          new Blob([response.data], { type: response.headers['content-type'] }),
          `${fileName}`,
        );
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers['content-type'] }),
        );

        link.download = `${fileName}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    return response;
  };
  return saveFile;
};

export function* getRootFolder(parentId) {
  const urlGetRootFolder = `${URL_DOMAIN}/folders/${parentId}/document?pageSize=-1`;
  const resGetRootFolder = yield call(request, urlGetRootFolder, option('GET'));
  yield put(getDocumentByIdSuccess(resGetRootFolder));
}

export function* addItemToListLinkFolder(action) {
  yield put(addItemToListLinkFolderSuccess(action.data));
}

export function* getUsersShared(action) {
  let url = '';
  if (action.folderId) {
    url = `${URL_DOMAIN}/folders/${action.folderId}/share`;
  } else if (action.fileId) {
    url = `${URL_DOMAIN}/files/${action.fileId}/share`;
  }

  url += `?pageNumber=${action.meta.pageNumber}&pageSize=${action.meta.pageSize}&sortColumn=${action.meta.sortColumn}&sortDirection=${action.meta.sortDirection}`;
  if (action.meta.name) {
    url += `&name=${action.meta.name}`;
  }

  try {
    const res = yield call(request, url, option('GET'));
    yield put(getUsersSharedSuccess(res.data, {
      ...action.meta,
      ...res.meta,
    }));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

// action.data: userIds, permissionId, folderId, fileId, metaShared, metaNotShared
export function* shareDocument(action) {
  let url = '';
  if (action.data.folderId) {
    url = `${URL_DOMAIN}/folders/${action.data.folderId}/share`;
  } else if (action.data.fileId) {
    url = `${URL_DOMAIN}/files/${action.data.fileId}/share`;
  }

  try {
    const res = yield call(request, url, option('POST', {
      permissionId: action.data.permissionId,
      userIds: action.data.userIds,
    }));

    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }

    yield put(notifySuccess(res.message));

    if (action.data.metaShared) {
      yield call(getUsersShared, {
        type: GET_USERS_SHARED,
        meta: action.data.metaShared,
        folderId: action.data.folderId,
        fileId: action.data.fileId,
      });
    }

    if (action.data.metaNotShared) {
      yield call(getUsersNotShared, {
        type: GET_USERS_NOT_SHARED,
        meta: action.data.metaNotShared,
        folderId: action.data.folderId,
        fileId: action.data.fileId,
      });
    }

    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

// action.data: userIds, permissionId, folderId, fileId, metaShared, metaNotShared
export function* unShareDocument(action) {
  let url = '';
  if (action.data.folderId) {
    url = `${URL_DOMAIN}/folders/${action.data.folderId}/not-share`;
  } else if (action.data.fileId) {
    url = `${URL_DOMAIN}/files/${action.data.fileId}/not-share`;
  }

  try {
    const res = yield call(request, url, option('POST', {
      permissionId: action.data.permissionId,
      userIds: action.data.userIds,
    }));

    if (res.statusCode !== responseCode.ok) {
      const err = { message: res.messages };
      throw err;
    }

    yield put(notifySuccess(res.message));

    if (action.data.metaShared) {
      yield call(getUsersShared, {
        type: GET_USERS_SHARED,
        meta: action.data.metaShared,
        folderId: action.data.folderId,
        fileId: action.data.fileId,
      });
    }

    if (action.data.metaNotShared) {
      yield call(getUsersNotShared, {
        type: GET_USERS_NOT_SHARED,
        meta: action.data.metaNotShared,
        folderId: action.data.folderId,
        fileId: action.data.fileId,
      });
    }

    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* getUsersNotShared(action) {
  let url = '';
  if (action.folderId) {
    url = `${URL_DOMAIN}/folders/${action.folderId}/not-share`;
  } else if (action.fileId) {
    url = `${URL_DOMAIN}/files/${action.fileId}/not-share`;
  }

  url += `?pageNumber=${action.meta.pageNumber}&pageSize=${action.meta.pageSize}&sortColumn=${action.meta.sortColumn}&sortDirection=${action.meta.sortDirection}`;
  if (action.meta.name) {
    url += `&name=${action.meta.name}`;
  }

  try {
    const res = yield call(request, url, option('GET'));
    yield put(getUsersNotSharedSuccess(res.data, {
      ...action.meta,
      ...res.meta,
    }));
    yield put(loadSuccess());
  } catch (e) {
    yield put(fetchApiError(e));
  }
}

export function* getDocumentSharedWithMe(action) {
  let url = `${URL_DOMAIN}/driver/shared-with-me?pageSize=-1`;
  if (action.meta) {
    if (action.meta.sortColumn) {
      url += `&sortColumn=${action.meta.sortColumn}`;
    }
    if (action.meta.sortDirection) {
      url += `&sortDirection=${action.meta.sortDirection}`;
    }
  }

  try {
    const res = yield call(request, url, option('GET'));
    let cloneMeta = action.meta ? action.meta : {};
    yield put(getDocumentSharedWithMeSuccess({
      data: res.data,
      meta: {
        ...res.data,
        ...cloneMeta,
      }
    }));
  } catch (err) {
    yield put(fetchApiError(err));
  }
}

export default function* driverData() {
  yield takeLatest(GET_INIT, getInit);
  yield takeLatest(GET_DOCUMENT_BY_ID, getDocumentById);
  yield takeLatest(ADD_FOLDER, addFolder);
  yield takeLatest(ADD_FILE, addFile);
  yield takeLatest(DELETE_FOLDER, deleteFolder);
  yield takeLatest(DELETE_FILE, deleteFile);
  yield takeLatest(EDIT_FOLDER, editFolder);
  yield takeLatest(EDIT_FILE, editFile);
  yield takeLatest(DOWNLOAD_FOLDER, downloadFolder);
  yield takeLatest(DOWNLOAD_FILE, downloadFile);
  yield takeLatest(ADD_ITEM_TO_LIST_LINK_FOLDER, addItemToListLinkFolder);
  yield takeLatest(GET_USERS_SHARED, getUsersShared);
  yield takeLatest(GET_USERS_NOT_SHARED, getUsersNotShared);
  yield takeLatest(SHARE_DOCUMENT, shareDocument);
  yield takeLatest(UN_SHARE_DOCUMENT, unShareDocument);
  yield takeLatest(GET_DOCUMENT_SHARED_WITH_ME, getDocumentSharedWithMe);
}