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

export const mapModelMyProfileApiToUI = (myProfileApi) => {
  const myProfileClone = {};
  if (myProfileApi) {
    Object.getOwnPropertyNames(myProfileApi).forEach((property) => {
      myProfileClone[property] = {
        value: myProfileApi[property] === null ? '' : myProfileApi[property],
        errorMessage: false,
      };
    });
  }
  return myProfileClone;
};

/**
 * @param(myProfileUi) object: myProfile object get from myProfile (local)
 */
export const mapModelMyProfileUiToApi = (myProfileUi) => {
  const myProfileClone = {
    avatar: '',
    name: '',
    userName: '',
    phone: '',
    departmentId: 0,
    position: '',
    email: '',
    status: 0,
    password: '',
    confirmPassword: '',
    language: '',
    timezone: '',
    createdOn: new Date(),
    roleId: 1,
    walletAddress: '',
    ownerRoom: 0,
  };

  if (myProfileUi) {
    Object.getOwnPropertyNames(myProfileClone).forEach((property) => {
      let { value } = myProfileUi[property];

      if (property === 'departmentId' && value === '') {
        myProfileClone[property] = 0;
      } else {
        myProfileClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return myProfileClone;
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
 * @param(ids) array of number type: ids of myProfile is deleted
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
