import React from 'react';
import { fromJS } from 'immutable';
import { createMuiTheme } from '@material-ui/core';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { parse } from 'date-fns';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { LANGUAGE, TYPE_ACCOUNT, TIMEZONE } from '../../utils/constants';
import { isAdmin, localstoreUtilites } from '../../utils/persistenceData';
import {
  STATUS_COMPLETED,
  STATUS_DOWNLOADING,
  STATUS_FAILED,
  STATUS_PREPARING,
  STATUS_STOP,
  STATUS_UPDATING,
} from '../../components/Datatables/constants';
/**
 * @param(metaPaging) object: meta global
 * @param(meta) object: meta returned from api
 */
export const mergeMetaPaging = (metaPaging, meta) => {
  const metaPagingClone = {};
  Object.assign(metaPagingClone, metaPaging);

  Object.getOwnPropertyNames(meta).forEach(property => {
    if (property in metaPagingClone) {
      metaPagingClone[property] = meta[property];
    }
  });
  return metaPagingClone;
};

export const isViewOnly = role => {
  if (role === TYPE_ACCOUNT.dynamic) {
    return true;
  }
  return false;
};

export const sortObject = (src, orderHeader) => {
  const out = {};
  if (src !== null && typeof src === 'object' && Object.keys(src).length > 0) {
    if (!orderHeader) return src;
    orderHeader.forEach(key => {
      out[key] = sortObject(src[key]);
    });
    return out;
  }
  return src;
};

export const getFullTime = date =>
  `${fullNode(date.getDate())}${fullNode(
    date.getMonth() + 1,
  )}${date.getFullYear()}${fullNode(date.getHours())}${fullNode(
    date.getMinutes(),
  )}${fullNode(date.getSeconds())}`;

const fullNode = node => (node < 10 ? `0${node}` : node);

export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file instanceof File) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const urlParam = name => {
  const results = new RegExp(`[?&]${name}=([^&#]*)`).exec(window.location.href);
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || null;
};

// string -> date
export const string2Date = stringDate => {
  switch (
    localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
  ) {
    case LANGUAGE.KOREA:
    case LANGUAGE.JAPANESE: {
      const pattern = /(\d{4})\.(\d{2})\.(\d{2})/;
      return new Date(stringDate.replace(pattern, '$1/$2/$3'));
    }
    case LANGUAGE.VIETNAMESE: {
      const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      const newStrDate = stringDate.split('/').join('.');
      return new Date(newStrDate.replace(pattern, '$2/$1/$3'));
    }
    case LANGUAGE.ENGLISH:
    default: {
      const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      return new Date(stringDate.replace(pattern, '$3/$1/$2'));
    }
  }
};
// date -> string
export const date2String = date => {
  if (date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    switch (
      localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
    ) {
      case LANGUAGE.JAPANESE:
      case LANGUAGE.KOREA: {
        // YYYY.MM.DD
        const formattedDate = `${year}.${
          month < 10 ? 0 + month.toString() : month
        }.${day < 10 ? 0 + day.toString() : day}`;
        return formattedDate;
      }
      case LANGUAGE.VIETNAMESE: {
        // DD.MM.YYYY
        const formattedDate = `${day < 10 ? 0 + day.toString() : day}.${
          month < 10 ? 0 + month.toString() : month
        }.${year}`;
        return formattedDate;
      }
      case LANGUAGE.ENGLISH: // MM.DD.YYYY
      default: {
        const formattedDate = `${month < 10 ? 0 + month.toString() : month}.${
          day < 10 ? 0 + day.toString() : day
        }.${year}`;
        return formattedDate;
      }
    }
  }
  return null;
};

// date -> time12

export const date2Time12 = date => {
  if (date) {
    return date
      .toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      .replace(/[^ -~]/g, '');
  }
  return null;
};

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// string -> string
export const reformatStringDate = (
  sourceStringDate,
  sourcePattern,
  targetPattern,
) =>
  sourceStringDate
    ? sourceStringDate.replace(sourcePattern, targetPattern)
    : null;

export const fullTextSearch = (items, text) => {
  if (!text || text === '') return items;
  const fullText = text.split(' ');
  return items.filter(item =>
    fullText.every(el => {
      let checkFlag = false;
      Object.getOwnPropertyNames(item).forEach(property => {
        if (
          item[property] &&
          item[property]
            .toString()
            .toLowerCase()
            .indexOf(el.toLowerCase()) > -1
        ) {
          checkFlag = true;
        }
      });
      return checkFlag;
    }),
  );
};

export const mapCreateProcesses = (progressObj, processLists) => {
  const progressListObj = Object.assign({}, progressObj);
  processLists.forEach(item => {
    progressListObj[`${item.progressId}`] = {
      name: item.target,
      progress: 0,
      status: STATUS_PREPARING,
      updateTime: new Date(),
    };
  });
  return progressListObj;
};

