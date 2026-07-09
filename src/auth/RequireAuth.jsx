import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import LoadingScreen from "../components/LoadingScreen";

const RequireAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;

  return authenticated ? children : <Navigate to="/get-started" replace />;
};

export default RequireAuth;
