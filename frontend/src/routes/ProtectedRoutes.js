// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import {AuthContext } from "../context/AuthContext";


export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // role check
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}