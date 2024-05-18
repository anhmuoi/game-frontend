export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const URL_DOMAIN = window && window.env ? window.env.API_URL : 'urlApi';
export const PAGE_TITLE =
  (window && window.env && window.env.PAGE_TITLE) || 'ERP';
export const cookieExpires = window && window.env && window.env.TOKEN_EXPIRES;
export const TYPE_ACCOUNT = {
  primaryManager: 0,
  dynamic: 1,
};
// export const DateTimeFormatDefault = 'dd.MM.yyyy HH:mm:ss';
export const colorDelete = '#B23535';
export const DateTimeFormatDefault = 'MM.dd.yyyy HH:mm:ss';
export const CARD_TYPE = {
  CARD: 0,
  QR: 1,
  PASSCODE: 2,
  NFCPHONE: 3,
  FACEID: 4,
  HFACEID: 5,
  VEHICLE: 6,
  VEIN: 7,
};

export const LANGUAGE = {
  KOREA: 'ko-KR',
  ENGLISH: 'en-US',
  JAPANESE: 'ko-JP',
  VIETNAMESE: 'vi-VN',
};

export const MQTT_TYPE = {
  KIOSK_CUSTOMER_REGISTER_WAITING: {
    type: 'KIOSK_CUSTOMER_REGISTER_WAITING',
    topic: '/topic/kiosk/customer_register_waiting',
  },
  KIOSK_CUSTOMER_REGISTER_WAITING_RESPONSE: {
    type: 'KIOSK_CUSTOMER_REGISTER_WAITING_RESPONSE',
    topic: '/topic/kiosk/customer_register_waiting_response',
  },
  CURRENT_STAND_BY_NUMBER: {
    type: 'CURRENT_STAND_BY_NUMBER',
    topic: '/topic/current_stand_by_number',
  },
  NOTIFICATION: { type: 'NOTIFICATION', topic: '/topic/notification' },
  EXPORT_MEMBER: { type: 'EXPORT_MEMBER', topic: '/topic/export_member' },
  NOTIFICATION_RELOAD_COUNT_REVIEW: {
    type: 'NOTIFICATION_COUNT_REVIEW',
    topic: '/topic/notification',
  },
  CONNECTION_STATUS: {
    type: 'CONNECTION_STATUS',
    topic: '/topic/device_status',
  },
  EVENT_LOG_WEBAPP: {
    type: 'EVENT_LOG_WEBAPP',
    topic: '/topic/event_json',
  },
  PROCESS_PROGRESSBAR: {
    type: 'LONG_PROCESS_PROGRESS',
    topic: '/topic/long_process_progress',
  },
  LOAD_ALL_USER_WEBAPP: {
    type: 'LOAD_ALL_USER_WEBAPP',
    topic: '/topic/load_user_webapp',
  },
  EVENT_COUNT: {
    type: 'EVENT_COUNT_WEBAPP',
    topic: '/topic/event_count_json',
  },
  EVENT_BASIC_CHECK_DEVICE: {
    type: 'LOAD_DEVICE_SETTING_WEBAPP',
    topic: '/topic/device_setting_webapp',
  },
  EVENT_TIMEZONE_DEVICE_SETTING: {
    type: 'LOAD_TIMEZONE_WEBAPP',
    topic: '/topic/load_timezone_webapp',
  },
  EVENT_HOLIDAY_CHECK_DEVICE: {
    type: 'LOAD_HOLIDAY_WEBAPP',
    topic: '/topic/load_holiday_webapp',
  },
  NOTIFICATION_CAMERA: {
    type: 'NOTIFICATION_CAMERA',
    topic: '/topic/camera',
  },
  VISITOR_CAMERA_INFORMATION: {
    type: 'VISITOR_CAMERA_INFORMATION',
    topic: '/topic/camera',
  },
  PAGE_VISITOR_CAMERA_INFORMATION: {
    type: 'PAGE_VISITOR_CAMERA_INFORMATION',
    topic: '/topic/camera',
  },
  NOTIFICATION_PROCCESS_CAMERA: {
    type: 'NOTIFICATION_PROCCESS_CAMERA',
    topic: '/topic/camera',
  },
  FACE_CAPTURE: {
    type: 'FACE_CAPTURE',
    topic: '/topic/face_data',
  },
  VEHICLE_EVENT_LOG_WEBAPP: {
    type: 'VEHICLE_EVENT_LOG_WEBAPP',
    topic: '/topic/vehicle_event_json',
  },
  SUB_DISPLAY_DEVICE_INFO: {
    type: 'SUB_DISPLAY_DEVICE_INFO',
    topic: '/topic/sub_display/device_info',
  },
  NOTIFICATION_VISITOR_INFO: {
    type: 'VISITOR',
    topic: '/topic/visitor_info',
  },
  NOTIFICATION_CAMERA_QRCODE: {
    type: 'NOTIFICATION_CAMERA_QRCODE',
    topic: '/topic/camera',
  },
  NOTIFICATION_PROCESS_BOOK: {
    type: 'NOTIFICATION_PROCESS_BOOK',
    topic: '/topic/notification/process',
  },
};

