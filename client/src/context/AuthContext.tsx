import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { User, Practice } from '../types';

interface AuthContextValue {
  user: User | null;
  practice: Practice | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (practiceName: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshPractice: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [practice, setPractice] = useState<Practice | null>(null);

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        doLogout();
      } else {
        refreshPractice();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshPractice() {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setPractice(data.practice);
    } catch {
      // 401 interceptor handles token removal
    }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPractice(data.practice);
  }

  async function register(practiceName: string, name: string, email: string, password: string) {
    const { data } = await api.post('/auth/register', { practiceName, name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPractice(data.practice);
  }

  function doLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setPractice(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        practice,
        token,
        login,
        register,
        logout: doLogout,
        refreshPractice,
        isAuthenticated: !!token && !isTokenExpired(token ?? ''),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