export const mapStopProcesses = (progressObj, processIds) => {
  const cloneProgressObj = Object.assign({}, progressObj);
  for (let i = 0; i < processIds.length; i += 1) {
    if (
      [STATUS_PREPARING, STATUS_DOWNLOADING, STATUS_UPDATING].includes(
        cloneProgressObj[processIds[i]].status,
      )
    )
      cloneProgressObj[processIds[i]].status = STATUS_STOP;
  }
  return cloneProgressObj;
};

export const mapRemoveProcesses = (progressObj, processIds) =>
  progressObj.filter(
    (item, processId) =>
      !(
        processIds.includes(processId) &&
        [STATUS_FAILED, STATUS_STOP, STATUS_COMPLETED].includes(
          item.get('status'),
        )
      ),
  );

export const mapCreateProgressbar = (
  datas,
  devicesIdSelected,
  progressLists,
) => {
  const newDatas = datas.map(device => {
    if (devicesIdSelected.includes(device.id)) {
      return {
        ...device,
        progressbar: [
          ...device.progressbar,
          ...progressLists
            .filter(
              item =>
                item.deviceId === device.id &&
                !device.progressbar.includes(item.progressId),
            )
            .map(file => file.progressId),
        ],
      };
    }
    return device;
  });
  return newDatas;
};

export const mapRemoveProgressbar = (datas, progressObj) =>
  datas.map(item => {
    const newProgressbar = [];
    item.progressbar.forEach(progressId => {
      if (progressObj.get(progressId, null)) newProgressbar.push(progressId);
    });
    return {
      ...item,
      progressbar: newProgressbar,
    };
  });

export const storeProcessListObj = data => {
  let newObj = fromJS({});
  data.forEach(item => {
    if (item.progressbar && item.progressbar.length > 0) {
      newObj = newObj.setIn([`${item.id}`, 'progressbar'], item.progressbar);
    }
  });
  // console.log('push', newObj.toJS());
  return newObj;
};

export const removeProcessListObj = (data, processListObj) => {
  let newObj = fromJS({});
  data.map(item => item.id).forEach(item => {
    if (processListObj.has(`${item}`)) {
      newObj = newObj.set(
        `${item}`,
        processListObj.get(`${item}`, { progressbar: [] }),
      );
    }
  });
  if (newObj.size) console.log('pop', newObj.toJS());
  newObj = processListObj.filter(item => !newObj.has(item));
  return newObj;
};

export const getProcessIds = (data, devicesIdSelected) => {
  const arr = [];
  data
    .filter(item => devicesIdSelected.includes(item.id))
    .forEach(item =>
      item.progressbar.forEach(progressId => arr.push(progressId)),
    );
  return arr;
};

export const assignedProcessCnt = data => {
  let processCnt = 0;
  data.map(item => item.progressbar.length).forEach(item => {
    processCnt += item;
  });
  return processCnt;
};

export const getTargetPattern = () => {
  switch (
    localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
  ) {
    case LANGUAGE.JAPANESE:
    case LANGUAGE.KOREA:
      return '$3.$1.$2';
    case LANGUAGE.VIETNAMESE:
      return '$2.$1.$3';
    default:
      return '$1.$2.$3';
  }
};

export const makeTableHeader = orderHeader => {
  const filterHeader = orderHeader.filter(
    item =>
      item.id.toLowerCase() !== 'action' &&
      item.id.toLowerCase() !== 'id' &&
      item.id !== '#' &&
      !item.id.toLowerCase().includes('list') &&
      item.id !== 'progressbar' &&
      !item.id.startsWith('remark') &&
      item.id !== 'index',
  );
  return filterHeader.map(header => ({
    id: header.id,
    name: header.label,
    value: header.id,
  }));
};

// config theme
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3A4856',
      border: '#141A44',
      color: '#141A44',
      borderRadius: 10,
    },
    secondary: { main: '#F4911D' },
    background: {
      default: '#D6DEE8',
      menu: '#3A4856',
    },
  },
  spacing: { unit: 9 },
  typography: {
    useNextVariants: true,
  },
});

export const functionToObjectStyle = styles => styles(theme);

export const compareObj = (origin, other) => {
  let result = true;
  if (origin === undefined || other === undefined) return false;
  if (origin.length !== other.length) result = false;
  if (JSON.stringify(origin) !== JSON.stringify(other)) result = false;
  return result;
};

