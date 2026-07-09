import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Documentaions from "./pages/Documentaions";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./auth/RequireAuth";
import GuestOnly from "./auth/GuestOnly";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/docs" element={<Documentaions />} />

      <Route
        path="/get-started"
        element={
          <GuestOnly>
            <AuthPage />
          </GuestOnly>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;