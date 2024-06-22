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

export const mapModelRoomGameApiToUI = (roomGameApi) => {
  const roomGameClone = {};
  if (roomGameApi) {
    Object.getOwnPropertyNames(roomGameApi).forEach((property) => {
      roomGameClone[property] = {
        value: roomGameApi[property] === null ? '' : roomGameApi[property],
        errorMessage: false,
      };
    });
  }
  return roomGameClone;
};

/**
 * @param(roomGameUi) object: roomGame object get from roomGame (local)
 */
export const mapModelRoomGameUiToApi = (roomGameUi) => {
  const roomGameClone = {
    name: '',
    isRunning: false,
    default: true,
    description: '',
    passwordRoom: '',
    totalPeople: 0,
    currentPeople: 0,
    price: 0,
    userListId: []
  };

  if (roomGameUi) {
    Object.getOwnPropertyNames(roomGameClone).forEach((property) => {
      if (roomGameUi[property]) {
        let { value } = roomGameUi[property];

        roomGameClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return roomGameClone;
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
 * @param(ids) array of number type: ids of roomGame is deleted
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
