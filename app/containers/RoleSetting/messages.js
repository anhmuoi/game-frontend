import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.RoleSettingPage';

export default defineMessages({
  searchBox: {
    id: `${scope}.searchBox`,
    defaultMessage: `Search`,
  },
  addNewRole: {
    id: `${scope}.addNewRole`,
    defaultMessage: `Add New Role`,
  },
  deleteRole: {
    id: `${scope}.deleteRole`,
    defaultMessage: `Delete Role`,
  },
  editRole: {
    id: `${scope}.editRole`,
    defaultMessage: `Edit Role`,
  },
  rowsPerPage: {
    id: `${scope}.rowsPerPage`,
    defaultMessage: `Rows per page`,
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  titleRoleSetting: {
    id: `${scope}.titleRoleSetting`,
    defaultMessage: 'Role Setting ',
  },
  roleName: {
    id: `${scope}.roleName`,
    defaultMessage: 'Role Name ',
  },
  deleteRoles: {
    id: `${scope}.deleteRoles`,
    defaultMessage: 'Do you want to delete below role(s)?',
  },
  similarId: {
    id: `${scope}.similarId`,
    defaultMessage: 'Copy other role',
  },
  enableDepartmentLevel: {
    id: `${scope}.enableDepartmentLevel`,
    defaultMessage: 'Enable Department Level',
  },
  enableDepartmentLevelTooltip: {
    id: `${scope}.enableDepartmentLevelTooltip`,
    defaultMessage: 'Enable Department Level Tooltip',
  },
  default: {
    id: `${scope}.default`,
    defaultMessage: 'Default',
  },
  invalidRoleName: {
    id: `${scope}.invalidRoleName`,
    defaultMessage: 'Role name can not be blank.',
  },
});
