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

export const mapModelUserApiToUI = (userApi) => {
  const userClone = {};
  if (userApi) {
    Object.getOwnPropertyNames(userApi).forEach((property) => {
      userClone[property] = {
        value: userApi[property] === null ? '' : userApi[property],
        errorMessage: false,
      };
    });
  }
  return userClone;
};

/**
 * @param(userUi) object: user object get from user (local)
 */
export const mapModelUserUiToApi = (userUi) => {
  const userClone = {
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
  };

  if (userUi) {
    Object.getOwnPropertyNames(userClone).forEach((property) => {
      let { value } = userUi[property];

      if (property === 'departmentId' && value === '') {
        userClone[property] = 0;
      } else {
        userClone[property] =
          value === '' ? '' : typeof value === 'string' ? value.trim() : value;
      }
    });
  }
  return userClone;
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
 * @param(ids) array of number type: ids of user is deleted
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
