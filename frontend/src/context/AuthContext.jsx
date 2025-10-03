import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check authentication
  const checkAuth = async () => {
    try {
      // Change this endpoint to match your backend API
      // It should be the endpoint that returns current user details
      const res = await api.get('/studDetails'); // or '/studDetails' if that's correct
      console.log('Auth check response:', res);
      setUser(res.data.user || res.data); // Adjust based on your API response structure
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to manually refresh user data (call this after login/signup)
  const refreshUser = async () => {
    setLoading(true);
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);