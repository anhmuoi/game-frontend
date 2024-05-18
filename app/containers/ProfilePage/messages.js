import { defineMessages } from 'react-intl';

const scope = 'demasterpro.containers.Profile';

const messages = defineMessages({
  preference: {
    id: `${scope}.preference`,
    defaultMessage: 'Preference',
  },
  timezone: {
    id: `${scope}.timezone`,
    defaultMessage: 'Timezone',
  },
  language: {
    id: `${scope}.language`,
    defaultMessage: 'Language',
  },
  changePassword: {
    id: `${scope}.changePassword`,
    defaultMessage: `Change Password`,
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: `Password`,
  },
  confirmPassword: {
    id: `${scope}.confirmPassword`,
    defaultMessage: `Confirm Password`,
  },
  btnSave: {
    id: `demasterpro.components.Common.save`,
    defaultMessage: `Save`,
  },
  btnCancel: {
    id: `demasterpro.components.Common.cancel`,
    defaultMessage: `Cancel`,
  },

  avatar: {
    id: `${scope}.avatar`,
    defaultMessage: 'Avatar',
  },

  languageVietnamese: {
    id: `${scope}.languageVietnamese`,
    defaultMessage: 'Tiếng Việt',
  },
  languageEnglish: {
    id: `${scope}.languageEnglish`,
    defaultMessage: 'English',
  },

  languageKorean: {
    id: `${scope}.languageKorean`,
    defaultMessage: '한국어',
  },
  noImage: {
    id: `${scope}.noImage`,
    defaultMessage: 'NO IMAGE',
  },
  avatarCondition: {
    id: `${scope}.avatarCondition`,
    defaultMessage: '2MB 이하',
  },
});
export default messages;
// Object.values(messages).map(m => console.log(m.defaultMessage))
