import crypto from 'crypto';
import { TYPE_ACCOUNT, LANGUAGE } from './constants';

/* eslint-disable no-bitwise */
/**
 * Utilites for using localStorage API
 * e.g: save. remove, get...token returned from remote api login.
 */
const DEMASTERPRO_AUTHINFO = 'CARD_GAME_TOKEN_LOGIN';
const DEMASTERPRO_LANGUAGE = 'DEMASTERPRO_LANGUAGE';
const DEMASTERPRO_USERNAME = 'DEMASTERPRO_USERNAME';
const DEMASTERPRO_COMPANYCODE = 'DEMASTERPRO_COMPANYCODE';
const DEMASTERPRO_ACCOUNTTZ = 'DEMASTERPRO_ACCOUNTTZ';
const DEMASTERPRO_CONFIGWS = 'DEMASTERPRO_CONFIGWS';
const DEMASTERPRO_PLUGINS = 'DEMASTERPRO_PLUGINS';
const DEMASTERPRO_USERID = 'DEMASTERPRO_USERID';
const DEMASTERPRO_ACCOUNTID = 'DEMASTERPRO_ACCOUNTID';
const DEMASTERPRO_USERCOMPAMYID = 'DEMASTERPRO_USERCOMPAMYID';
const DEMASTERPRO_REFRESHTOKEN = 'DEMASTERPRO_REFRESHTOKEN';
const DEMASTERPRO_PERMISSIONS = 'DEMASTERPRO_PERMISSIONS';
const DEMASTERPRO_PREFERREDSYSTEM = 'DEMASTERPRO_PREFERREDSYSTEM';

const DEMASTERPRO_USERNAME_CLIENT = 'DEMASTERPRO_USERNAME_CLIENT';
const DEMASTERPRO_COMPANYCODE_CLIENT = 'DEMASTERPRO_COMPANYCODE_CLIENT';
const DEMASTERPRO_CONFIGWS_CLIENT = 'DEMASTERPRO_CONFIGWS_CLIENT';

const ENCRYPTION_KEY = 'DEMASTERPRO_DUALi_ENCRYPTION_KEY';

const getCookie = cname => {
  const name = `${cname}=`;
  let ca = document.cookie.split(';');
  ca = ca.map(item => {
    let c = item;
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
    return '';
  });
  return ca.find(item => item !== '') || null;
};

const setCookie = (cname, cvalue, exdays, setMaxAge = false) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 60 * 1000);
  const expires = `expires=${d.toGMTString()};`;
  const maxAge = 'max-age=0';
  document.cookie = `${cname}=${cvalue};${exdays ? expires : ''}${setMaxAge ? `${maxAge}` : ''}`;
};

const removeCookie = cname => setCookie(cname, '', -1, true);

