import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // We check for a valid session by trying to fetch profile/user info on load
  // If the backend had a /me endpoint, we'd use it here. Since there isn't one clearly defined for just fetching current user,
  // we might just trust the cookie for now until an API call fails with 401, or add a persistent state.
  useEffect(() => {
    // Check local storage for basic user info to restore state (the cookie handles the actual auth token)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Call backend logout endpoint if exists, but we can also just clear frontend state 
    // Usually there's a backend endpoint to clear the HttpOnly cookie.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
