// src/pages/Donations/Donations.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import "./Donations.css";
import { useNavigate } from "react-router-dom";

const Donations = () => {
  const [mandapamQR, setMandapamQR] = useState("");
  const [base64QR, setBase64QR] = useState(""); // converted QR base64
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userRoleId = user.roles?.[0]?.role_id || 5;
  const canEditQR = userRoleId <= 4;

  useEffect(() => {
    fetchMandapamQR();
  }, []);

  const fetchMandapamQR = async () => {
    try {
      const res = await API.get(`/mandapamqr/${user.mandapam_id}`);
      if (res.data?.qr) setMandapamQR(res.data.qr);
    } catch (err) {
      console.error("Error fetching QR:", err);
    }
  };

  // FILE → BASE64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // result = data:image/png;base64,xxxxx
      let encoded = reader.result.split("base64,")[1]; // remove prefix
      setBase64QR(encoded);
      console.log("📌 QR base64 ready:", encoded.substring(0, 60) + "...");
    };
    reader.readAsDataURL(file);
  };

  const updateQR = async () => {
    if (!base64QR) return alert("Please select an image first");

    try {
      setLoading(true);
      await API.put(`/mandapamqr/${user.mandapam_id}`, { qr: base64QR });
      alert("QR updated ✅");
      setBase64QR("");
      fetchMandapamQR();
    } catch (err) {
      console.error("QR update failed:", err);
      alert("Update QR failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donations-page">
      <div className="donations-container">
        <div className="header">
          <h2>📲 Donation QR</h2>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back
          </button>
        </div>

        {mandapamQR ? (
          <div className="qr-section">
            <h3>Scan to Donate</h3>
            <img
              src={`data:image/png;base64,${mandapamQR}`}
              alt="Mandapam QR"
              className="qr-image"
            />
          </div>
        ) : (
          <p>No QR Uploaded Yet</p>
        )}

        {canEditQR && (
          <div className="update-qr-form">
            <h3>Upload QR Image</h3>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button className="continue-btn" onClick={updateQR} disabled={loading}>
              {loading ? "Updating..." : "Update QR"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
