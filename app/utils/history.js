import { browserHistory } from 'react-router';

function urlParamify(params = {}) {
  const urlValues = Object.keys(params).reduce((urlParams, k) => {
    urlParams.append(k, params[k]);
    return urlParams;
  }, new URLSearchParams());

  return urlValues.toString();
}

export const updateQueryStringParams = (params, push = true) => {
  const location = browserHistory.getCurrentLocation();
  const baseUrl = location.pathname;
  const newParams = urlParamify({
    ...location.query,
    ...params,
  });

  const path = `${baseUrl}?${newParams}`;

  if (push) {
    browserHistory.push(path);
  } else {
    browserHistory.replace(path);
  }
};
