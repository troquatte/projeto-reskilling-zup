'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useEffect, useState } from 'react';

// interface
import { User } from '../typings/User';

// Mocks
import { MOCK_USER } from '../mocks/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: ({ email, password }: { email: string; password: string }) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storeLocalstorate = '@itau-store/user';
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem(storeLocalstorate);
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = ({ email, password }: { email: string; password: string }) => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      setUser(MOCK_USER);
      localStorage.setItem(storeLocalstorate, JSON.stringify(MOCK_USER));
      router.push('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(storeLocalstorate);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;

    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem(storeLocalstorate, JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
