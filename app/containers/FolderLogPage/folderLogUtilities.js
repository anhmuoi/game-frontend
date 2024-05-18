/* eslint-disable no-restricted-syntax */
import { sortObject } from 'containers/App/appUtilities';
/**
 * @param(state) object (groupModel in store access group): object merge
 * @param(err) object: object contains error info
 */
export const mergeState = (state, err) => {
  const errorUI = {};
  err.forEach((error) => {
    errorUI[error.field] = error.message;
  });

  const cloneState = {};
  Object.getOwnPropertyNames(state).forEach((property) => {
    cloneState[property] = {
      value: state[property].value,
      errorMessage: errorUI[property] ? errorUI[property] : false,
    };
  });
  return cloneState;
};

/**
 * @param(groupUi: object) object get from store (local)
 *
 * @returns object map from store to API object
 */
export const convertGroupUItoApi = (groupUi) => {
  const groupClone = {};
  if (groupUi) {
    Object.getOwnPropertyNames(groupUi).forEach((property) => {
      if (property === 'parentId') {
        groupClone[property] =
          groupUi[property].value === 0 ? null : groupUi[property].value;
      } else {
        groupClone[property] =
          typeof groupUi[property].value === 'string'
            ? groupUi[property].value.trim()
            : groupUi[property].value;
      }
    });
  }
  return groupClone;
};

/**
 * @param(groupApi) object: Account object get from api (remote)
 */
export const mapModelgroupApiToUI = (groupApi, folderLogList, id) => {
  const accountClone = {};
  if (groupApi) {
    Object.getOwnPropertyNames(groupApi).forEach((property) => {
      accountClone[property] = {
        value: groupApi[property] === null ? '' : groupApi[property],
        errorMessage: false,
      };
    });
    const folderLogItems = folderLogList.filter((item) => item.id !== id);
    accountClone.parentFolderLogItem = {
      value: folderLogItems,
      errorMessage: false,
    };
  }
  return accountClone;
};

/**
 * @param(ids) array of number type: ids of user is deleted
 */
export const mapIdsToQueryString = (ids) =>
  ids.map((id) => `ids=${id}`).join('&');

/**
 * @param {groupData: array} groups is got from api
 * @param {groupId: number} group is set default
 */
export const mergeChangeDefaultGroup = (groupData, groupId) => {
  if (groupData.length === 0) {
    return [];
  }

  const cloneGroup = groupData.map((group) => ({
    id: group.id,
    name: group.name,
    isDefault: false,
    type: group.type,
  }));
  // change isDefault to true of group that it has id equal groupId
  for (let i = 0, len = groupData.length; i < len; i += 1) {
    if (groupData[i].id === groupId) {
      cloneGroup[i].isDefault = true;
      break;
    }
  }
  return cloneGroup.sort(sortPredicate);
};

export const sortPredicate = (x, y) => {
  const equal = x.isDefault === y.isDefault;
  const defaultValue = x.isDefault ? -1 : 1;
  return equal ? 0 : defaultValue;
};

export const remakeUnassignedMasterData = (userList, ids) => {
  const clone = [];
  userList.forEach((master) => {
    if (!ids.find((id) => id === master.id)) {
      clone.push(master);
    }
  });
  const res = clone.map((data) => ({
    id: data.id,
    firstName: data.firstName,
    departmentName: data.departmentName,
    email: data.email,
    cardList: data.cardList,
  }));
  return res;
};

export const getAllFolderLogIds = (
  folderLogList,
  isIncludeParentFolderLog = true,
) => {
  let result = [];
  folderLogList.forEach((folderLog) => {
    if (isIncludeParentFolderLog) {
      result.push(folderLog.id);
    }
    if (folderLog.children && folderLog.children.length > 0) {
      result = [
        ...result,
        ...getAllFolderLogIds(folderLog.children, isIncludeParentFolderLog),
      ];
    }
  });
  return result;
};

export const getAllDoorIds = (folderLogList) => {
  let result = [];
  folderLogList.forEach((folderLog) => {
    if (folderLog.children && folderLog.children.length > 0) {
      result = [...result, ...getAllDoorIds(folderLog.children)];
    }
    if (folderLog.doorList && folderLog.doorList.length > 0) {
      result = [...result, ...folderLog.doorList.map((item) => item.id)];
    }
  });
  return result;
};

export const getAllDoors = (folderLogList, isReturnDoorName = false) => {
  let result = [];
  folderLogList.forEach((folderLog) => {
    if (folderLog.children && folderLog.children.length > 0) {
      result = [
        ...result,
        ...getAllDoors(folderLog.children, isReturnDoorName),
      ];
    }
    if (folderLog.doorList && folderLog.doorList.length > 0) {
      result = [
        ...result,
        ...folderLog.doorList.map((item) => {
          if (isReturnDoorName) {
            return {
              doorId: item.id,
              accessTimeId: item.accessTimeId,
              isParent: item.isParent,
              doorName: item.doorName,
            };
          }
          return {
            doorId: item.id,
            accessTimeId: item.accessTimeId,
            isParent: item.isParent,
          };
        }),
      ];
    }
  });
  return result;
};

