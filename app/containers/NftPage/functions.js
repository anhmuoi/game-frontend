export const mergeMetaPaging = (metaPaging, meta) => {
  const metaPagingClone = {};
  Object.assign(metaPagingClone, metaPaging);

  Object.getOwnPropertyNames(meta).forEach(property => {
    if (property in metaPagingClone) {
      metaPagingClone[property] = meta[property];
    }
  });
  return metaPagingClone;
};

export const mapModelSettingApiToUI = settingApi => {
  const settingClone = {};
  if (settingApi) {
    Object.getOwnPropertyNames(settingApi).forEach(property => {
      settingClone[property] = {
        value: settingApi[property] === null ? '' : settingApi[property],
        errorMessage: false,
      };
    });
  }
  return settingClone;
};

/**
 * @param(settingUi) object: setting object get from setting (local)
 */
export const mapModelSettingUiToApi = settingUi => {
  const settingClone = {
    welcomeCoupon: {},
    visitCoupon: {},
    memberLevel: {},
    birthdayCoupon : {},
  };

  if (settingUi) {
    Object.getOwnPropertyNames(settingClone).forEach(property => {
      let { value } = settingUi[property];

      settingClone[property] =
        value === '' ? null : typeof value === 'string' ? value.trim() : value;
    });
  }
  return settingClone;
};

/**
 * @param(settingUi) object: setting object get from setting (local)
 */
export const mapModelCouponUiToApi = couponUi => {
  const couponClone = {
    name: '',
    description: '',
    image: '',
    mana: 0,
    aliasId: '',
  };

  if (couponUi) {
    Object.getOwnPropertyNames(couponClone).forEach(property => {
      let { value } = couponUi[property];

      couponClone[property] =
        value === '' ? null : typeof value === 'string' ? value.trim() : value;
    });
  }
  return couponClone;
};

/**
 * @param(state) object: object merge
 * @param(err) object: object contains error info
 */
export const mergeState = (state, err) => {
  const errorUI = {};
  err.forEach(error => {
    errorUI[error.field] = error.message;
  });

  const cloneState = {};
  Object.getOwnPropertyNames(state).forEach(property => {
    cloneState[property] = {
      value: state[property].value,
      errorMessage: errorUI[property] ? errorUI[property] : false,
    };
  });
  return cloneState;
};

/**
 * @param(ids) array of number type: ids of setting is deleted
 */
export const mapIdsToQueryString = ids => ids.map(id => `ids=${id}`).join('&');

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
