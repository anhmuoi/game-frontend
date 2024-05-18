/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';
import common from 'components/Common/messages';

export const scope = 'demasterpro.components.DrawerMenu';
export default defineMessages({
  ...common,

  user: {
    id: `${scope}.user`,
    defaultMessage: `User`,
  },
  department: {
    id: `${scope}.department`,
    defaultMessage: `Department`,
  },
  system: {
    id: `${scope}.system`,
    defaultMessage: `System`,
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: `Role Setting`,
  },
  categoryManage: {
    id: `${scope}.categoryManage`,
    defaultMessage: `Category Management`,
  },
  category: {
    id: `${scope}.category`,
    defaultMessage: `Category`,
  },
  schedule: {
    id: `${scope}.schedule`,
    defaultMessage: `Schedule`,
  },
  dashboard: {
    id: `${scope}.dashboard`,
    defaultMessage: `Dashboard`,
  },
  driver: {
    id: `${scope}.driver`,
    defaultMessage: `Driver`,
  },
  myDriver: {
    id: `${scope}.myDriver`,
    defaultMessage: `My Drive`,
  },
  // board
  board: {
    id: `${scope}.board`,
    defaultMessage: `Board`,
  },
  dailyReport: {
    id: `${scope}.dailyReport`,
    defaultMessage: `Daily Report`,
  },
  folder: {
    id: `${scope}.folder`,
    defaultMessage: `Folder Log`,
  },
  sharedWithMe: {
    id: `${scope}.sharedWithMe`,
    defaultMessage: `Shared With Me`,
  },
  game: {
    id: `${scope}.game`,
    defaultMessage: `Game`,
  },
  roomManage: {
    id: `${scope}.roomManage`,
    defaultMessage: `Room Manage`,
  },
});
