import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

// Main Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// othermodules
import Events from "./pages/Events/Events";
import Donations from "./pages/Donations/Donations";
import Expenses from "./pages/Expenses/Expenses";
import JoinRequests from "./pages/JoinRequests/JoinRequests";
import EventImages from "./pages/EventImages/EventImages";

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Dashboard Sub Routes */}
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <PrivateRoute>
              <Donations />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/join-requests"
          element={
            <PrivateRoute>
              <JoinRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/event-images"
          element={
            <PrivateRoute>
              <EventImages />
            </PrivateRoute>
          }
        />

        {/* Catch-All Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
