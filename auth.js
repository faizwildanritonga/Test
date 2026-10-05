// auth.js - sesi login sederhana (per tab/browser, pakai sessionStorage)
const KUNCI_SESI = "combisalt_session_user";

export function setSessionUser(username) {
  sessionStorage.setItem(KUNCI_SESI, username);
}

export function getSessionUser() {
  return sessionStorage.getItem(KUNCI_SESI);
}

export function clearSession() {
  sessionStorage.removeItem(KUNCI_SESI);
}
