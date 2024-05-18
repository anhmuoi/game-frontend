import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.ResetPasswordPage';
export default defineMessages({
  titleResetPassword: {
    id: `${scope}.titleResetPassword`,
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
});
