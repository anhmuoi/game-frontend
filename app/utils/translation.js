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
export const passwordNotMatch = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Password and Confirm password not match!';
    case LANGUAGE.KOREA:
      return 'Password and Confirm password not match!';
    case LANGUAGE.JAPANESE:
      return 'Password and Confirm password not match!';
    case LANGUAGE.VIETNAMESE:
      return 'Mật khẩu và xác nhận mật khẩu không khớp!';

    default:
      return 'Password and Confirm password not match!';
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
export const textUpdateRoom = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Room information is updated!';
    case LANGUAGE.KOREA:
      return 'Room information is updated!';
    case LANGUAGE.JAPANESE:
      return 'Room information is updated!';
    case LANGUAGE.VIETNAMESE:
      return 'Thông tin phòng đã được thay đổi!';

    default:
      return 'Room information is updated!';
  }
};
export const passwordIncorrect = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Password is incorrect!';
    case LANGUAGE.KOREA:
      return 'Password is incorrect!';
    case LANGUAGE.JAPANESE:
      return 'Password is incorrect!';
    case LANGUAGE.VIETNAMESE:
      return 'Mật khẩu không đúng!';

    default:
      return 'Password is incorrect!';
  }
};
export const gameIsRunning = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Room is running!';
    case LANGUAGE.KOREA:
      return 'Room is running!';
    case LANGUAGE.JAPANESE:
      return 'Room is running!';
    case LANGUAGE.VIETNAMESE:
      return 'Phòng đang được chơi!';

    default:
      return 'Room is running!';
  }
};
export const nameRoomExist = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Room is exist!';
    case LANGUAGE.KOREA:
      return 'Room is exist!';
    case LANGUAGE.JAPANESE:
      return 'Room is exist!';
    case LANGUAGE.VIETNAMESE:
      return 'Phòng đã tồn tại!';

    default:
      return 'Room is exist!';
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
export const nameEmpty = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Name can not be empty!';
    case LANGUAGE.KOREA:
      return 'Name can not be empty!';
    case LANGUAGE.JAPANESE:
      return 'Name can not be empty!';
    case LANGUAGE.VIETNAMESE:
      return 'Tên không được để trống!';

    default:
      return 'Name can not be empty!';
  }
};
export const totalPeopleCondition = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'Total People min is 2 and max is 4';
    case LANGUAGE.KOREA:
      return 'Total People min is 2 and max is 4';
    case LANGUAGE.JAPANESE:
      return 'Total People min is 2 and max is 4';
    case LANGUAGE.VIETNAMESE:
      return 'Tổng số người chơi ít nhất là 2 và tối đa là 4';

    default:
      return 'Total People min is 2 and max is 4';
  }
};
export const canNotBuyNftOfYourSelf = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'You cannot buy NFT of yourself!';
    case LANGUAGE.KOREA:
      return 'You cannot buy NFT of yourself!';
    case LANGUAGE.JAPANESE:
      return 'You cannot buy NFT of yourself!';
    case LANGUAGE.VIETNAMESE:
      return 'Bạn không thể mua NFT của chính bạn!';

    default:
      return 'You cannot buy NFT of yourself!';
  }
};
export const msgKick = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'You are kick out room!';
    case LANGUAGE.KOREA:
      return 'You are kick out room!';
    case LANGUAGE.JAPANESE:
      return 'You are kick out room!';
    case LANGUAGE.VIETNAMESE:
      return 'Bạn đã bị đuổi khỏi phòng!';

    default:
      return 'You are kick out room!';
  }
};
export const buyNftSuccess = () => {
  switch (lang) {
    case LANGUAGE.ENGLISH:
      return 'You buy NFT successfully!';
    case LANGUAGE.KOREA:
      return 'You buy NFT successfully!';
    case LANGUAGE.JAPANESE:
      return 'You buy NFT successfully!';
    case LANGUAGE.VIETNAMESE:
      return 'Bạn đã mua NFT thành công!';

    default:
      return 'You buy NFT successfully!';
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
