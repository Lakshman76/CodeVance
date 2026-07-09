import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import LoadingScreen from "../components/LoadingScreen";

const GuestOnly = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return authenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
};

export default GuestOnly;