import { API_ENDPOINT } from '../containers/App/constants';
import request from './request';
import { get, set } from './session-storage';

// We will look for these headers, and save them to localStorage
const authKeys = [
  'access-token',
  'token-type',
  'client',
  'expiry',
  'uid',
];

// Look at each authKey in session-storage, if found add to returned object
export function getAuthValues() {
  return authKeys.reduce((headers, key) => {
    const value = get(key);
    return value ? { // value found in storage, add it to the headers object
      ...headers,
      [key]: value,
    }
    : headers; // no value found, return existing headers
  }, {});
}

// Look at each authKey, if its in the response header save it to session-storage
// This method will be passed as the middleware param to `request`
function saveAuthHeaders(response) {
  authKeys.forEach((key) => {
    const headerValue = response.headers.get(key);
    if (headerValue) { // TODO temp, should clear headers here, I'm not now to debug https://github.com/dumparkltd/hr-nmrf-client/issues/75
      set(key, headerValue);
    }
  });

  return response;
}

export function clearAuthValues() {
  authKeys.forEach((key) => {
    set(key, null);
  });
}

// Add authorization headers if we have some
function addAuthHeaders(headers = {}) {
  const authValues = getAuthValues();

  // If we have access-token in session-storage going to presume we have the rest
  return 'access-token' in authValues ? {
    ...headers,
    ...authValues,
    authorization: `Bearer ${authValues['access-token']}`,
  }
  : headers; // can't find access-token, no auth headers to add
}


function getHeaders() {
  return addAuthHeaders({
    // and always add these headers
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT', // Bust IE Cache
  });
}

function urlParamify(params = {}) {
  const urlValues = Object.keys(params).reduce((urlParams, k) => {
    urlParams.append(k, params[k]);
    return urlParams;
  }, new URLSearchParams());

  return urlValues.toString();
}

export default function apiRequest(method, action, params = {}) {
  const headers = getHeaders();
  let url = `${API_ENDPOINT}/${action}`;
  let options = {
    method,
    headers,
  };

  if (Object.keys(params).length > 0) {
    // Add params to request
    if (method.toUpperCase() === 'GET') {
      // Create a query string for GET requests
      url = `${url}?${urlParamify(params)}`;
    } else {
      // all other methods add params to request body
      options = {
        ...options,
        body: JSON.stringify(params),
      };
    }
  }

  // Pass the saveAuthHeaders middleware function to the request library
  return request(url, options, saveAuthHeaders);
}

// TODO create is logged in function which gets the token from storage

// TODO create a clear function to clear auth information from local storage
