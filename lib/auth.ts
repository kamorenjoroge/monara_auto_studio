// The shapes used by the login system.
// The mock login (typed passwords, saved in the browser) is gone: Supabase Auth now checks the
// email and password, and the `profiles` table says who the person is and what role they have.

export type Role = "admin" | "seller";

export interface AuthUser {
  id: string; // the same id as in Supabase Auth and in the profiles table
  email: string;
  name: string;
  role: Role;
}