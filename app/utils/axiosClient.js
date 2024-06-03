import axios from 'axios';
import { URL_DOMAIN, cookieExpires } from 'utils/constants';
import { localstoreUtilites } from 'utils/persistenceData';

let isRefreshing = false;
const refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

const ApiClient = axios.create({
  /**
   * Import the config from the App/Config/index.js file
   */
  baseURL: URL_DOMAIN,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 0,
});

ApiClient.interceptors.request.use(
  async (config) => {
    const auth = await localstoreUtilites.getAuthFromLocalStorage();
    const { token, accountType } = auth;
    if (
      cookieExpires &&
      config.url &&
      !(config.url.includes('-password') || config.url.includes('login'))
    ) {
      localstoreUtilites.saveToLocalStorage(token, accountType, cookieExpires);
    }
    // Do something before request is sent
    const headers = {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    };
    let params = { ...config.params };
    if (config.url && config.url.indexOf('culture') < 0) {
      const language = localstoreUtilites.getLanguageFromLocalStorage();
      params = {
        ...params,
        culture: language || 'en-us',
      };
    }
    return {
      ...config,
      headers,
      params,
    };
  },
  (error) => {
    // Do something with request error
    console.log('error', { ...error });
    return Promise.reject(error);
  },
);

ApiClient.interceptors.response.use(
  async (response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);
    response,
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('ApiClient', { ...error });
    const originalRequest = error.config;
    if (
      originalRequest.url.indexOf(`${originalRequest.baseURL}/login`) !== -1
    ) {
      return Promise.reject(error.response.data);
    }
    if (originalRequest.url === `/refreshtoken`) {
      localstoreUtilites.removeAuthFromLocalStorage();
      // window.location.assign('/login');
      return Promise.reject(error.response.data);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest.retry) {
      try {
        originalRequest.retry = true;
        // Just return if username or password is invalid
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 1002
        ) {
          return error.response;
        }
        if (!isRefreshing) {
          isRefreshing = true;
          const authToken = await localstoreUtilites.getAuthFromLocalStorage()
            .token;
          const refreshToken = localstoreUtilites.getRefreshTokenToLocalStorage();
          const { data } = await ApiClient.post(
            '/refreshtoken',
            {
              expiredToken: authToken,
              refreshToken:refreshToken,
            },
            {
              params: {
                expiredToken: authToken,
                refreshToken,
              },
            },
          );
          isRefreshing = false;

          localstoreUtilites.saveToLocalStorage(
            data.data.authToken,
            data.data.accountType,
            cookieExpires,
          );
          localstoreUtilites.saveRefreshTokenToLocalStorage(
            data.data.refreshToken,
          );
          localstoreUtilites.saveConfigWSToLocalStorage(
            data.data.queueService,
          );
          // localstoreUtilites.savePluginsToLocalStorage(data.data.plugIn);
          // localstoreUtilites.saveUserIdToLocalStorage(data.data.accountId);
          localstoreUtilites.saveCompanycodeToLocalStorage(
            data.data.companyCode,
          );
          localstoreUtilites.saveAccountTzToLocalStorage(
            data.data.userTimeZone,
          );
          onRefreshed(data.data.authToken);
        }

        const retryOrigReq = new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            // replace the expired token and retry
            ApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
            resolve(ApiClient.request(originalRequest));
          });
        });
        return retryOrigReq;
      } catch (err) {
        console.log('refreshToken', err);
        localstoreUtilites.removeAuthFromLocalStorage();
        window.location.assign('/login');
        return Promise.reject(error);
      }
    }
    if (error.response.status === 404) {
      return Promise.reject(error.response.data);
    }
    if (error.response.status === 422) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.response.data);
  },
);

export default ApiClient;
