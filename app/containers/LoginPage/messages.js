/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.LoginPage';
export default defineMessages({
  rememberMe: {
    id: `${scope}.rememberMe`,
    defaultMessage: 'Remember Me',
  },
  btnSend: {
    id: `${scope}.btnSend`,
    defaultMessage: 'Send',
  },
  emailAddress: {
    id: `${scope}.emailAddress`,
    defaultMessage: 'Email address: ',
  },
  mesInvalidLogin: {
    id: `${scope}.mesInvalidLogin`,
    defaultMessage: 'Username and password is required',
  },
  titleFormLogin: {
    id: `${scope}.titleFormLogin`,
    defaultMessage: '{title} - Sign in',
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: 'Username',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  signIn: {
    id: `${scope}.signIn`,
    defaultMessage: 'Sign in',
  },
  forgotPassword: {
    id: `${scope}.forgotPassword`,
    defaultMessage: 'Forgot Password',
  },
  requestVisit: {
    id: `${scope}.requestVisit`,
    defaultMessage: 'Register in Advance',
  },
  messageValidEmail: {
    id: `${scope}.messageValidEmail`,
    defaultMessage: 'Email is required',
  },
  selectToLogin: {
    id: `${scope}.selectToLogin`,
    defaultMessage: 'Select To Login',
  },
  titleFormAuthenticationKey: {
    id: `${scope}.titleFormAuthenticationKey`,
    defaultMessage: 'DeMasterPro -  License Key Verification',
  },
  desFormAuthenticationKey: {
    id: `${scope}.desFormAuthenticationKey`,
    defaultMessage:
      'Please enter the License Key that provided together with your software package in order to activate the system!',
  },
  licenseKey: {
    id: `${scope}.licenseKey`,
    defaultMessage: 'License Key(XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX)',
  },
  verifyKey: {
    id: `${scope}.verifyKey`,
    defaultMessage: 'Verify Key',
  },
  returnPageLogin: {
    id: `${scope}.returnPageLogin`,
    defaultMessage: 'Return Page Login',
  },
  resetPasswd: {
    id: `demasterpro.containers.ResetPasswordPage.titleChangePassword`,
    defaultMessage: '비밀번호 변경',
  },
  labelContinueNewSession: {
    id: `${scope}.labelContinueNewSession`,
    defaultMessage:
      'Account is being used on another device. Do you want continue?',
  },
  btnContinue: {
    id: `${scope}.btnContinue`,
    defaultMessage: 'Continue',
  },
  btnCancel: {
    id: `${scope}.btnCancel`,
    defaultMessage: 'Cancel',
  },
  happyPingPong: {
    id: `${scope}.happyPingPong`,
    defaultMessage: 'Happy PingPong',
  },
  barcode: {
    id: `${scope}.barcode`,
    defaultMessage: 'Barcode',
  },
  purchasing: {
    id: `${scope}.purchasing`,
    defaultMessage: 'Purchasing',
  },
  workLogs: {
    id: `${scope}.workLogs`,
    defaultMessage: 'Work Logs',
  },
});
