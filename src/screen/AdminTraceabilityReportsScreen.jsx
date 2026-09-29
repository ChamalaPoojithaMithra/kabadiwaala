import React, { useEffect, useState } from "react";
import "./AdminTraceabilityReportsScreen.css";

function AdminTraceabilityReportsScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchTraceability();
  }, []);

  async function fetchTraceability() {
    try {
      const res = await fetch("https://kabadiwaala-1.onrender.com/api/traceability");
      if (res.ok) {
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setRecords(
            data.records.map((r) => ({
              id: r.lotId || r.id,
              collector: r.collectorId || r.collector || "COL-1001",
              recycler: r.recyclerId || r.recycler || "REC-001",
              material: r.remarks && r.remarks.includes("precious") ? "Mobile Phones" : "E-Waste Lot",
              weight: "12 kg",
              pickup: r.currentStage === "Collected" ? "Scheduled" : "Completed",
              handover: r.currentStage === "Collected" ? "Pending" : "Verified",
              payment: "Paid",
              recycling: r.currentStage || "Recycled",
              date: r.timestamp
                ? new Date(r.timestamp).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                : "Recent"
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch traceability from MongoDB:", err.message);
    }
  }

  const filteredRecords = records.filter((record) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (record.id || "").toLowerCase().includes(searchText) ||
      (record.collector || "").toLowerCase().includes(searchText) ||
      (record.recycler || "").toLowerCase().includes(searchText) ||
      (record.material || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (record.recycling || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  function handleView(record) {
    alert(
      `Traceability Record\n\n` +
        `Lot ID: ${record.id}\n` +
        `Collector ID: ${record.collector}\n` +
        `Recycler ID: ${record.recycler}\n` +
        `Material: ${record.material}\n` +
        `Weight: ${record.weight}\n` +
        `Pickup: ${record.pickup}\n` +
        `Handover: ${record.handover}\n` +
        `Payment: ${record.payment}\n` +
        `Recycling Status: ${record.recycling}\n` +
        `Date: ${record.date}`
    );
  }

  function handleReport(reportName) {
    alert(
      `${reportName}\n\nReport generation is available in the admin prototype.`
    );
  }

  return (
    <div className="admin-traceability-screen">
      <div className="admin-traceability-container">

        <div className="admin-traceability-header">

          <button
            className="admin-traceability-back"
            onClick={() => {
              if (onBack) {
                onBack();
              }
            }}
          >
            ← Back
          </button>

          <div>
            <h1>Traceability & Reports</h1>
            <p>
              Track e-waste movement and monitor platform reports
            </p>
          </div>

        </div>

        <div className="admin-traceability-info">

          <div className="admin-traceability-info-icon">
            🔗
          </div>

          <div>
            <strong>End-to-End Traceability</strong>

            <p>
              Each e-waste lot can be tracked from collector registration
              through pickup, verified handover, payment and recycling status.
            </p>
          </div>

        </div>

        <div className="admin-traceability-summary">

          <div className="admin-traceability-summary-card">
            <span>📦</span>
            <small>Tracked Lots</small>
            <strong>342</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>🚚</span>
            <small>Completed Pickups</small>
            <strong>318</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>♻️</span>
            <small>Recycled</small>
            <strong>276</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>⏳</span>
            <small>In Processing</small>
            <strong>66</strong>
          </div>

        </div>

        <div className="admin-report-section">

          <div className="admin-section-heading">
            <div>
              <h2>Reports</h2>
              <p>
                Generate operational reports for platform monitoring.
              </p>
            </div>
          </div>

          <div className="admin-report-grid">

            <button
              className="admin-report-card"
              onClick={() =>
                handleReport("E-Waste Collection Report")
              }
            >
              <span>📦</span>
              <strong>E-Waste Collection</strong>
              <small>
                Collection volume and material data
              </small>
            </button>

            <button
              className="admin-report-card"
              onClick={() =>
                handleReport("Transaction Report")
              }
            >
              <span>💳</span>
              <strong>Transaction Report</strong>
              <small>
                Completed and pending transactions
              </small>
            </button>

            <button
              className="admin-report-card"
              onClick={() =>
                handleReport("Payment Report")
              }
            >
              <span>💰</span>
              <strong>Payment Report</strong>
              <small>
                Payment status and settlement data
              </small>
            </button>

            <button
              className="admin-report-card"
              onClick={() =>
                handleReport("Recycling Report")
              }
            >
              <span>♻️</span>
              <strong>Recycling Report</strong>
              <small>
                Processing and recycling status
              </small>
            </button>

          </div>

        </div>

        <div className="admin-traceability-record-section">

          <div className="admin-section-heading">
            <div>
              <h2>Traceability Records</h2>
              <p>
                Monitor the current status of individual e-waste lots.
              </p>
            </div>
          </div>

          <div className="admin-traceability-controls">

            <div className="admin-traceability-search">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search lot, collector, recycler or material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Recycling Status
              </option>

              <option value="recycled">
                Recycled
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="awaiting">
                Awaiting
              </option>
            </select>

          </div>

          <div className="admin-traceability-table-wrapper">

            <table className="admin-traceability-table">

              <thead>
                <tr>
                  <th>Lot ID</th>
                  <th>Collector</th>
                  <th>Recycler</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Pickup</th>
                  <th>Handover</th>
                  <th>Payment</th>
                  <th>Recycling</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr key={record.id}>

                    <td>
                      <strong>{record.id}</strong>
                    </td>

                    <td>
                      {record.collector}
                    </td>

                    <td>
                      {record.recycler}
                    </td>

                    <td>
                      <div className="trace-material">
                        <span>♻️</span>
                        {record.material}
                      </div>
                    </td>

                    <td>
                      <strong>
                        {record.weight}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={
                          record.pickup === "Completed"
                            ? "trace-status trace-success"
                            : "trace-status trace-pending"
                        }
                      >
                        {record.pickup}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          record.handover === "Verified"
                            ? "trace-status trace-success"
                            : "trace-status trace-pending"
                        }
                      >
                        {record.handover}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          record.payment === "Paid"
                            ? "trace-status trace-success"
                            : "trace-status trace-pending"
                        }
                      >
                        {record.payment}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`trace-status trace-recycling-${record.recycling.toLowerCase()}`}
                      >
                        {record.recycling}
                      </span>
                    </td>

                    <td>
                      {record.date}
                    </td>

                    <td>
                      <button
                        className="trace-view-button"
                        onClick={() =>
                          handleView(record)
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredRecords.length === 0 && (
              <div className="admin-traceability-empty">
                <div>🔎</div>

                <h3>
                  No records found
                </h3>

                <p>
                  Try changing your search or recycling status filter.
                </p>
              </div>
            )}

          </div>

        </div>

        <div className="admin-chain-section">

          <h2>Traceability Chain</h2>

          <div className="admin-chain">

            <div className="admin-chain-step">
              <span>👤</span>
              <strong>Collector</strong>
              <small>Lot Created</small>
            </div>

            <div className="admin-chain-arrow">
              →
            </div>

            <div className="admin-chain-step">
              <span>📦</span>
              <strong>E-Waste Lot</strong>
              <small>Tracked</small>
            </div>

            <div className="admin-chain-arrow">
              →
            </div>

            <div className="admin-chain-step">
              <span>🚚</span>
              <strong>Pickup</strong>
              <small>Recorded</small>
            </div>

            <div className="admin-chain-arrow">
              →
            </div>

            <div className="admin-chain-step">
              <span>🔐</span>
              <strong>Handover</strong>
              <small>OTP Verified</small>
            </div>

            <div className="admin-chain-arrow">
              →
            </div>

            <div className="admin-chain-step">
              <span>♻️</span>
              <strong>Recycling</strong>
              <small>Status Updated</small>
            </div>

          </div>

        </div>

        <div className="admin-traceability-note">

          <span>ℹ️</span>

          <p>
            Traceability records provide visibility into the movement of
            e-waste. Individual collector ownership, payments and receipts
            remain separately recorded.
          </p>

        </div>

      </div>
    </div>
  );
}

export default AdminTraceabilityReportsScreen;