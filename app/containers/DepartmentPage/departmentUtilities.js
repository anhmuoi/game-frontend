import { sortObject } from 'containers/App/appUtilities';
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

const orderHeader = [
  'number',
  'name',
  'numberUser',
  'departmentManager',
  'id',
  'departmentManagerId',
];
export const reOderData = (data, headers = orderHeader) =>
  data.map((item) => sortObject(item, headers));

export const reformatHeaders = (headers) => {
  const newHeaders = headers.map((item) => {
    let returnVal = { ...item };
    if (
      item.headerVariable === 'ExpiredDate' ||
      item.headerVariable === 'CardList' ||
      item.headerVariable === 'MilitaryNo'
    ) {
      returnVal = { ...returnVal, width: '120px' };
    }
    if (item.headerVariable === 'EmployeeNo') {
      returnVal = {
        ...returnVal,
        width: '120px',
      };
    }

    if (item.headerVariable && item.headerVariable === 'Action') {
      return {
        ...returnVal,
        numeric: true,
        disablePadding: false,
        label: '##',
        width: '50px',
        id: 'action',
        property: 'action',
      };
    }
    const str = returnVal.headerVariable.substr(0, 1);
    return {
      ...returnVal,
      id: returnVal.headerVariable.replace(str, str.toLowerCase()),
      label: item.headerName,
      property: returnVal.headerVariable.replace(str, str.toLowerCase()),
    };
  });
  const actionRow = newHeaders.find((item) => item.headerVariable === 'Action');
  const actionIndex = newHeaders.indexOf(actionRow);
  newHeaders.splice(actionIndex, 1);
  newHeaders.push(actionRow);

  return newHeaders.filter((item) => item.id.toLowerCase() !== 'id');
};
