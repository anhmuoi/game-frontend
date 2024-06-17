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
export const balanceNotEnough = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Your balance is not enough';
    case LANGUAGE.KOREA:
      return 'Your balance is not enough';
    case LANGUAGE.JAPANESE:
      return 'Your balance is not enough';
    case LANGUAGE.VIETNAMESE:
      return 'Số dư của bạn không đủ';

    default:
      return 'Your balance is not enough';
  }
};
export const notiGetFriend = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'You received a friend request from: ';
    case LANGUAGE.KOREA:
      return 'You received a friend request from: ';
    case LANGUAGE.JAPANESE:
      return 'You received a friend request from: ';
    case LANGUAGE.VIETNAMESE:
      return 'Bạn nhận được lời mời kết bạn từ: ';

    default:
      return 'You received a friend request from: ';
  }
};
export const agreeAddFriend = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return ' agreed to make friends!';
    case LANGUAGE.KOREA:
      return ' agreed to make friends!';
    case LANGUAGE.JAPANESE:
      return ' agreed to make friends!';
    case LANGUAGE.VIETNAMESE:
      return ' đã đồng ý kết bạn!';

    default:
      return ' agreed to make friends!';
  }
};
export const existItem = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'You cannot carry items with the same attributes!';
    case LANGUAGE.KOREA:
      return 'You cannot carry items with the same attributes!';
    case LANGUAGE.JAPANESE:
      return 'You cannot carry items with the same attributes!';
    case LANGUAGE.VIETNAMESE:
      return 'Bạn không thể chọn hai vật phẩm giống nhau!';

    default:
      return 'You cannot carry items with the same attributes!';
  }
};
export const AgreeMess = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Agree';
    case LANGUAGE.KOREA:
      return 'Agree';
    case LANGUAGE.JAPANESE:
      return 'Agree';
    case LANGUAGE.VIETNAMESE:
      return 'Đồng ý';

    default:
      return 'Agree';
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
