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

export const mapModelRoomManageApiToUI = (roomManageApi) => {
  const roomManageClone = {};
  if (roomManageApi) {
    Object.getOwnPropertyNames(roomManageApi).forEach((property) => {
      roomManageClone[property] = {
        value: roomManageApi[property] === null ? '' : roomManageApi[property],
        errorMessage: false,
      };
    });
  }
  return roomManageClone;
};

/**
 * @param(roomManageUi) object: roomManage object get from roomManage (local)
 */
export const mapModelRoomManageUiToApi = (roomManageUi) => {
  const roomManageClone = {
    name: '',
    isRunning: false,
    default: true,
    description: '',
    totalPeople: 0,
    currentPeople: 0,
    price: 0,
    passwordRoom: '',
    userListId: [],
  };

  if (roomManageUi) {
    Object.getOwnPropertyNames(roomManageClone).forEach((property) => {
      if (roomManageUi[property]) {
        let { value } = roomManageUi[property];

        roomManageClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return roomManageClone;
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
 * @param(ids) array of number type: ids of roomManage is deleted
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
