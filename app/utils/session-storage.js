const localStorage = global.window.localStorage;

export function get(key) {
  return localStorage.getItem(key);
}

export function set(key, value) {
  localStorage.setItem(key, value);
}
