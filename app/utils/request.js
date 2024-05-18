import 'whatwg-fetch'
import { localstoreUtilites } from 'utils/persistenceData'
import ApiClient from 'utils/axiosClient'

import { LANGUAGE } from './constants'

/**
 *
 * @param {method: string}: GET, POST, PUT, DELETE...
 * @param {body: object}: payload send to server
 *
 * @return config header for request
 */
export const option = (method, body, responseType) => {
  let headers
  let payloadBody
  if (body instanceof FormData) {
    headers = {
      Authorization: `Bearer ${
        localstoreUtilites.getAuthFromLocalStorage().token
      }`,
    }

    payloadBody = body
  } else {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        localstoreUtilites.getAuthFromLocalStorage().token
      }`,
    }
    payloadBody = JSON.stringify(body)
  }
  const opt = {
    method,
    headers,
    data: payloadBody,
    responseType: responseType || undefined,
  }
  return opt
}

// function replacer(key, value) {
//   if (key === 'fileObject') {
//     const myArray = [];
//     const file = {
//       lastModified: value.lastModified,
//       lastModifiedDate: value.lastModifiedDate,
//       name: value.name,
//       size: value.size,
//       type: value.type,
//     };
//     // add the file obj to your array
//     myArray.push(file);
//     const json = JSON.stringify(myArray);
//     debugger;
//     return json;
//   }
//   return value;
// }

export const responseCode = {
  badRequest: 400,
  validationFailed: 422,
  notFound: 404,
  internalServer: 500,
  createNew: 201,
  ok: 200,
  forbidden: 403,
  unAuthorized: 401,
  noContent: 204,
  resetContent: 205,
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
export function parseJSON(response) {
  if (
    response.status === responseCode.noContent ||
    response.status === responseCode.resetContent
  ) {
    return {}
  }

  if (response.status === responseCode.notFound) {
    window.location.assign('/not-found')
  }

  if (
    response.status === responseCode.unAuthorized &&
    window.location.pathname !== '/login'
  ) {
    /**
     * Not login page clear storage and redirect to login page
     */
    localstoreUtilites.removeAuthFromLocalStorage()
    window.location.assign('/login')
  }

  return response.data
}

/**
 *
 * @param {url} string : url is requested
 */
export function getLang(url) {
  // get lang from window
  const lang =
    localstoreUtilites.getLanguageFromLocalStorage() || LANGUAGE.ENGLISH
  let req = ''
  // check url contains query string
  if (url.indexOf('?') !== -1) {
    req = url.concat(`&culture=${lang}`)
  } else {
    req = url.concat(`?culture=${lang}`)
  }
  return req
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options, saveFile) {
  let callback
  if (saveFile) {
    callback = saveFile
  } else {
    callback = parseJSON
  }
  return ApiClient.request({
    ...options,
    url: getLang(url),
  })
    .then(callback)
    .catch((err) => err)
}

export const checkRes = (statusCode) => {
  const code = String(statusCode)
  if (statusCode !== undefined && !code.startsWith('2')) {
    return true
  }
  return false
}
