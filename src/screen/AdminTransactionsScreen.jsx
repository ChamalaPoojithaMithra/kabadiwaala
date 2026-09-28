import React, { useEffect, useState } from "react";
import "./AdminTransactionsScreen.css";

function AdminTransactionsScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch("http://https://kabadiwala-1.onrender.com/api/transactions");
      if (res.ok) {
        const data = await res.json();
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(
            data.transactions.map((t) => ({
              id: t.transactionId || t.id,
              collector: t.collectorId || t.collector || "COL-1001",
              recycler: t.recyclerId || t.recycler || "REC-001",
              material: t.material,
              weight: typeof t.weight === "number" ? `${t.weight} kg` : t.weight,
              amount:
                typeof t.totalAmount === "number"
                  ? `₹${t.totalAmount.toLocaleString("en-IN")}`
                  : t.amount,
              date: t.transactionDate
                ? new Date(t.transactionDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                : "Recent",
              status: t.status || "Completed",
              payment: t.paymentStatus || "Pending"
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch transactions from MongoDB:", err.message);
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (transaction.id || "").toLowerCase().includes(searchText) ||
      (transaction.collector || "").toLowerCase().includes(searchText) ||
      (transaction.recycler || "").toLowerCase().includes(searchText) ||
      (transaction.material || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (transaction.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      (transaction.payment || "")
        .toLowerCase()
        .replace(" ", "-") === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  function handleView(transaction) {
    alert(
      `Transaction Details\n\n` +
        `Transaction ID: ${transaction.id}\n` +
        `Collector ID: ${transaction.collector}\n` +
        `Recycler: ${transaction.recycler}\n` +
        `Material: ${transaction.material}\n` +
        `Weight: ${transaction.weight}\n` +
        `Amount: ${transaction.amount}\n` +
        `Date: ${transaction.date}\n` +
        `Transaction Status: ${transaction.status}\n` +
        `Payment Status: ${transaction.payment}`
    );
  }

  return (
    <div className="admin-transactions-screen">

      {/* TOP NAVIGATION */}
      <div className="admin-transactions-top">

        <button
          type="button"
          className="admin-transactions-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="admin-transactions-top-title">
          Transactions
        </div>

      </div>

      <main className="admin-transactions-container">

        {/* HEADER */}
        <div className="admin-transactions-header">

          <div className="admin-transactions-heading">

            <div className="admin-transactions-logo">
              🔄
            </div>

            <div>
              <h1>Transactions</h1>

              <p>
                Monitor e-waste transactions and payment activity
              </p>
            </div>

          </div>

          <div className="admin-transactions-total-box">

            <span>🔄</span>

            <div>
              <strong>4,920</strong>
              <small>Total Transactions</small>
            </div>

          </div>

        </div>

        {/* SUMMARY */}
        <div className="admin-transactions-summary-grid">

          <div className="admin-transactions-summary-card">

            <div className="admin-transactions-summary-icon">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>4,720</strong>
            </div>

          </div>

          <div className="admin-transactions-summary-card">

            <div className="admin-transactions-summary-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>182</strong>
            </div>

          </div>

          <div className="admin-transactions-summary-card">

            <div className="admin-transactions-summary-icon">
              💰
            </div>

            <div>
              <span>Total Value</span>
              <strong>₹18.6L</strong>
            </div>

          </div>

          <div className="admin-transactions-summary-card">

            <div className="admin-transactions-summary-icon">
              💳
            </div>

            <div>
              <span>Pending Payments</span>
              <strong>18</strong>
            </div>

          </div>

        </div>

        {/* FILTERS */}
        <div className="admin-transactions-filters">

          <div className="admin-transactions-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search transaction, collector, recycler or material"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            className="admin-transactions-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="completed">Completed</option>
            <option value="pickup">Pickup</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="admin-transactions-payment-filter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="not-paid">Not Paid</option>
          </select>

        </div>

        {/* TABLE */}
        <div className="admin-transactions-table-card">

          <div className="admin-transactions-table-heading">

            <div>
              <h2>Transaction Records</h2>

              <p>
                {filteredTransactions.length} transactions displayed
              </p>
            </div>

          </div>

          <div className="admin-transactions-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Collector</th>
                  <th>Recycler</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredTransactions.length > 0 ? (

                  filteredTransactions.map((transaction) => (

                    <tr key={transaction.id}>

                      <td>
                        <strong className="admin-transaction-id">
                          {transaction.id}
                        </strong>
                      </td>

                      <td>
                        <strong className="admin-collector-id">
                          {transaction.collector}
                        </strong>
                      </td>

                      <td>
                        {transaction.recycler}
                      </td>

                      <td>
                        <div className="admin-transaction-material">
                          <span>♻️</span>
                          {transaction.material}
                        </div>
                      </td>

                      <td>
                        <strong>
                          {transaction.weight}
                        </strong>
                      </td>

                      <td>
                        <strong className="admin-transaction-amount">
                          {transaction.amount}
                        </strong>
                      </td>

                      <td>
                        {transaction.date}
                      </td>

                      <td>
                        <span
                          className={`admin-transaction-status ${transaction.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-payment-status ${transaction.payment
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {transaction.payment}
                        </span>
                      </td>

                      <td>

                        <button
                          type="button"
                          className="admin-transaction-view-button"
                          onClick={() => handleView(transaction)}
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      className="admin-transactions-empty"
                    >

                      <div>

                        <span>🔍</span>

                        <strong>
                          No transactions found
                        </strong>

                        <p>
                          Try changing your search or filters.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminTransactionsScreen;