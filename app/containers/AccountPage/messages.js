/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.containers.AccountPage';
export default defineMessages({
  searchBox: {
    id: `${scope}.searchBox`,
    defaultMessage: `Search...`,
  },
  headerStatus: {
    id: `${scope}.headerStatus`,
    defaultMessage: `Status`,
  },
  headerRole: {
    id: `${scope}.headerRole`,
    defaultMessage: `Role`,
  },
  headerEmail: {
    id: `${scope}.headerEmail`,
    defaultMessage: `Email`,
  },
  titleTable: {
    id: `${scope}.titleTable`,
    defaultMessage: `Account list`,
  },
  btnSave: {
    id: `${scope}.btnSave`,
    defaultMessage: `Save`,
  },
  btnCancel: {
    id: `${scope}.btnCancel`,
    defaultMessage: `Cancel`,
  },
  companyCode: {
    id: `${scope}.companyCode`,
    defaultMessage: `Company code`,
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: `Email`,
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: `Password`,
  },
  confirmPassword: {
    id: `${scope}.confirmPassword`,
    defaultMessage: `Confirm Password`,
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: `Role`,
  },
  editTitleModal: {
    id: `${scope}.editTitleModal`,
    defaultMessage: `Edit account`,
  },
  addTitleModal: {
    id: `${scope}.addTitleModal`,
    defaultMessage: `Add account`,
  },
  roleTooltip: {
    id: `${scope}.roleTooltip`,
    defaultMessage: `
    Role : Primary Administrator - Up to setting
    Secondary Administrator - Only inquiry`,
  },
  titleUserToolBarDelete: {
    id: `${scope}.titleUserToolBarDelete`,
    defaultMessage: `Delete Users`,
  },
  confirmDelete: {
    id: `${scope}.confirmDelete`,
    defaultMessage: 'Do you want to delete?',
  },
  invalidEmail: {
    id: `${scope}.invalidEmail`,
    defaultMessage: 'Email can not be blank.',
  },
  invalidPassword: {
    id: `${scope}.invalidPassword`,
    defaultMessage: 'Password can not be blank.',
  },
  invalidConfirmPassword: {
    id: `${scope}.invalidConfirmPassword`,
    defaultMessage: 'Confirm Password can not be blank.',
  },
  invalidEmailFormat: {
    id: `${scope}.invalidEmailFormat`,
    defaultMessage: 'Invalid email address.',
  },
  passwordNotMatch: {
    id: `${scope}.passwordNotMatch`,
    defaultMessage: 'Confirm password is not matched with Password.',
  },
  userName: {
    id: `${scope}.userName`,
    defaultMessage: 'User Name',
  },
  militaryNumber: {
    id: `${scope}.militaryNumber`,
    defaultMessage: 'Military Number',
  },
  department: {
    id: `demasterpro.containers.UserPage.department`,
    defaultMessage: 'Department',
  },
  account: {
    id: `demasterpro.containers.VisitPage.account`,
    defaultMessage: 'Account',
  },
  name: {
    id: `demasterpro.containers.VisitPage.name`,
    defaultMessage: 'Name',
  },
  invalidMilitaryNumber: {
    id: `${scope}.invalidMilitaryNumber`,
    defaultMessage: 'Military Number can not be blank.',
  },
});
