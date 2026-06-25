import { Navigate} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
 const { user } = useContext(AuthContext);

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔒 Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;