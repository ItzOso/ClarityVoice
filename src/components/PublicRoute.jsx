import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
