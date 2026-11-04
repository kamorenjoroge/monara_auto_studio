// MOCK LOGIN (design phase only).
// The usernames and passwords below are visible to anyone who views the site's code,
// so this is NOT real security. Later we replace this file with Supabase Auth.

export type Role = "admin" | "seller";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: Role;
}

interface MockUser extends AuthUser {
  password: string;
}

// The accounts that can log in for now.
// Later the admin will create seller accounts from the dashboard.
const MOCK_USERS: MockUser[] = [
  {
    id: "usr-admin",
    username: "qwerty",
    password: "qwerty",
    name: "Monara Admin",
    role: "admin",
  },
  {
    // A temporary test seller, so we can see the seller view. We'll remove it later.
    id: "usr-seller-demo",
    username: "seller",
    password: "seller123",
    name: "Demo Seller",
    role: "seller",
  },
];

// Where the logged-in user is remembered in the browser
const SESSION_KEY = "monara_session";

// Returns the user if the username and password match, otherwise null
export function checkCredentials(username: string, password: string): AuthUser | null {
  const found = MOCK_USERS.find(
    (user) => user.username === username.trim() && user.password === password,
  );
  if (!found) return null;

  // Send back the user WITHOUT the password
  return { id: found.id, username: found.username, name: found.name, role: found.role };
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