import React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("👤 User:", user);

  // roles are inside user
  const roles = user.roles || [];
  console.log("🎭 roles:", roles);

  // get first role
  const firstRole = roles[0]?.role_name?.toLowerCase() || "user";
  console.log("🧩 role name:", firstRole);

  // what are admin roles
  const adminRoles = ["president", "vice president", "treasurer", "secretary", "admin"];

  const isMandapamAdmin = adminRoles.includes(firstRole);

  const logout = () => {
    console.log("🚪 Logout");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <Typography variant="h4" className="welcome-title">
          Welcome, {user.full_name || "User"} 🙏
        </Typography>

        <Typography variant="body1" className="welcome-subtitle">
          {isMandapamAdmin ? "Mandapam Admin Dashboard" : "User Dashboard"}
        </Typography>

        <div className="dashboard-grid">
          {/* Common */}
          <Button variant="contained" onClick={() => navigate("/events")} className="dashboard-btn">
            📅 Events
          </Button>

          <Button variant="contained" color="success" onClick={() => navigate("/donations")} className="dashboard-btn">
            💰 Donations
          </Button>

          <Button variant="contained" color="warning" onClick={() => navigate("/join-requests")} className="dashboard-btn">
            🤝 Join Requests
          </Button>

          {/* Admin */}
          {isMandapamAdmin && (
            <>
              <Button variant="contained" color="secondary" onClick={() => navigate("/expenses")} className="dashboard-btn">
                🧾 Expenses
              </Button>

              <Button variant="contained" color="info" onClick={() => navigate("/event-images")} className="dashboard-btn">
                📷 Event Images
              </Button>
            </>
          )}

          <Button variant="outlined" color="error" className="dashboard-btn logout-btn" onClick={logout}>
            🚪 Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
