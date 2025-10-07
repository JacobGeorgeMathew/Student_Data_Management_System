import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check authentication
  const checkAuth = async (role) => {
    let res = undefined;
    try {
      if (role === "student") {
        res = await api.get('/student/details');
      } else if (role === "teacher") {
        res = await api.get('/teacher/details');
      } else if (role === "no") {
        console.log("Check Role!");
        const roleRes = await api.get('/check/role');
        if (roleRes.data.role === "student") {
          res = await api.get('/student/details');
        } else if (roleRes.data.role === "teacher") {
          res = await api.get('/teacher/details');
        } else {
          console.log("invalid role response from backend");
        }
      } else {
        console.log("No role or Invalid role");
      }
      if (res) {
        console.log('Auth check response:', res);
        setUser(res.data.user || res.data); // Adjust based on your API response structure
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on app load
  useEffect(() => {
    checkAuth("no");
  }, []);

  // Function to manually refresh user data (call this after login/signup)
  const refreshUser = async (role) => {
    setLoading(true);
    await checkAuth(role);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);