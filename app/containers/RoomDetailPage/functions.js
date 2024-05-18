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

export const mapModelRoomDetailApiToUI = (roomDetailApi) => {
  const roomDetailClone = {};
  if (roomDetailApi) {
    Object.getOwnPropertyNames(roomDetailApi).forEach((property) => {
      roomDetailClone[property] = {
        value: roomDetailApi[property] === null ? '' : roomDetailApi[property],
        errorMessage: false,
      };
    });
  }
  return roomDetailClone;
};

/**
 * @param(roomDetailUi) object: roomDetail object get from roomDetail (local)
 */
export const mapModelRoomDetailUiToApi = (roomDetailUi) => {
  const roomDetailClone = {
    name: '',
    isRunning: false,
    description: '',
    totalPeople: 0,
    currentPeople: 0,
    price: 0,
  };

  if (roomDetailUi) {
    Object.getOwnPropertyNames(roomDetailClone).forEach((property) => {
      if (roomDetailUi[property]) {
        let { value } = roomDetailUi[property];

        roomDetailClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return roomDetailClone;
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
 * @param(ids) array of number type: ids of roomDetail is deleted
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
