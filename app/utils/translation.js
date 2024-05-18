import { LANGUAGE } from './constants.js';
import { localstoreUtilites } from './persistenceData.js';

const lang = localstoreUtilites.getLanguageFromLocalStorage();

export const isUserOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Use' }, { id: false, name: 'Not Use' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Use' }, { id: false, name: 'Not Use' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Use' }, { id: false, name: 'Not Use' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Use' }, { id: false, name: 'Not Use' }];

    default:
      return [{ id: true, name: 'Use' }, { id: false, name: 'Not Use' }];
  }
};
export const isUseCouponOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Used' }, { id: false, name: 'Unused' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Used' }, { id: false, name: 'Unused' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Used' }, { id: false, name: 'Unused' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Used' }, { id: false, name: 'Unused' }];

    default:
      return [{ id: true, name: 'Used' }, { id: false, name: 'Unused' }];
  }
};
export const isSaleOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

    default:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
  }
};
export const isAddLogoOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

    default:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
  }
};
export const isEnablePopupOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

    default:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
  }
};
export const isWaitingRegistrationOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

    default:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
  }
};
export const isUseExpireDateOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

    default:
      return [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];
  }
};
export const salesTableOption = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return [{ id: true, name: 'Transaction Number' }, { id: false, name: 'Sales Amount' }];
    case LANGUAGE.KOREA:
      return [{ id: true, name: 'Transaction Number' }, { id: false, name: 'Sales Amount' }];
    case LANGUAGE.JAPANESE:
      return [{ id: true, name: 'Transaction Number' }, { id: false, name: 'Sales Amount' }];
    case LANGUAGE.VIETNAMESE:
      return [{ id: true, name: 'Transaction Number' }, { id: false, name: 'Sales Amount' }];

    default:
      return [{ id: true, name: 'Transaction Number' }, { id: false, name: 'Sales Amount' }];
  }
};
