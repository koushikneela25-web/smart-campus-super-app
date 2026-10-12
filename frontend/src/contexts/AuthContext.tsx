import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (payload: { fullName: string; email: string; collegeId: string; password: string; role: string; phoneNumber?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smart_campus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smart_campus_access_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('smart_campus_access_token');
      if (storedToken) {
        try {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
          localStorage.setItem('smart_campus_user', JSON.stringify(currentUser));
        } catch {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('smart_campus_access_token');
          localStorage.removeItem('smart_campus_refresh_token');
          localStorage.removeItem('smart_campus_user');
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    const res = await authApi.login(identifier, password);
    localStorage.setItem('smart_campus_access_token', res.accessToken);
    localStorage.setItem('smart_campus_refresh_token', res.refreshToken);
    localStorage.setItem('smart_campus_user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: { fullName: string; email: string; collegeId: string; password: string; role: string; phoneNumber?: string }): Promise<User> => {
    const res = await authApi.register(payload);
    localStorage.setItem('smart_campus_access_token', res.accessToken);
    localStorage.setItem('smart_campus_refresh_token', res.refreshToken);
    localStorage.setItem('smart_campus_user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      localStorage.setItem('smart_campus_user', JSON.stringify(currentUser));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
