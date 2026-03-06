import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the entire app. Provides:
 *   user        — current user object or null
 *   loading     — true while verifying token on mount
 *   isAdmin     — shorthand boolean
 *   login()     — saves token + user, updates state
 *   logout()    — clears storage and state
 *   updateUser()— updates state after profile edit
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Hydrate from localStorage so the UI doesn't flash on refresh
    try {
      const stored = localStorage.getItem('de_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // On first mount, verify that the stored token is still valid
  useEffect(() => {
    const token = localStorage.getItem('de_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('de_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        // Token invalid — wipe everything
        localStorage.removeItem('de_token');
        localStorage.removeItem('de_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('de_token', token);
    localStorage.setItem('de_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('de_token');
    localStorage.removeItem('de_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('de_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};