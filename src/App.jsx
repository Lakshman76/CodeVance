import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Documentaions from "./pages/Documentaions";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./auth/RequireAuth";

function App() {
  const location = useLocation();
  const hideNavbar = ["/dashboard"];
  const isNavbarHide = hideNavbar.some((path) =>
    location.pathname.startsWith(path)
  );
  return (
    <>
      {!isNavbarHide && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Documentaions />} />
        <Route path="/get-started" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
