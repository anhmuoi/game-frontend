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

export const mapModelDailyReportApiToUI = (dailyReportApi) => {
  const dailyReportClone = {};
  if (dailyReportApi) {
    Object.getOwnPropertyNames(dailyReportApi).forEach((property) => {
      dailyReportClone[property] = {
        value:
          dailyReportApi[property] === null ? '' : dailyReportApi[property],
        errorMessage: false,
      };
    });
  }
  return dailyReportClone;
};

/**
 * @param(dailyReportUi) object: dailyReport object get from dailyReport (local)
 */
export const mapModelDailyReportUiToApi = (dailyReportUi) => {
  const dailyReportClone = {
    title: '',
    content: '',
    userId: 0,
    reporterId: 0,
    folderLogId: 0,
    date: new Date(),
  };

  if (dailyReportUi) {
    Object.getOwnPropertyNames(dailyReportClone).forEach((property) => {
      if (dailyReportUi[property]) {
        let { value } = dailyReportUi[property];

        dailyReportClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return dailyReportClone;
};

/**
 * @param(state) object: object merge
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
 * @param(ids) array of number type: ids of dailyReport is deleted
 */
export const mapIdsToQueryString = (ids) =>
  ids.map((id) => `ids=${id}`).join('&');

export function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
