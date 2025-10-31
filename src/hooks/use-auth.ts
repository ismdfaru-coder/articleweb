'use client';

import * as React from 'react';
import { verifyAdminCredentials } from '@/app/actions/auth';

const AUTH_KEY = 'life-reality-auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const isValid = await verifyAdminCredentials({ username, password });
      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_KEY, 'true');
        return true;
      } else {
        setError('Invalid username or password');
        setIsAuthenticated(false);
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
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error("Could not access localStorage", e);
    }
  };

  return { isAuthenticated, isLoading, login, logout, error };
}
