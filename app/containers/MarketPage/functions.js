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

export const mapModelMarketApiToUI = (marketApi) => {
  const marketClone = {};
  if (marketApi) {
    Object.getOwnPropertyNames(marketApi).forEach((property) => {
      marketClone[property] = {
        value: marketApi[property] === null ? '' : marketApi[property],
        errorMessage: false,
      };
    });
  }
  return marketClone;
};

/**
 * @param(marketUi) object: market object get from market (local)
 */
export const mapModelMarketUiToApi = (marketUi) => {
  const marketClone = {
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

  if (marketUi) {
    Object.getOwnPropertyNames(marketClone).forEach((property) => {
      if (marketUi[property]) {
        let { value } = marketUi[property];

        marketClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return marketClone;
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
 * @param(ids) array of number type: ids of market is deleted
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
