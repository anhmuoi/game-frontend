/* eslint-disable no-nested-ternary */
const TabletSize = 768;
const WidthWindow = window.innerWidth;

export const stylesAccountModify = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: WidthWindow >= TabletSize ? theme.spacing.unit * 10 : 0,
    paddingRight: WidthWindow >= TabletSize ? theme.spacing.unit * 10 : 0,
    paddingBottom:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 10
        : theme.spacing.unit * 5,
    paddingTop: WidthWindow >= TabletSize ? theme.spacing.unit * 2 : 0,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing.unit,
    width: 100,
  },
  linkCancel: {
    textDecoration: 'none',
  },
  input: {
    display: 'none',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  smallIcon: {
    fontSize: 20,
  },
  wrapper: {
    margin: 12,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
  tooltip: {
    padding: theme.spacing.unit,
    color: theme.palette.primary.main,
  },
});

export const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingLeft:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 10
        : theme.spacing.unit * 2,
    paddingRight:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 10
        : theme.spacing.unit * 2,
    paddingBottom:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 10
        : theme.spacing.unit * 10,
    paddingTop:
      WidthWindow >= TabletSize
        ? theme.spacing.unit * 2
        : theme.spacing.unit * 2,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  buttonAvata: {
    margin: theme.spacing.unit,
    border: '1px dashed gray',
    padding: theme.spacing.unit * 5,
  },
  input: {
    display: 'none',
  },
  containerAvata: {
    textAlign: 'center',
  },
  headerForm: {
    marginBottom: theme.spacing.unit,
    fontWeight: 'bold',
  },
});

/**
 * @param(accountApi) object: Account object get from api (remote)
 */
export const mapModelAccountApiToUI = (accountApi) => {
  const accountClone = {};
  if (accountApi) {
    Object.getOwnPropertyNames(accountApi).forEach((property) => {
      accountClone[property] = {
        value: accountApi[property] === null ? '' : accountApi[property],
        errorMessage: false,
      };
    });
  }
  return accountClone;
};

/**
 * @param(accountUi) object: Account object get from store (local)
 */
export const mapModelAccountUiToApi = (accountUi) => {
  const accountClone = {
    username: '',
    password: '',
    confirmPassword: '',
    companyId: 0,
    // rootFlag: true,
    role: 0,
    // status: 0,
  };

  if (accountUi) {
    Object.getOwnPropertyNames(accountClone).forEach((property) => {
      let { value } = accountUi[property];
      if (property === 'role' || property === 'status') {
        value = parseInt(accountUi[property].value, 10);
      }
      if (property === 'password' || property === 'confirmPassword') {
        accountClone[property] = value === '' ? null : value;
      } else {
        accountClone[property] =
          value === ''
            ? null
            : typeof value === 'string'
            ? value.trim()
            : value;
      }
    });
  }
  return accountClone;
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
 * @param(ids) array of number type: ids of Account is deleted
 */
export const mapIdsToQueryString = (ids) =>
  ids.map((id) => `ids=${id}`).join('&');
