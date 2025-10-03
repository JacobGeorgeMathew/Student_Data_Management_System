import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>; // Show loader until auth check is done

  if (!user) {
    navigate("/",{replace: true});
  }; // Redirect to login

  return children; // If logged in, show the page
};

export default ProtectedRoute;
