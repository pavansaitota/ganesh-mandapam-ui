import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import "./Expenses.css";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExp, setNewExp] = useState({
    expense_name: "",
    amount: "",
    expense_details: "",
    expense_date: "",
    payment_mode: "",
    paid_to: ""
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // extract real role
  const role_name = user.roles?.[0]?.role_name || "User";
  const role_id = user.roles?.[0]?.role_id || 5;

  const isAdmin = role_id <= 4; // PRESIDENT / VICE / TREASURER / SECRETARY ONLY

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses?mandapam_id=${user.mandapam_id}`);
      setExpenses(res.data || []);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const createExpense = async () => {
    if (!newExp.expense_name || !newExp.amount) {
      alert("Please fill Name & Amount");
      return;
    }
    try {
      const payload = {
        mandapam_id: user.mandapam_id,
        expense_name: newExp.expense_name,
        expense_details: newExp.expense_details,
        amount: newExp.amount,
        payment_mode: newExp.payment_mode,
        paid_to: newExp.paid_to
      };
      await API.post("/expenses", payload);
      setNewExp({ expense_name: "", amount: "", expense_details: "", expense_date: "", payment_mode: "", paid_to: "" });
      fetchExpenses();
    } catch (err) {
      console.error("❌ Create error:", err);
    }
  };

  const approveExpense = async (id, status) => {
    try {
      await API.put(`/expenses/${id}`, { status });
      fetchExpenses();
    } catch (err) {
      console.error("❌ Approve failed:", err);
    }
  };

  return (
    <div className="exp-page">
      <div className="exp-card">
        <div className="top-bar">
          <h2>🧾 Mandapam Expenses</h2>
          <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
        </div>

        {/* only ADMIN roles 1-4 */}
        {isAdmin && (
          <div className="form">
            <input placeholder="Expense Title"
              value={newExp.expense_name}
              onChange={(e) => setNewExp({ ...newExp, expense_name: e.target.value })} />

            <input type="number" placeholder="Amount"
              value={newExp.amount}
              onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })} />

            <input placeholder="Paid To"
              value={newExp.paid_to}
              onChange={(e) => setNewExp({ ...newExp, paid_to: e.target.value })} />

            <input placeholder="Payment Mode (Cash/UPI)"
              value={newExp.payment_mode}
              onChange={(e) => setNewExp({ ...newExp, payment_mode: e.target.value })} />

            <textarea placeholder="Details"
              value={newExp.expense_details}
              onChange={(e) => setNewExp({ ...newExp, expense_details: e.target.value })}></textarea>

            <button className="add-btn" onClick={createExpense}>➕ Add Expense</button>
          </div>
        )}

        <table className="exp-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Mode</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr key={e.expense_id}>
                <td>{e.expense_name}</td>
                <td>₹{e.amount}</td>
                <td>{e.paid_to || "-"}</td>
                <td>{e.payment_mode || "-"}</td>
                <td>{e.status}</td>

                {isAdmin && (
                  <td>
                    {e.status === "pending" && (
                      <>
                        <button onClick={() => approveExpense(e.expense_id, "approved")} className="ok">✅</button>
                        <button onClick={() => approveExpense(e.expense_id, "rejected")} className="no">❌</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Expenses;
