/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const enLocaleData = require('react-intl/locale-data/en');
const koLocaleData = require('react-intl/locale-data/ko');
const jaLocaleData = require('react-intl/locale-data/ja');
const viLocaleData = require('react-intl/locale-data/vi');

const enTranslationMessages = require('./translations/en.json');
const koTranslationMessages = require('./translations/ko.json');
const jaTranslationMessages = require('./translations/ja.json');
const viTranslationMessages = require('./translations/vi.json');

addLocaleData(enLocaleData);
addLocaleData(koLocaleData);
addLocaleData(jaLocaleData);
addLocaleData(viLocaleData);

const DEFAULT_LOCALE = 'en';

// prettier-ignore
const appLocales = [
  'en',
  'ko',
  'ja',
  'vi',
];

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  ko: formatTranslationMessages('ko', koTranslationMessages),
  ja: formatTranslationMessages('ja', jaTranslationMessages),
  vi: formatTranslationMessages('vi', viTranslationMessages),
};

exports.appLocales = appLocales;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
