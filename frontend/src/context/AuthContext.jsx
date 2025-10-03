import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Stores user data
  const [loading, setLoading] = useState(true); // For initial auth check

  // Run on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/studDetails');
        console.log(res);
        setUser(res.data.user); // Example: {id, username, role}
      } catch (err) {
        setUser(null); // Token invalid or expired
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
