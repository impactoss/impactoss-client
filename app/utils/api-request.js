import { API_ENDPOINT } from '../containers/App/constants';
import request from './request';
import { getToken, setToken } from './session-storage';

function parseAuthHeaders(response) {
  const token = response.headers.get('Access-Token');
  setToken(token);
  return response;
}

function addAuthHeaders(headers = {}) {
  const token = getToken();
  return token ? {
    ...headers,
    Authorization: `Bearer ${token}`,
  } : headers;
}

function getHeaders() {
  return addAuthHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT', // Bust IE Cache
  });
}

function urlParamify(params) {
  const urlValues = Object.keys(params).reduce((urlParams, k) => {
    urlParams.append(k, params[k]);
    return urlParams;
  }, new URLSearchParams());

  return urlValues.toString();
}

export default function apiRequest(method, action, params) {
  const headers = getHeaders();
  let url = `${API_ENDPOINT}/${action}`;
  let options = {
    method,
    headers,
  };

  if (method.toUpperCase() === 'GET') { // Create a query string for GET requests
    url = `${url}?${urlParamify(params)}`;
  } else { // all other methods add params to request body
    options = {
      ...options,
      body: JSON.stringify(params),
    };
  }

  return request(url, options, parseAuthHeaders);
}
