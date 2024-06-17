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

export const mapModelMarketApiToUI = (historyApi) => {
  const historyClone = {};
  if (historyApi) {
    Object.getOwnPropertyNames(historyApi).forEach((property) => {
      historyClone[property] = {
        value: historyApi[property] === null ? '' : historyApi[property],
        errorMessage: false,
      };
    });
  }
  return historyClone;
};

/**
 * @param(historyUi) object: history object get from history (local)
 */
export const mapModelMarketUiToApi = (historyUi) => {
  const historyClone = {
    address: '',
    name: '',
    description: '',
    image: '',
    mana: 0,
    aliasId: '',
    price: 0,
    status: 0,
    itemNftId: 0,
    userId: 0,
  };

  if (historyUi) {
    Object.getOwnPropertyNames(historyClone).forEach((property) => {
      if (historyUi[property]) {
        let { value } = historyUi[property];

        historyClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return historyClone;
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
 * @param(ids) array of number type: ids of history is deleted
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
