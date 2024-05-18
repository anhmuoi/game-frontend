/**
 * @param(state) object (categoryModel in store category): object merge
 * @param(err) object: object contains error info
 */
export const mergeState = (state, err) => {
  const newState = Object.assign({}, state);

  err.forEach(error => {
    newState[error.field].errorMessage = error.message;
  });

  return newState;
};

/**
 * @param(ids) array of number type: ids of category is deleted
 */
export const mapIdsToQueryString = ids => ids.map(id => `ids=${id}`).join('&');

/**
 * Validate each field's value based on the `validators` object
 * ex: validateFields(
 *  { name: { value: '', errorMessage: '' }},
 *  { name: { type: 'text', minLength: 1, errorMessage: 'required' }},
 * ) will return
 * {
 *  hasError: true,
 *  model: { name: { value: '', errorMessage: 'required' }}
 * }
 * @param {Object} model - current model state
 * @param {Object} validators - contains info like type and error message of each field
 * @returns {Object} - object which has a `hasError` property of type boolean
 * and a `model` property which is the new state
 */
export const validateFields = (model = {}, validators = {}) => {
  let hasError = false;
  const obj = Object.entries(validators);
  const newModel = { ...model };

  obj.forEach(validator => {
    const fieldName = validator[0];
    const validateObj = validator[1];
    const { value } = newModel[fieldName];

    const errorMessage = getErrorMessage(value, validateObj);

    // assign new errorMessage to newModel if there is one
    if (errorMessage) {
      if (!hasError) hasError = true;
      newModel[fieldName].errorMessage = errorMessage;
    }
  });

  return { hasError, model: newModel };
};

/**
 * Return an error message if there is something wrong,
 * else return an empty string
 * @param {any} value - the value need to be validated
 * @param {Object} validateObj - object contains info about the validated value (type, etc...)
 */
function getErrorMessage(value, validateObj = {}) {
  const { type, errorMessage } = validateObj;

  switch (type) {
    case 'text':
      return isText(value, validateObj.minLength) ? '' : errorMessage;
    case 'number':
      return isNumber(value, validateObj.min, validateObj.max)
        ? ''
        : errorMessage;
    default:
      return '';
  }
}

function isText(text, minLength = 0) {
  return typeof text === 'string' && text.length >= minLength;
}

function isNumber(number, min = 0, max = 9e12) {
  return typeof number === 'number' && number >= min && number <= max;
}

/**
 * Make a new object with key, value from
 * the model object
 * ex: getFieldsFromModel(['id'], {id: { value: 1 }})
 * will return
 * { id: 1 }
 * @param {string[]} fieldNames Array if field names
 * @param {Object} model
 */
export function getFieldsFromModel(fieldNames = [], model = {}) {
  const newModel = {};
  fieldNames.forEach(name => {
    newModel[name] = model[name].value;
  });

  return newModel;
}

export const mapCategoryApiToUI = categoryApi => {
  const newState = {};
  // For each property in `model`, set a new value
  // of a matching field in `newState` and clear `errorMessage`
  // ex: model.id --> newState.setIn(['categoryModel', 'id', 'value'], model.id)

  Object.entries(categoryApi).forEach(item => {
    const key = item[0];
    let value = item[1];

    if (key === 'name' && !value) {
      value = '';
    }

    newState[key] = {
      value,
      errorMessage: false,
    };
  });

  return newState;
};
