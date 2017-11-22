import 'whatwg-fetch';
import { map } from 'lodash/collection';
import { capitalize } from 'lodash/string';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  // console.error("Non JSON response!"); // eslint-disable-line
  return {};
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  // debugger;
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;

  throw error;
}

export function isContentJSON(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function checkResponseError(error) {
  return error.response
    ? {
      messages: checkErrorMessagesExist(error.response),
      statusText: error.response.statusText,
      status: error.response.status,
      error,
    }
    : {
      messages: [],
      statusText: 'Error without response',
      status: 0,
      error,
    };
}

function mapErrors(errors) {
  return map(errors, (error, key) => `${capitalize(key)}: ${error}`);
}

export function checkErrorMessagesExist(response) {
  if (response && response.json && response.json.errors && response.json.errors.full_messages) {
    return response.json.errors.full_messages;
  } else if (response && response.json && response.json.errors) {
    return response.json.errors;
  } else if (response && response.json && response.json.error) {
    return response.json.error === Object(response.json.error)
      ? mapErrors(response.json.error)
      : [response.json.error];
  } else if (response && response.json) {
    return response.json === Object(response.json)
      ? mapErrors(response.json)
      : [response.json];
  }
  return [];
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options, middleware) {
  return fetch(url, options)
    .then((response) => middleware ? middleware(response) : response)
    .then(checkStatus)
    .then(parseJSON);
}
