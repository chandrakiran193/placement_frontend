import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuthResponse } from '../types';
import { authApi } from '../api/endpoints';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  register: (userData: any) => Promise<AuthResponse>;
  logout: () => void;
  isStudent: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  updateUserContext: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.token);
        localStorage.setItem('token', authData.token);

        const userData: User = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role as Role,
          phone: authData.phone,
          enabled: true,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return authData;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.token);
        localStorage.setItem('token', authData.token);

        const userObj: User = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role as Role,
          phone: authData.phone,
          enabled: true,
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return authData;
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUserContext = (updated: User) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isRecruiter = user?.role === 'ROLE_RECRUITER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        isStudent,
        isRecruiter,
        isAdmin,
        updateUserContext,
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
