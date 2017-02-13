// based on https://github.com/lynndylanhurley/redux-auth
// import Cookies from "browser-cookies";

const root = Function('return this')() || (42, eval)('this');

export function getTokenFormat() {
  return {
    'access-token': '{{ access-token }}',
    'token-type': 'Bearer',
    client: '{{ client }}',
    expiry: '{{ expiry }}',
    uid: '{{ uid }}',
  };
}

export function persistData(key, val) {
  val = JSON.stringify(val);

//  switch () {
//    case "localStorage":
  root.localStorage.setItem(key, val);
//      break;

//    default:
//      Cookies.set(key, val, {
//        expires: root.authState.currentSettings.cookieExpiry,
//        path:    root.authState.currentSettings.cookiePath
//      });
//      break;
//  }
}
export function retrieveData(key) {
  let val = null;

//  switch (storage || root.authState.currentSettings.storage) {
//    case "localStorage":
  val = root.localStorage && root.localStorage.getItem(key);
//      break;

//    default:
//      val = Cookies.get(key);
//      break;
//  }

  // if value is a simple string, the parser will fail. in that case, simply
  // unescape the quotes and return the string.
  try {
    // return parsed json response
    return JSON.parse(val);
  } catch (err) {
    // unescape quotes
    console.log(err);
    return unescapeQuotes(val);
  }
}
function unescapeQuotes(val) {
  return val && val.replace(/("|')/g, '');
}
/**
 * Add access token as a bearer token in accordance to RFC 6750
 *
 * @param {string} accessToken
 * @param {object} headers
 * @returns {object} New extended headers object, with Authorization property
 */
function addAuthorizationHeader(accessToken, headers) {
  return Object.assign({}, headers, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export function destroySession() {
    // kill all local storage keys
  if (root.localStorage) {
    root.localStorage.removeItem('authHeaders');
  }

//    // remove from base path in case config is not specified
//    Cookies.erase(key, {
//      path: root.authState.currentSettings.cookiePath || "/"
//    });
}

export function getAuthHeaders() {
    // fetch current auth headers from storage
  let currentHeaders = retrieveData('authHeaders') || {},
    nextHeaders = {};
  // bust IE cache
  nextHeaders['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';

  // set header for each key in `tokenFormat` config
  for (const key in getTokenFormat()) {
    nextHeaders[key] = currentHeaders[key];
  }
  return addAuthorizationHeader(currentHeaders['access-token'], nextHeaders);
}

export function updateAuthHeaders(headers) {
  // check config apiUrl matches the current response url
    // set header for each key in `tokenFormat` config
  const newHeaders = {};

    // set flag to ensure that we don't accidentally nuke the headers
    // if the response tokens aren't sent back from the API
  let blankHeaders = true;

    // set header key + val for each key in `tokenFormat` config
  for (const key in getTokenFormat()) {
    newHeaders[key] = headers.get(key);

    if (newHeaders[key]) {
      blankHeaders = false;
    }
  }

    // persist headers for next request
  if (!blankHeaders) {
    persistData('authHeaders', newHeaders);
  }
}
