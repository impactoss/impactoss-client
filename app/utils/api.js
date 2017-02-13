import { API_ENDPOINT } from '../containers/App/constants';
import { request as baseRequest } from './request';

function parseAuth(response) {
  console.log(response);
  return response;
}

function urlParams(params) {
  const urlValues = Object.keys(params).reduce((urlParams, k) => {
    urlParams.append(k, params[k]);
    return urlParams;
  }, new URLSearchParams());

  return urlValues.toString();
}

export default function request(action, method = 'GET', params) {

  let token = '' // pull from somwhere

  if(!!token){
    let authorization = `Bearer ${token}`;
  }
  let url = `${API_ENDPOINT}/${action}`;
  let options = {
    method,
    headers: {
      accept: 'application/json',
      contentType: 'application/json',
    },
  };

  if (method.toUpperCase() === 'GET') {
    url = `${url}?${urlParams(params)}`;
  } else {
    options = {
      ...options,
      body: JSON.stringify(params),
    };
  }

  return request(url, options).then(body, httpResponse,
    auth.setToken(https)
    return body
  );
}
