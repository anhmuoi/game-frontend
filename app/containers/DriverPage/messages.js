import { defineMessages } from 'react-intl';
export const scope = 'demasterpro.components.DriverPage';
import common from 'components/Common/messages';

export default defineMessages({
  ...common,
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  owner: {
    id: `${scope}.owner`,
    defaultMessage: 'Owner',
  },
  updatedOn: {
    id: `${scope}.updatedOn`,
    defaultMessage: 'UpdatedOn',
  },
  size: {
    id: `${scope}.size`,
    defaultMessage: 'Size',
  },
  addFolder: {
    id: `${scope}.addFolder`,
    defaultMessage: 'Add Folder',
  },
  addFile: {
    id: `${scope}.addFile`,
    defaultMessage: 'Add File',
  },
  newFolder: {
    id: `${scope}.newFolder`,
    defaultMessage: 'New Folder',
  },
  viewAction: {
    id: `${scope}.viewAction`,
    defaultMessage: 'View Action',
  },
  rename: {
    id: `${scope}.rename`,
    defaultMessage: 'Rename',
  },
  share: {
    id: `${scope}.share`,
    defaultMessage: 'Share',
  },
  copyLink: {
    id: `${scope}.copyLink`,
    defaultMessage: 'Copy Link',
  },
  download: {
    id: `${scope}.download`,
    defaultMessage: 'Download',
  },
  msgCopyLinkSuccess: {
    id: `${scope}.msgCopyLinkSuccess`,
    defaultMessage: 'Copy link successfully!',
  },
  confirmDeleteDocument: {
    id: `${scope}.confirmDeleteDocument`,
    defaultMessage: 'Do you want delete this document?',
  },
  shareDocument: {
    id: `${scope}.shareDocument`,
    defaultMessage: 'Share Document',
  },
  listUserAccess: {
    id: `${scope}.listUserAccess`,
    defaultMessage: 'List of users can be access',
  },
  removePermission: {
    id: `${scope}.removePermission`,
    defaultMessage: 'Remove Access',
  },
  userName: {
    id: `${scope}.userName`,
    defaultMessage: 'Name',
  },
  listUserNotAccess: {
    id: `${scope}.listUserAccess`,
    defaultMessage: 'List of users can not access',
  },
  departmentName: {
    id: `${scope}.departmentName`,
    defaultMessage: 'Department',
  },
});