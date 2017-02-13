const localStorage = global.window.localStorage;

export function getToken() {
  return localStorage.token;
}

export function setToken(token) {
  localStorage.token = token;
}
