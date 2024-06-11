// src/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getGoogleAuthUrl: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('accessToken'));
  const { login: authLogin, logout: authLogout, refresh: authRefresh, getGoogleAuthUrl } = useAuth();
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    await authLogin(username, password);
    setIsAuthenticated(true);
    navigate('/travelPlans');
  };

  const logout = async () => {
    await authLogout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    try {
      await authRefresh(refreshToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed', error);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const checkTokenExpiration = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = tokenPayload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    if (exp < now) {
      refreshToken();
    }
  }, [refreshToken]);

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, refreshToken, getGoogleAuthUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