export const changeConnectionStatus = (data, newData) =>
  data.map(device => {
    const clone = Object.assign({}, device);
    if (
      device.deviceAddress === newData.deviceAddress ||
      device.deviceAddress.includes(newData.deviceAddress)
    ) {
      if (typeof newData.status === 'number') {
        switch (newData.status) {
          case 0:
            clone.connectionStatus = <DotIcon style={{ color: 'f44336' }} />;
            break;
          case 1:
            clone.connectionStatus = <DotIcon style={{ color: '#4caf50' }} />;
            break;
          case 2:
            clone.connectionStatus = isAdmin() ? (
              <DotIcon style={{ color: 'ffeb3b' }} />
            ) : (
              <DotIcon style={{ color: '4caf50' }} />
            );
            break;
          default:
            break;
        }
      }
      clone.fwVersion = {
        version: newData.version,
        inCardReader: newData.inReader,
        outCardReader: newData.outReader,
        nfcModule: newData.nfcModule,
      };
      clone.doorStatus = newData.doorStatus
        ? newData.doorStatus
        : device.doorStatus;
    }
    return clone;
  });

export const getAccess24Id = timezone =>
  timezone
    .filter(item => item.get('position') === TIMEZONE.access24h)
    .getIn(['0', 'id']);

export const reformatTimeUTC = (date, dateFormat) => {
  const lang = localstoreUtilites.getLanguageFromLocalStorage();
  const locales = {
    'en-us': 'MM.dd.yyyy HH:mm:ss',
    'ko-kr': 'yyyy.MM.dd HH:mm:ss',
    'ko-jp': 'yyyy.MM.dd HH:mm:ss',
    'vi-vn': 'dd/MM/yyyy HH:mm:ss',
  };
  return format(
    zonedTimeToUtc(parse(date, dateFormat, new Date()), 'UTC'),
    lang ? locales[lang] : locales['en-us'],
  );
};

export const reformatHeaders = headers => {
  if (headers && headers.length > 0) {
    const newHeaders = headers.map(item => {
      let returnVal = { ...item };
      if (
        item.headerVariable === 'EmployeeNo' ||
        item.headerVariable === 'ExpiredDate' ||
        item.headerVariable === 'CardList' ||
        item.headerVariable === 'MilitaryNo'
      ) {
        returnVal = { ...returnVal, width: '120px' };
      } else if (item.headerVariable === '') {
        returnVal = {
          ...returnVal,
          numeric: true,
          disablePadding: false,
          label: '##',
          width: '50px',
        };
      }
      const str = returnVal.headerVariable.substr(0, 1);
      return {
        ...returnVal,
        id: returnVal.headerVariable.replace(str, str.toLowerCase()),
        label: item.headerName,
        property: returnVal.headerVariable.replace(str, str.toLowerCase()),
      };
    });
    const actionRow = newHeaders.find(item => item.headerVariable === 'Action');
    if (actionRow) {
      const actionIndex = newHeaders.indexOf(actionRow);
      newHeaders.splice(actionIndex, 1);
      newHeaders.push(actionRow);
    }
    return newHeaders;
  }
  return [];
};

export const mapHeadersUiToApi = headers => {
  const fields = [
    'pageName',
    'headerId',
    'headerName',
    'headerVariable',
    'isCategory',
    'headerOrder',
    'isVisible',
  ];
  if (headers) {
    return headers.map(header => {
      const clone = {};
      fields.forEach(field => {
        clone[field] = header[field];
      });
      return clone;
    });
  }
  return null;
};

export const checkCardIdValue = cardId => {
  // true : Card ID is valid
  // false: Card ID is invalid.
  let bool = false;
  if (cardId) {
    cardId.split('').forEach(item => {
      const ascii = item.charCodeAt();
      bool =
        (ascii >= 48 && ascii <= 57) ||
        (ascii >= 65 && ascii <= 70) ||
        (ascii === 45 || ascii === 46);
    });
  }
  return bool;
};

export const reformatDoors = (buildings = [], ids = []) =>
  buildings.map(building => {
    const clone = { ...building };
    clone.doorList = makeDisabledDevices(building, ids);
    if (building.children) {
      clone.children = reformatDoors(building.children, ids);
    }
    return clone;
  });

const makeDisabledDevices = (building, ids) => {
  if (building.doorList && building.doorList.length > 0) {
    return building.doorList.map(device => {
      const cloneDevice = { ...device };
      if (ids.includes(device.id)) {
        cloneDevice.isParent = true;
      } else {
        cloneDevice.isParent = false;
      }
      return cloneDevice;
    });
  }
  return null;
};

export const getAllDoors = (buildingList, accessTimeList) => {
  let result = [];
  buildingList.forEach(building => {
    if (building.children && building.children.length > 0) {
      result = [...result, ...getAllDoors(building.children, accessTimeList)];
    }
    if (building.doorList && building.doorList.length > 0) {
      result = [
        ...result,
        ...building.doorList.map(item => {
          const { id: accessTimeId } = accessTimeList.find(
            accessTime => accessTime.name === item.accessTimeName,
          );
          return {
            doorId: item.id,
            accessTimeId,
            isParent: false,
          };
        }),
      ];
    }
  });
  return result;
};
