// MOCK LOGIN (design phase only).
// The admin account is typed below. Sellers are the accounts the admin creates on the Sellers page.
// The usernames and passwords are visible to anyone who views the site's code or browser storage,
// so this is NOT real security. Later we replace this file with Supabase Auth.

import { sellersStore } from "./adminStore";

export type Role = "admin" | "seller";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: Role;
}

// The one built-in account: the admin
const ADMIN = {
  id: "usr-admin",
  username: "qwerty",
  password: "qwerty",
  name: "Monara Admin",
};

// Where the logged-in user is remembered in the browser
const SESSION_KEY = "monara_session";

// Returns the user if the username and password match, otherwise null.
// Call this only in the browser (it reads the saved sellers).
export function checkCredentials(username: string, password: string): AuthUser | null {
  const typedName = username.trim();

  // 1. Is it the admin?
  if (typedName === ADMIN.username && password === ADMIN.password) {
    return { id: ADMIN.id, username: ADMIN.username, name: ADMIN.name, role: "admin" };
  }

  // 2. Is it one of the sellers? A disabled seller cannot log in.
  const seller = sellersStore
    .getAll()
    .find((item) => item.username === typedName && item.password === password && item.active);

  if (!seller) return null;

  // Send back the user WITHOUT the password
  return { id: seller.id, username: seller.username, name: seller.name, role: "seller" };
}

export function readSession(): AuthUser | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(user: AuthUser) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // storage is blocked: the user simply won't stay logged in
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // nothing to clear
  }
}