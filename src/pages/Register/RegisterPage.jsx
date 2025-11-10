import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const API_BASE = "https://ganesh-mandapam-api.onrender.com/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [registerAs, setRegisterAs] = useState(""); // user | mandapam
  const [formData, setFormData] = useState({});
  const [nearbyMandapams, setNearbyMandapams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [manualMandapam, setManualMandapam] = useState(false);

  console.log("🔄 Component Rendered");
  console.log("registerAs =>", registerAs);
  console.log("formData =>", formData);

  const getNearbyMandapams = async () => {
    console.log("📍 Fetching nearby mandapams...");
    try {
      setError("");
      setManualMandapam(false);
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = pos.coords;
      console.log("📌 User Lat/Lng:", latitude, longitude);

      const res = await axios.get(`${API_BASE}/users/nearby-mandapams`, {
        params: { lat: latitude, lng: longitude },
      });

      console.log("🌐 Nearby mandapams API response:", res.data);

      if (res.data && res.data.length > 0) {
        setNearbyMandapams(res.data);
      } else {
        setNearbyMandapams([]);
        setManualMandapam(true);
        setError("No mandapams found nearby. Enter Mandapam ID manually.");
      }
    } catch (e) {
      console.log("❌ Nearby mandapams error:", e);
      setError("Unable to fetch mandapams. Please allow location access.");
      setManualMandapam(true);
    }
  };

  const getLocationForMandapam = () => {
    console.log("📍 Getting location for mandapam registration...");
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("✅ Location captured:", pos.coords);
      setFormData({
        ...formData,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Submit clicked...");
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let payload = {};
      let endpoint = "";

      const loggedUser = JSON.parse(localStorage.getItem("user"));
      console.log("👤 Logged User:", loggedUser);

      if (registerAs === "mandapam") {
        endpoint = `${API_BASE}/mandapam`;
        payload = {
          mandapam_name: formData.mandapam_name,
          address: formData.address || null,
          city: formData.city || null,
          district: formData.district || null,
          state: formData.state || null,
          contact_number: formData.mobile_no || null,
          latitude: formData.latitude,
          longitude: formData.longitude,
          created_by: loggedUser?.user_id || null,
        };
      } else if (registerAs === "user") {
        endpoint = `${API_BASE}/users/register`;
        payload = {
          register_as: "user",
          full_name: formData.full_name,
          mobile_no: formData.mobile_no,
          email: formData.email || null,
          password: formData.password,
          mandapam_id: formData.mandapam_id ? Number(formData.mandapam_id) : null,
        };
      }

      console.log("📤 Final Payload to API:", payload);
      console.log("🌍 Endpoint:", endpoint);

      const res = await axios.post(endpoint, payload);

      console.log("✅ API Success Response:", res.data);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.log("❌ API Error Response:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔁 registerAs changed to:", registerAs);
    setFormData({});
    setNearbyMandapams([]);
    setError("");
    setSuccess("");
    setManualMandapam(false);
  }, [registerAs]);

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>

        <div className="reg-type">
          <button className={registerAs === "user" ? "active" : ""} onClick={() => setRegisterAs("user")} style={{ color: "black" }}>Register as User</button>
          <button className={registerAs === "mandapam" ? "active" : ""} onClick={() => setRegisterAs("mandapam")} style={{ color: "black" }}>Register as Mandapam</button>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {registerAs === "" ? (
          <p style={{ textAlign: "center", color: "#555" }}>Please choose registration type to continue.</p>
        ) : (
          <form onSubmit={handleSubmit} className="reg-form">

            <label>Full Name</label>
            <input type="text" placeholder="Full Name" required style={{ color: 'black' }}
              value={formData.full_name || ""}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />

            <label>Mobile Number</label>
            <input type="tel" placeholder="Mobile Number" required style={{ color: 'black' }}
              value={formData.mobile_no || ""}
              onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
            />

            <label>Email</label>
            <input type="email" placeholder="Email (optional)" style={{ color: 'black' }}
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <label>Password</label>
            <input type="password" placeholder="Password" required style={{ color: 'black' }}
              value={formData.password || ""}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {registerAs === "mandapam" && (
              <>
                <label>Mandapam Name</label>
                <input type="text" placeholder="Mandapam Name" required style={{ color: 'black' }}
                  value={formData.mandapam_name || ""}
                  onChange={(e) => setFormData({ ...formData, mandapam_name: e.target.value })}
                />

                <label>Address</label>
                <input type="text" placeholder="Address" style={{ color: 'black' }}
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />

                <button type="button" onClick={getLocationForMandapam}>
                  Get My Location
                </button>

                {formData.latitude && formData.longitude && (
                  <div className="alert success">Location captured ✅</div>
                )}
              </>
            )}

            {registerAs === "user" && (
              <div className="mandapam-select">
                <label>Select Mandapam</label>
                <button type="button" onClick={getNearbyMandapams}>
                  Find Nearby Mandapams
                </button>

                {nearbyMandapams.length > 0 && !manualMandapam ? (
                  <select
                    value={formData.mandapam_id || ""}
                    onChange={(e) => setFormData({ ...formData, mandapam_id: e.target.value })}
                  >
                    <option value="">-- Select Mandapam --</option>
                    {nearbyMandapams.map((m) => (
                      <option key={m.mandapam_id} value={m.mandapam_id}>
                        {m.mandapam_name} ({m.distance_km?.toFixed(2)} km)
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <p className="note">Enter Mandapam ID manually.</p>
                    <input
                      type="number"
                      placeholder="Enter Mandapam ID"
                      style={{ color: 'black' }}
                      value={formData.mandapam_id || ""}
                      onChange={(e) => setFormData({ ...formData, mandapam_id: e.target.value })}
                      required
                    />
                  </>
                )}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="link" onClick={() => navigate("/login")}>
              Already have an account? Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
