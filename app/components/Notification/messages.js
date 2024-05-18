/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.components.Notification';
export default defineMessages({
  markAllAsRead: {
    id: `${scope}.markAllAsRead`,
    defaultMessage: `Mark all as read`,
  },
  clearAllRead: {
    id: `${scope}.clearAllRead`,
    defaultMessage: `Clear all read`,
  },
  viewAllNotification: {
    id: `${scope}.viewAllNotification`,
    defaultMessage: `View all notifications`,
  },
  secondsAgo: {
    id: `${scope}.secondsAgo`,
    defaultMessage: `{second} second(s) ago`,
  },
  minutesAgo: {
    id: `${scope}.minutesAgo`,
    defaultMessage: `{minute} minute(s) ago`,
  },
  hoursAgo: {
    id: `${scope}.hoursAgo`,
    defaultMessage: `{hour} hour(s) ago`,
  },
  daysAgo: {
    id: `${scope}.daysAgo`,
    defaultMessage: `{day} day(s) ago`,
  },
});
