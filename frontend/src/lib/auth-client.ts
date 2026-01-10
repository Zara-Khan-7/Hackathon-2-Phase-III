import { createAuthClient } from "better-auth/react";

// Use relative URL so it works on any domain (localhost, Vercel, etc.)
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Get JWT token for backend API calls
export const getJwtToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/token", {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.token || null;
  } catch {
    return null;
  }
};
