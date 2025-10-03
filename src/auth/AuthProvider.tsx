import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, User } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: Uint8Array;
  firstname: string;
  lastname: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isActive: boolean;
  on_vacation: boolean;
  exp: number;
}

const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const logoutTimerRef = useRef<number | undefined>(undefined);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = undefined;
    }
  }, []);

  const logout = useCallback(() => {
    clearLogoutTimer();
    setUser(null);
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  }, [clearLogoutTimer, navigate]);

  const scheduleAutoLogout = useCallback((token: string) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      logout();
      return;
    }

    const timeoutDuration = decoded.exp * 1000 - Date.now();
    if (timeoutDuration <= 0) {
      logout();
      return;
    }

    clearLogoutTimer();
    logoutTimerRef.current = window.setTimeout(logout, timeoutDuration);
  }, [clearLogoutTimer, logout]);

  useEffect(() => {
    const storedUserRaw = localStorage.getItem('user');

    if (!storedUserRaw) {
      setIsAuthReady(true);
      return;
    }

    try {
      const storedUser: User = JSON.parse(storedUserRaw);
      if (!storedUser?.token) {
        throw new Error('Missing token');
      }

      const decoded = decodeToken(storedUser.token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      setUser(storedUser);
      setIsLoggedIn(true);
      scheduleAutoLogout(storedUser.token);
    } catch {
      logout();
    } finally {
      setIsAuthReady(true);
    }
  }, [logout, scheduleAutoLogout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${URL}authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    const info = decodeToken(data.token);

    if (!info) {
      throw new Error('Invalid token received');
    }

    const loggedInUser: User = {
      id: info.id,
      firstName: info.firstname,
      lastName: info.lastname,
      email: info.email,
      subjects: data.user_subjects,
      schedule: data.user_schedule,
      role: info.role,
      isActive: info.isActive,
      isOnVacation: info.on_vacation,
      token: data.token,
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setIsLoggedIn(true);
    scheduleAutoLogout(data.token);

    const roleRoutes: Record<TokenPayload['role'], string> = {
      STUDENT: '/student-home',
      TEACHER: '/teacher-home',
      ADMIN: '/admin-home',
    };

    navigate(roleRoutes[info.role]);
  }, [URL, navigate, scheduleAutoLogout]);

  const updateUser = (newUserData: Partial<User>) => {
    if (!user) {
      return;
    }

    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    if (newUserData.token) {
      scheduleAutoLogout(newUserData.token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAuthReady, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
