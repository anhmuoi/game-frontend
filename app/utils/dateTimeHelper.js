import { localstoreUtilites } from 'utils/persistenceData';
import { LANGUAGE } from '../utils/constants';
/**
 * @locale : 'ko' current is not available
 * see: https://github.com/date-fns/date-fns/blob/master/src/locale/ko/index.js
 */
// #region
// import koLocale from 'date-fns/locale/ko';
// import enLocale from 'date-fns/locale/en-US';

// const localeMap = {
//   en: enLocale,
//   ko: koLocale,
// };

// export const locale = localeMap[window.lang || LANGUAGE.ENGLISH];
// #endregion
export function getFormatDatePicker() {
  const format = {
    formatStr: 'MM.dd.yyyy',
    reg: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/],
  };
  switch (
    localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
  ) {
    case LANGUAGE.KOREA:
      return {
        formatStr: 'yyyy.MM.dd',
        reg: [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/],
      };
    case LANGUAGE.VIETNAMESE:
      return {
        formatStr: 'dd/MM/yyyy',
        reg: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
      };
    case LANGUAGE.ENGLISH:
    default:
      return format;
  }
}

export function getFormatDateTimePicker() {
  const format = {
    formatStr: 'MM.dd.yyyy HH:mm:ss',
    reg: [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      ':',
      /\d/,
      /\d/,
      ':',
      /\d/,
      /\d/,
    ],
  };
  switch (
    localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
  ) {
    case LANGUAGE.JAPANESE:
    case LANGUAGE.KOREA:
      return {
        formatStr: 'yyyy.MM.dd HH:mm:ss',
        reg: [
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          '.',
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          ':',
          /\d/,
          /\d/,
          ':',
          /\d/,
          /\d/,
        ],
      };
    case LANGUAGE.VIETNAMESE:
      return {
        formatStr: 'dd/MM/yyyy HH:mm:ss',
        reg: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/],
      };
    case LANGUAGE.ENGLISH:
    default:
      return format;
  }
}

export function secondsToString(seconds) {
  const numyears = Math.floor(seconds / 31536000);
  const numdays = Math.floor((seconds % 31536000) / 86400);
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  // const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  const years = !numyears === 0 ? `${numyears} years` : '';
  const days = !(numyears === 0 && numdays === 0) ? `${numdays} days` : '';

  return `${years} ${days} ${numhours} hours ${numminutes} minutes`;
}
