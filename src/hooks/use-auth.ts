'use client';

import * as React from 'react';
import { verifyAdminCredentials } from '@/app/actions/auth';

const AUTH_KEY = 'life-reality-auth';

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = React.useState<AuthState>({ isAuthenticated: false, username: null });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // This effect now only runs once to set the initial loading state.
    // It no longer tries to authenticate from localStorage, which was causing issues.
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await verifyAdminCredentials({ username, password });
      if (isValid) {
        setAuthState({ isAuthenticated: true, username });
        try {
          localStorage.setItem(AUTH_KEY, JSON.stringify({ username }));
        } catch (e) {
          console.error("Could not access localStorage", e);
        }
        return true;
      } else {
        setError('Invalid username or password');
        setAuthState({ isAuthenticated: false, username: null });
        return false;
      }
    } catch (e) {
      setError('An error occurred during login.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, username: null });
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error("Could not access localStorage", e);
    }
  };

  return { isAuthenticated: authState.isAuthenticated, isLoading, login, logout, error };
}
