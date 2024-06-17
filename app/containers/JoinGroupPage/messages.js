import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.JoinGroupPage';
export default defineMessages({
  titleJoinGroup: {
    id: `${scope}.titleJoinGroup`,
    defaultMessage: `Reset password`,
  },
  titleChangePassword: {
    id: `${scope}.titleChangePassword`,
    defaultMessage: `Change password`,
  },
  currentPassword: {
    id: `${scope}.currentPassword`,
    defaultMessage: `Current password`,
  },
  loginId: {
    id: `${scope}.loginId`,
    defaultMessage: `Id`,
  },
  newPassword: {
    id: `${scope}.newPassword`,
    defaultMessage: `New password`,
  },
  confirmNewPassword: {
    id: `${scope}.confirmNewPassword`,
    defaultMessage: `New password confirmation`,
  },
  notifyPage: {
    id: `${scope}.notifyPage`,
    defaultMessage: `Please enter a new password to change the password.`,
  },
  agree: {
    id: `${scope}.agree`,
    defaultMessage: `Agree`,
  },
  reject: {
    id: `${scope}.reject`,
    defaultMessage: `Reject`,
  },
  thanks: {
    id: `${scope}.thanks`,
    defaultMessage: `Thank you!`,
  },
  askAgreeJoinGroup: {
    id: `${scope}.askAgreeJoinGroup`,
    defaultMessage: `Do you agree to let this person join the group?`,
  },
});
