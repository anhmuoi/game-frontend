import { format } from 'date-fns';

export const countCreatedDuration = (date, intl, messages) => {
  const createdDate = new Date(date);
  const timeDiff = Math.floor((new Date() - createdDate) / 1000);

  if (timeDiff < 60) {
    return intl.formatMessage(
      {
        ...messages.secondsAgo,
      },
      { second: timeDiff },
    );
  }

  const minuteDiff = Math.floor(timeDiff / 60);

  if (minuteDiff < 60) {
    return intl.formatMessage(
      {
        ...messages.minutesAgo,
      },
      { minute: minuteDiff },
    );
  }

  const hourDiff = Math.floor(minuteDiff / 60);

  if (hourDiff < 24) {
    return intl.formatMessage(
      {
        ...messages.hoursAgo,
      },
      { hour: hourDiff },
    );
  }

  const days = Math.floor(hourDiff / 24);

  if (days <= 10) {
    return intl.formatMessage(
      {
        ...messages.daysAgo,
      },
      { day: days },
    );
  }

  return format(new Date(date), 'MM.dd.yyyy');
};

export function isOnNotificationPage() {
  return window.location.href.includes('notifications');
}
