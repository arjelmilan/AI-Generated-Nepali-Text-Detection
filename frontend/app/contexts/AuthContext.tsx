'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getMe, loginUser, registerUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('nepdetect_token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to authenticate token', error);
          localStorage.removeItem('nepdetect_token');
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    localStorage.setItem('nepdetect_token', res.access_token);
    const userData = await getMe();
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const res = await registerUser(email, password);
    localStorage.setItem('nepdetect_token', res.access_token);
    const userData = await getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('nepdetect_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
