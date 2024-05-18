import { format } from 'date-fns';
import { utcToZonedTime, getTimezoneOffset } from 'date-fns-tz';
import { parse } from 'date-fns';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DateTimeFormatDefault,
} from './constants.js';
import { localstoreUtilites } from './persistenceData.js';

export function validateEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function convertStringDefaultToDateTime(textDate, textFormat) {
  if (!textFormat) {
    textFormat = DateTimeFormatDefault;
  }

  return parse(textDate, textFormat, new Date());
}

export function convertDateToUtc(date) {
  try {
    let timezone = localstoreUtilites.getAccountTzFromLocalStorage();
    return date.setMilliseconds(-getTimezoneOffset(timezone));
  } catch (error) {
    console.log(error);
    return date;
  }
}

export function convertDateUtcToUserTime(date) {
  try {
    let timezone = localstoreUtilites.getAccountTzFromLocalStorage();
    return new Date(date.setMilliseconds(getTimezoneOffset(timezone)));
  } catch (error) {
    console.log(error);
    return date;
  }
}

// function check config hide field in file .env
// case return true: not using field in form edit
// case return false: using field in form edit
export function utilIsHideFieldSetting(filePage, field) {
  try {
    console.log(window.FIELD_HIDE_SETTING[filePage]['123']);
    // console.log('check !window.FIELD_HIDE_SETTING', !window.FIELD_HIDE_SETTING);
    if (!window.FIELD_HIDE_SETTING) return false;
    // console.log('check !window.FIELD_HIDE_SETTING[filePage]', !window.FIELD_HIDE_SETTING[filePage]);
    if (!window.FIELD_HIDE_SETTING[filePage]) return false;
    // console.log('check !window.FIELD_HIDE_SETTING[filePage][field]', !window.FIELD_HIDE_SETTING[filePage][field]);
    if (!window.FIELD_HIDE_SETTING[filePage][field]) return false;
    // console.log('check window.FIELD_HIDE_SETTING[filePage][field]', window.FIELD_HIDE_SETTING[filePage][field]);
    return window.FIELD_HIDE_SETTING[filePage][field];
  } catch (err) {
    // console.log('utilIsHideFieldSetting err', err);
    return false;
  }
}

// function check config requirement(not empty) field in file .env
// case return true: required
// case return false: not required
export function utilCheckFieldRequiredSetting(filePage, field) {
  try {
    // console.log('check !window.FIELD_REQUIRE_SETTING', !window.FIELD_REQUIRE_SETTING);
    if (!window.FIELD_REQUIRE_SETTING) return false;
    // console.log('check !window.FIELD_REQUIRE_SETTING[filePage]', !window.FIELD_REQUIRE_SETTING[filePage]);
    if (!window.FIELD_REQUIRE_SETTING[filePage]) return false;
    // console.log('check !window.FIELD_REQUIRE_SETTING[filePage][field]', !window.FIELD_REQUIRE_SETTING[filePage][field]);
    if (!window.FIELD_REQUIRE_SETTING[filePage][field]) return false;
    // console.log('check window.FIELD_REQUIRE_SETTING[filePage][field]', window.FIELD_REQUIRE_SETTING[filePage][field]);
    return window.FIELD_REQUIRE_SETTING[filePage][field];
  } catch (err) {
    // console.log('utilCheckFieldRequiredSetting err', err);
    return false;
  }
}

// config list type (object) by id to use select box
export function utilOverwriteFieldListIds(field, fieldList) {
  try {
    // console.log('check !window.OVERWRITE_LIST_SETTING_BY_ID', !window.OVERWRITE_LIST_SETTING_BY_ID);
    if (!window.OVERWRITE_LIST_SETTING_BY_ID) return fieldList;
    // console.log('check !window.OVERWRITE_LIST_SETTING_BY_ID[field]', !window.OVERWRITE_LIST_SETTING_BY_ID[field]);
    if (!window.OVERWRITE_LIST_SETTING_BY_ID[field]) return fieldList;
    if (!fieldList) return [];
    return fieldList.filter(
      (m) => window.OVERWRITE_LIST_SETTING_BY_ID[field].indexOf(m.id) !== -1,
    );
  } catch (err) {
    // console.log('utilOverwriteFieldListIds err', err);
    return fieldList;
  }
}

export function convertShowDate(data) {
  const lang = 'en-US';
  const timezone = localstoreUtilites.getAccountTzFromLocalStorage();

  if (!data) return data;

  let dateStr = parseDateTime(data, true);
  // dateStr = new Date(dateStr).setHours(
  //   new Date(dateStr).getHours() + new Date(dateStr).getTimezoneOffset() / -60,
  // );
  dateStr = new Date(dateStr).setMilliseconds(getTimezoneOffset(timezone));

  return format(dateStr, DATE_FORMAT[lang]);
}

export function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c,
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function convertShowDateTime(data) {
  const lang = 'en-US';
  const timezone = localstoreUtilites.getAccountTzFromLocalStorage();
  if (!data) return data;

  let dateStr = parseDateTime(data, true).replace(/ /g, 'T');
  // dateStr = new Date(dateStr).setHours(
  //   new Date(dateStr).getHours() + new Date(dateStr).getTimezoneOffset() / -60,
  // );
  dateStr = new Date(dateStr).setMilliseconds(getTimezoneOffset(timezone));
  return format(dateStr, DATE_TIME_FORMAT[lang]);
}

