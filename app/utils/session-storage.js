import { SESSION_EXPIRES_AT_KEY } from 'themes/config';
const { localStorage } = global.window;

export function get(key) {
  return localStorage.getItem(key);
}

export function set(key, value) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

// The session expiry shared across tabs. Deliberately not in AUTH_KEYS: it is
// not sent as a header, and clearAuthValues must not be the only thing that
// removes it, since teardown needs to remove it explicitly so other tabs see
// the storage event.
export function readSessionExpiry() {
  const value = get(SESSION_EXPIRES_AT_KEY);
  return value ? parseInt(value, 10) : null;
}

// Stored as a string, since localStorage holds strings only. Writing null
// removes the key, which is itself the teardown signal other tabs act on.
export function storeSessionExpiry(expiresAt) {
  set(SESSION_EXPIRES_AT_KEY, expiresAt === null ? null : String(expiresAt));
}
