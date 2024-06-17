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

export const mapModelMarketApiToUI = (myGroupApi) => {
  const myGroupClone = {};
  if (myGroupApi) {
    Object.getOwnPropertyNames(myGroupApi).forEach((property) => {
      myGroupClone[property] = {
        value: myGroupApi[property] === null ? '' : myGroupApi[property],
        errorMessage: false,
      };
    });
  }
  return myGroupClone;
};

/**
 * @param(myGroupUi) object: myGroup object get from myGroup (local)
 */
export const mapModelMarketUiToApi = (myGroupUi) => {
  const myGroupClone = {
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

  if (myGroupUi) {
    Object.getOwnPropertyNames(myGroupClone).forEach((property) => {
      if (myGroupUi[property]) {
        let { value } = myGroupUi[property];

        myGroupClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return myGroupClone;
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
 * @param(ids) array of number type: ids of myGroup is deleted
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
