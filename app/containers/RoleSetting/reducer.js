import { fromJS } from 'immutable';
import {
  GET_ROLE_LIST_SUCCESS,
  CHANGE_ROLE_NAME,
  GET_INDEX_ROLE_SUCCESS,
  CHANGE_PERMISSION_ENABLED,
  CHANGE_SIMILAR_ID,
  RESET_SIMILAR_ID,
  ENABLE_DEPARTMENT_LEVEL,
  VALIDATE_ROLE
} from './constants';
import { mapRoleModelApiToUi, mergeState } from './roleSettingUtilities';

export const initialState = fromJS({
  roleData: [], // RoleList
  roleModel: {
    id: { value: 0, errorMessage: false },
    roleName: { value: '', errorMessage: false },
    permissionGroups: { value: [], errorMessage: false },
    isDefault: { value: false, errorMessage: false },
    // enableDepartmentLevel: { value: false, errorMessage: false },
  },
  similarId: 0,
});

export default function roleSettingReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ROLE_LIST_SUCCESS:
      return state.set('roleData', fromJS(action.res));
    case CHANGE_ROLE_NAME:
      return state.setIn(['roleModel', action.name, 'value'], action.value);
    case GET_INDEX_ROLE_SUCCESS:
      return state.set('roleModel', fromJS(mapRoleModelApiToUi(action.res)));
    case CHANGE_PERMISSION_ENABLED:
      return state.setIn(
        ['roleModel', 'permissionGroups', 'value'],
        fromJS(action.data),
      );
    case ENABLE_DEPARTMENT_LEVEL:
      return state.setIn(
        ['roleModel', 'enableDepartmentLevel', 'value'],
        fromJS(action.data),
      );
    case CHANGE_SIMILAR_ID:
      return state.set('similarId', action.value);
    case RESET_SIMILAR_ID:
      return state.set('similarId', initialState.get('similarId'));
    case VALIDATE_ROLE:
      return state.set(
        'roleModel',
        fromJS(mergeState(state.toJS().roleModel, action.errors)),
      );
    default:
      return state;
  }
}
