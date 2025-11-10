// src/pages/JoinRequests/JoinRequests.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import "./JoinRequests.css";
import { useNavigate } from "react-router-dom";

const JoinRequests = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [remarks, setRemarks] = useState("");
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = user.roles?.[0]?.role_id || 5;
  const canManage = roleId <= 4;  // 1,2,3,4 have rights

  useEffect(() => {
    fetchRoles();
    if (canManage) fetchRequests();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      setRoles(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/join-requests/${user.mandapam_id}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching join requests:", err);
    }
  };

  const sendJoinRequest = async () => {
    if (!selectedRole) return alert("Please select a role");

    const payload = {
      mandapam_id: user.mandapam_id,
      requested_role_id: parseInt(selectedRole),
      remarks: remarks || null,
    };

    try {
      await API.post("/join-requests", payload);
      alert("✅ Join request sent");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Failed:", err);
      alert("Failed to send join request");
    }
  };

  const decide = async (request_id, status) => {
    try {
      await API.put(`/join-requests/${request_id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error("❌ Decision failed:", err);
    }
  };

  return (
    <div className="join-page">
      <div className="join-card">
        <h2>🙏 Join Requests</h2>

        {/* ----- ADMIN SECTION (ROLE 1-4) ----- */}
        {canManage && (
          <>
            <h3>Pending Requests</h3>

            {requests.length === 0 && <p>No pending requests</p>}

            {requests.map((r) => (
              <div key={r.request_id} className="request-row">
                <p><b>{r.user_name}</b> ({r.mobile_no})</p>
                <p>Role: {r.role_name}</p>
                <p>Status: {r.status}</p>

                {r.status === "pending" && (
                  <div className="actions">
                    <button onClick={() => decide(r.request_id, "approved")}>✅ Approve</button>
                    <button onClick={() => decide(r.request_id, "rejected")}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ----- USER SECTION (ROLE 5+) ----- */}
        {!canManage && (
          <>
            <h3>Send Join Request</h3>

            <label>Select Role</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">-- Select Role --</option>
              {roles.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.role_name}
                </option>
              ))}
            </select>

            <label>Remarks (optional)</label>
            <textarea
              placeholder="Tell something (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>

            <button onClick={sendJoinRequest}>Send Join Request</button>
          </>
        )}

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default JoinRequests;