export const localstoreUtilites = {
  saveToLocalStorage: (authToken, accountType, exdays) => {
    setCookie(
      DEMASTERPRO_AUTHINFO,
      JSON.stringify({
        token: authToken,
        isAuthed: true,
        accountType,
      }),
      exdays,
    );
  },
  getAuthFromLocalStorage: () =>
    JSON.parse(getCookie(DEMASTERPRO_AUTHINFO)) || {
      token: 'token_fake',
      isAuthed: false,
      accountType: TYPE_ACCOUNT.dynamic, // TYPE_ACCOUNT.Visitor
    },
  removeAuthFromLocalStorage: () => {
    removeCookie(DEMASTERPRO_AUTHINFO);
  },
  saveLanguageToLocalStorage: lang => {
    localStorage.setItem(DEMASTERPRO_LANGUAGE, lang);
  },
  getLanguageFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_LANGUAGE) || LANGUAGE.ENGLISH,
  saveUsernameToLocalStorage: username => {
    localStorage.setItem(DEMASTERPRO_USERNAME, username);
  },
  getUsernameFromLocalStorage: () => localStorage.getItem(DEMASTERPRO_USERNAME),
  clearAllFromLocalStorage: () => localStorage.clear(),
  saveCompanycodeToLocalStorage: companyCode => {
    localStorage.setItem(DEMASTERPRO_COMPANYCODE, companyCode);
  },
  getCompanycodeFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_COMPANYCODE),
  saveAccountTzToLocalStorage: accountTz => {
    localStorage.setItem(DEMASTERPRO_ACCOUNTTZ, accountTz);
  },
  getAccountTzFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_ACCOUNTTZ),
  saveConfigWSToLocalStorage: configWS => {
    localStorage.setItem(
      DEMASTERPRO_CONFIGWS,
      encryption(JSON.stringify(configWS)),
    );
  },
  getConfigWSFromLocalStorage: () =>
    JSON.parse(decryption(localStorage.getItem(DEMASTERPRO_CONFIGWS))),
  removeConfigWSFromLocalStorage: () =>
    localStorage.removeItem(DEMASTERPRO_CONFIGWS),
  savePluginsToLocalStorage: plugins => {
    localStorage.setItem(
      DEMASTERPRO_PLUGINS,
      encryption(JSON.stringify(plugins)),
    );
  },
  getPluginsFromLocalStorage: () =>
    JSON.parse(decryption(localStorage.getItem(DEMASTERPRO_PLUGINS))),
  removePluginsFromLocalStorage: () =>
    localStorage.removeItem(DEMASTERPRO_PLUGINS),
  saveUserIdToLocalStorage: userId => {
    localStorage.setItem(DEMASTERPRO_USERID, userId);
  },
  saveAccountIdToLocalStorage: accountId => {
    localStorage.setItem(DEMASTERPRO_ACCOUNTID, accountId);
  },
  getUserIdFromLocalStorage: () => localStorage.getItem(DEMASTERPRO_USERID),
  getAccountIdFromLocalStorage: () => localStorage.getItem(DEMASTERPRO_ACCOUNTID),
  saveUserCompanyIdToLocalStorage: userId => { localStorage.setItem(DEMASTERPRO_USERCOMPAMYID, userId); },
  getUserCompanyIdFromLocalStorage: () => localStorage.getItem(DEMASTERPRO_USERCOMPAMYID),
  saveRefreshTokenToLocalStorage: refreshToken => {
    localStorage.setItem(DEMASTERPRO_REFRESHTOKEN, refreshToken);
  },
  getRefreshTokenToLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_REFRESHTOKEN),
  savePermissionsToLocalStorage: permissions => {
    localStorage.setItem(
      DEMASTERPRO_PERMISSIONS,
      encryption(JSON.stringify(permissions)),
    );
  },
  getPermissionsFromLocalStorage: () =>
    JSON.parse(decryption(localStorage.getItem(DEMASTERPRO_PERMISSIONS))),
  savePreferredSystemToLocalStorage: ui => {
    localStorage.setItem(DEMASTERPRO_PREFERREDSYSTEM, ui);
  },
  getPreferredSystemFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_PREFERREDSYSTEM),

  getUsernameClientFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_USERNAME_CLIENT),
  saveUsernameClientToLocalStorage: username => {
    localStorage.setItem(DEMASTERPRO_USERNAME_CLIENT, username);
  },

  getCompanyCodeClientFromLocalStorage: () =>
    localStorage.getItem(DEMASTERPRO_COMPANYCODE_CLIENT),
  saveCompanyCodeClientToLocalStorage: companyCode => {
    localStorage.setItem(DEMASTERPRO_COMPANYCODE_CLIENT, companyCode);
  },

  getConfigWSClientFromLocalStorage: () =>
    JSON.parse(decryption(localStorage.getItem(DEMASTERPRO_CONFIGWS_CLIENT))),
  saveConfigWSClientToLocalStorage: configWS => {
    localStorage.setItem(
      DEMASTERPRO_CONFIGWS_CLIENT,
      encryption(JSON.stringify(configWS)),
    );
  },
};

const makeHashCode = str => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    // hash |= 0; // Convert to 32bit integer
  }
  if (hash < 0) {
    return hash * -1;
  }
  return hash;
};

const loginToken = localstoreUtilites.getAuthFromLocalStorage().token;

export const sessionId = makeHashCode(loginToken);

// export const isAdmin = currentAccountType === TYPE_ACCOUNT.systemAdmin;
export const isAdmin = () =>
  localstoreUtilites.getAuthFromLocalStorage().accountType ===
  TYPE_ACCOUNT.primaryManager

/**
 * Variable that user types
 * 0: user, 1: visitor
 * @author WooCheol Kim
 */
export const USERTYPE = {
  NORMAL: 0,
  VISITOR: 1,
};

/**
 * Function that encrypt data
 * @author WooCheol Kim
 */
const encryption = data => {
  if (data) {
    const IV_LENGTH = 16;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv
      .toString('hex')
      .concat(':')
      .concat(encrypted.toString('hex'));
  }
  return data;
};

/**
 * Function that decrypt data
 * @author WooCheol Kim
 */
const decryption = data => {
  if (data && data !== 'null' && data !== 'undefined') {
    const textParts = data.split(':');
    const iv2 = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv2,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  return null;
};
