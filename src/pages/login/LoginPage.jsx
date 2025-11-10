import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import bglogin from "../../assets/bglogin.png";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔐 Attempting login:", { mobile, password });

    try {
      const res = await axios.post(
        "https://ganesh-mandapam-api.onrender.com/api/users/login",
        { mobile_no: mobile, password }
      );

      console.log("✅ Login API Response:", res.data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("roles", JSON.stringify(res.data.roles)); // 👈 STORE ROLES

        console.log("💾 Stored in LocalStorage:", {
          token: res.data.token,
          user: res.data.user,
          roles: res.data.roles
        });

        navigate("/dashboard");
      } else {
        setError("Unexpected server response");
      }
    } catch (err) {
      console.log("❌ Login ERROR:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bglogin})` }}>
      <div className="login-container">
        <h2 className="login-title">Ganesh Mandapam Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link" onClick={() => navigate("/register")}>
          Don’t have an account? <span>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
