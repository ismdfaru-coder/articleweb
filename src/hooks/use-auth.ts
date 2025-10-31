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
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        const { username } = JSON.parse(storedAuth);
        if (username) {
            setAuthState({ isAuthenticated: true, username });
        }
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
    } finally {
        setIsLoading(false);
    }
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
        setIsLoading(false);
        return true;
      } else {
        setError('Invalid username or password');
        setAuthState({ isAuthenticated: false, username: null });
        try {
          localStorage.removeItem(AUTH_KEY);
        } catch (e) {
          console.error("Could not access localStorage", e);
        }
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      console.error("Login verification failed", e);
      setError('An error occurred during login.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, username: null });
    try {
      localStorage.removeItem(AUTH_KEY);
      // Also reload to ensure all state is cleared
      window.location.href = '/login';
    } catch (e) {
      console.error("Could not access localStorage", e);
    }
  };

  return { isAuthenticated: authState.isAuthenticated, isLoading, login, logout, error, username: authState.username };
}