/**
 * @XS : Small devices (landscape phones, 576px and up)
 * @SM : Medium devices (tablets, 768px and up)
 * @MD : Large devices (desktops, 992px and up)
 * @LG : Extra large devices (large desktops, 1200px and up)
 */
export const SCREEN_SIZE = {
  XS: 576,
  SM: 768,
  MD: 992,
  LG: 1200,
};

export const TIMEZONE = {
  notUse: 0,
  access24h: 1,
};

/**
 * @breif : Column names
 * @author: Woocheol Kim
 *
 * @VALIDDEVICES : /devices/valid?
 */
export const API_COLUMNS = {
  WORKLOG: ['title', 'startDate', 'endDate', 'userId', 'folderLogId'],
  CATEGORY: ['name', 'description', 'type'],
  DAILY_REPORTS: ['title', 'userId', 'folderLogId', 'date'],
};

/**
 * Object variable for menu names
 * @author WooCheol Kim
 * @date   2020.06.15
 */
export const MENU_NAMES = {
  user: ['user', 'department'],
  categoryManage: ['category'],
  system: ['role'],
  board: ['folder'],
};

export const PROCESSSTATUS_INT = {
  waiting: 0,
  approved1: 1,
  approved: 2,
  rejected: 3,
  cardIssued: 4,
  finished: 5,
  finishedWithoutCardReturn: 6,
  cardReturned: 7,
};

export const CAMERA_TYPES = {
  cameraHanet: 0,
  cameraLPR: 1,
  cameraCCTV: 2,
};

export const DATE_FORMAT = {
  'en-US': 'MM.dd.yyyy',
  'ko-KR': 'yyyy.MM.dd',
  'ko-JP': 'yyyy.MM.dd',
  'vi-VN': 'dd/MM/yyyy',
};

export const DATE_TIME_FORMAT = {
  'en-US': 'MM.dd.yyyy HH:mm:ss',
  'ko-KR': 'yyyy.MM.dd HH:mm:ss',
  'ko-JP': 'yyyy.MM.dd HH:mm:ss',
  'vi-VN': 'dd/MM/yyyy HH:mm:ss',
};

export const FILE_PAGE_FIELD_HIDE_SETTING = {
  UserPage_Basic_index: 'UserPage_Basic_index',
  UserPage_Basic_UserModifiedUi: 'UserPage_Basic_UserModifiedUi',
  DepartmentPage_AddDepartmentModal: 'DepartmentPage_AddDepartmentModal',
  MonitorPage_index: 'MonitorPage_index',
};

export const MEDIA_PERMISSION_TYPE = {
  OWNER: 0,
  EDITOR: 1,
  VIEWER: 2,
};