function parseDateTime(str, haveTime) {
  let date = str.split(/[.:' '-]+/);
  if (haveTime) {
    return (
      date[2] +
      '-' +
      date[0] +
      '-' +
      date[1] +
      ' ' +
      date[3] +
      ':' +
      date[4] +
      ':' +
      date[5]
    );
  } else {
    return date[2] + '-' + date[0] + '-' + date[1];
  }
}
export function convertDefaultDateTimeToString(date) {
  return format(date, DateTimeFormatDefault);
}

export function formatDateToSend(date) {
  let timezone = localstoreUtilites.getAccountTzFromLocalStorage();
  // const newDate = new Date(
  //   new Date(date).setHours(
  //     new Date(date).getHours() - new Date(date).getTimezoneOffset() / -60,
  //   ),
  // );
  const newDate = new Date(
    new Date(date).setMilliseconds(-getTimezoneOffset(timezone)),
  );
  let dateStr =
    ('00' + (newDate.getMonth() + 1)).slice(-2) +
    '.' +
    ('00' + newDate.getDate()).slice(-2) +
    '.' +
    newDate.getFullYear();
  return dateStr;
}
export function formatDateTimeToSend(date) {
  let timezone = localstoreUtilites.getAccountTzFromLocalStorage();
  // const newDate = new Date(
  //   new Date(date).setHours(
  //     new Date(date).getHours() - new Date(date).getTimezoneOffset() / -60,
  //   ),
  // );
  const newDate = new Date(
    new Date(date).setMilliseconds(-getTimezoneOffset(timezone)),
  );
  let dateStr =
    ('00' + (newDate.getMonth() + 1)).slice(-2) +
    '.' +
    ('00' + newDate.getDate()).slice(-2) +
    '.' +
    newDate.getFullYear() +
    ' ' +
    ('00' + newDate.getHours()).slice(-2) +
    ':' +
    ('00' + newDate.getMinutes()).slice(-2) +
    ':' +
    ('00' + newDate.getSeconds()).slice(-2);
  return dateStr;
}
export function formatDateTimeToSendWithoutUTC(date) {
  const newDate = new Date(date);
  let dateStr =
    ('00' + (newDate.getMonth() + 1)).slice(-2) +
    '.' +
    ('00' + newDate.getDate()).slice(-2) +
    '.' +
    newDate.getFullYear() +
    ' ' +
    ('00' + newDate.getHours()).slice(-2) +
    ':' +
    ('00' + newDate.getMinutes()).slice(-2) +
    ':' +
    ('00' + newDate.getSeconds()).slice(-2);
  return dateStr;
}
export function formatDateUtils(dateObj, format) {
  let monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let curr_date = dateObj.getDate();
  let curr_month = dateObj.getMonth();
  curr_month = curr_month + 1;
  let curr_year = dateObj.getFullYear();
  let curr_min = dateObj.getMinutes();
  let curr_hr = dateObj.getHours();
  let curr_sc = dateObj.getSeconds();
  if (curr_month.toString().length == 1) curr_month = '0' + curr_month;
  if (curr_date.toString().length == 1) curr_date = '0' + curr_date;
  if (curr_hr.toString().length == 1) curr_hr = '0' + curr_hr;
  if (curr_min.toString().length == 1) curr_min = '0' + curr_min;
  if (curr_sc.toString().length == 1) curr_sc = '0' + curr_sc;

  if (format == 1) {
    //dd-mm-yyyy
    return curr_date + '-' + curr_month + '-' + curr_year;
  } else if (format == 2) {
    //yyyy-mm-dd
    return curr_year + '-' + curr_month + '-' + curr_date;
  } else if (format == 3) {
    //dd/mm/yyyy
    return curr_date + '/' + curr_month + '/' + curr_year;
  } else if (format == 4) {
    // MM/dd/yyyy HH:mm:ss
    return (
      curr_month +
      '.' +
      curr_date +
      '.' +
      curr_year +
      ' ' +
      curr_hr +
      ':' +
      curr_min +
      ':' +
      curr_sc
    );
  } else if (format == 5) {
    return curr_month + '.' + curr_date + '.' + curr_year;
  }
}

export const mapWorkMeetingToChildrenFolder = (data) => {
  // Hàm xử lý một item, bao gồm việc thêm các mục từ workLog và meeting vào children
  const processItem = (item) => {
    const newChildren = item.children ? [...item.children] : []; // Sao chép children ban đầu nếu tồn tại, nếu không thì tạo một mảng rỗng

    // Xử lý workLog và meeting, thêm vào mảng newChildren
    item.workLog.forEach((w) => {
      const newW = { ...w };
      if (typeof newW.id === 'number') {
        newW.id = 'work_' + newW.id;
      }
      newW.name = newW.title;
      newW.parentId = item.id;
      newW.children = [];
      newChildren.push(newW);
    });

    item.meeting.forEach((m) => {
      const newM = { ...m };
      if (typeof newM.id === 'number') {
        newM.id = 'meeting_' + newM.id;
      }
      newM.name = newM.title;
      newM.parentId = item.id;
      newM.children = [];
      newChildren.push(newM);
    });

    // Trả về một bản sao của item với children đã được cập nhật
    return { ...item, children: newChildren };
  };

  // Sử dụng hàm processItem để xử lý từng phần tử trong mảng data
  const newData = data.map((item) => {
    // Nếu item có children, gọi đệ quy để xử lý children
    if (item.children) {
      item.children = mapWorkMeetingToChildrenFolder(item.children);
    }
    // Xử lý item và trả về kết quả
    return processItem(item);
  });

  return newData; // Trả về dữ liệu đã được xử lý
};
