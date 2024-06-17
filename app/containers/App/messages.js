import { defineMessages } from 'react-intl';
import common from 'components/Common/messages';

export const scope = 'demasterpro.components.App';
export default defineMessages({
  ...common,
  btnDismiss: {
    id: `${scope}.btnDismiss`,
    defaultMessage: 'Dismiss',
  },
  titleUserRoute: {
    id: `${scope}.titleUserRoute`,
    defaultMessage: 'User',
  },
  titleAddUserRoute: {
    id: `${scope}.titleAddUserRoute`,
    defaultMessage: 'Add User',
  },
  titleEditUserRoute: {
    id: `${scope}.titleEditUserRoute`,
    defaultMessage: 'Edit User',
  },
  titleRoleSettingRoute: {
    id: `${scope}.titleRoleSettingRoute`,
    defaultMessage: 'Role Setting',
  },
  titleNotFoundRoute: {
    id: `${scope}.titleNotFoundRoute`,
    defaultMessage: 'Not found',
  },
  titleDepartmentRoute: {
    id: `${scope}.titleDepartmentRoute`,
    defaultMessage: 'Department',
  },
  titleCategoryRoute: {
    id: `${scope}.titleCategoryRoute`,
    defaultMessage: 'Category',
  },
  titleScheduleRoute: {
    id: `${scope}.titleScheduleRoute`,
    defaultMessage: 'Schedule',
  },
  titleProfile: {
    id: `${scope}.titleProfile`,
    defaultMessage: `Profile`,
  },
  titleDashboard: {
    id: `${scope}.titleDashboard`,
    defaultMessage: `Dashboard`,
  },
  titleMyDriver: {
    id: `${scope}.titleMyDriver`,
    defaultMessage: `My Drive`,
  },
  titleDocument: {
    id: `${scope}.titleDocument`,
    defaultMessage: `Document`,
  },
  titleSharedWithMe: {
    id: `${scope}.titleSharedWithMe`,
    defaultMessage: `Shared With Me`,
  },
  // board 
  titleFolder: {
    id: `${scope}.titleFolder`,
    defaultMessage: `Folder Log`,
  },
  titleDailyReport: {
    id: `${scope}.titleDailyReport`,
    defaultMessage: `Daily Report`,
  },
  // room manage
  titleRoomManageRoute: {
    id: `${scope}.titleRoomManageRoute`,
    defaultMessage: `Room Manage`,
  },
  titleNFT: {
    id: `${scope}.titleNFT`,
    defaultMessage: `NFT`,
  },
});