export const getFolderLogIdByDeviceIds = (folderLogList, deviceIds) => {
  let result = [];
  let bool = true;
  folderLogList.forEach((folderLog) => {
    if (folderLog.doorList && folderLog.doorList.length > 0) {
      folderLog.doorList.forEach((door) => {
        if (!deviceIds.includes(door.id)) {
          bool = false;
        }
      });
    }
    if (folderLog.children && folderLog.children.length > 0) {
      result = [
        ...result,
        ...getFolderLogIdByDeviceIds(folderLog.children, deviceIds),
      ];
    }
    if (
      (!folderLog.children ||
        (folderLog.children && folderLog.children.length === 0)) &&
      (!folderLog.doorList ||
        (folderLog.doorList && folderLog.doorList.length === 0))
    ) {
      result.push(folderLog.id);
    }
    if (bool) {
      result.push(folderLog.id);
    }
  });
  return result;
};

export const isDevicesChecked = (selectedDoors, deviceIds) => {
  let bool = true;
  deviceIds.forEach((id) => {
    if (!selectedDoors.map((item) => item.doorId).includes(id)) {
      bool = false;
    }
  });
  return bool;
};

export const isFolderLogsChecked = (selectedFolderLogs, folderLogIds) => {
  let bool = true;
  folderLogIds.forEach((id) => {
    if (!selectedFolderLogs.includes(id)) {
      bool = false;
    }
  });
  return bool;
};

export const sortAssignedMasterList = (data) =>
  stableSort(data, getSorting('asc', 'firstName'));

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const getSorting = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

/**
 * @brief : Variable of table header
 * @type : array
 */
const defaultOrderHeader = [
  'firstName',
  'departmentName',
  'email',
  'cardList',
  'Action',
  'id',
];

/**
 * @brief : Re-order data with orderHeader
 * @param(data) : Data that API gives
 */
export const reOderData = (data, orderHeader) => {
  const newOrderHeader = [];
  const headerCategory = [];
  if (orderHeader) {
    orderHeader.forEach((item) => {
      if (item.isCategory && item.id !== 'action') {
        headerCategory.push(item.property);
      }
      newOrderHeader.push(item.property);
    });
  } else {
    defaultOrderHeader.forEach((item) => newOrderHeader.push(item));
  }
  newOrderHeader.push('id');
  // Datas sorted by headers without category, action
  const sortedData = data.map((item) => sortObject(item, newOrderHeader));
  return sortedData.map((item) => {
    const cloneItem = { ...item };
    headerCategory.forEach((category) => {
      const val = data
        .find((datas) => datas.id === cloneItem.id)
        .categoryOptions.find(
          (opt) => opt.category.id === parseInt(category, 10),
        );
      cloneItem[category] = val ? val.optionName : '';
    });
    return cloneItem;
  });
};

export const getFolderLogByGivenId = (folderLogs = [], folderLogId) => {
  let result = {};
  for (const folderLog of folderLogs) {
    if (folderLog.id === folderLogId) {
      result = folderLog;
      break;
    }
    if (folderLog.children) {
      result = getFolderLogByGivenId(folderLog.children, folderLogId);
    }
  }
  return result;
};

// work log
export const mapModelApiToUI = (workApi) => {
  const workLogClone = {};
  if (workApi) {
    Object.getOwnPropertyNames(workApi).forEach((property) => {
      workLogClone[property] = {
        value: workApi[property] === null ? '' : workApi[property],
        errorMessage: false,
      };
    });
  }
  return workLogClone;
};

export const mapModelMeetingUiToApi = (meetingUi) => {
  const meetingClone = {
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    folderLogId: null,
    meetingRoomId: null,
  };

  if (meetingUi) {
    Object.getOwnPropertyNames(meetingClone).forEach((property) => {
      let { value } = meetingUi[property];

      meetingClone[property] =
        value === '' ? '' : typeof value === 'string' ? value.trim() : value;
    });
  }
  return meetingClone;
};
export const mapModelWorkLogUiToApi = (workLogUi) => {
  const workLogClone = {
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    folderLogId: null,
    userId: null,
  };

  if (workLogUi) {
    Object.getOwnPropertyNames(workLogClone).forEach((property) => {
      let { value } = workLogUi[property];

      workLogClone[property] =
        value === '' ? '' : typeof value === 'string' ? value.trim() : value;
    });
  }
  return workLogClone;
};
export const mergeMetaPaging = (metaPaging, meta) => {
  const metaPagingClone = {};
  Object.assign(metaPagingClone, metaPaging);

  Object.getOwnPropertyNames(meta).forEach((property) => {
    if (property in metaPagingClone) {
      metaPagingClone[property] = meta[property];
    }
  });
  return metaPagingClone;
};
