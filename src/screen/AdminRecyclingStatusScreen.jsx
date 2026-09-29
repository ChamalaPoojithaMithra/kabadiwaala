import React, { useEffect, useState } from "react";
import "./AdminTraceabilityReportsScreen.css";

function AdminRecyclingStatusScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecyclingStatus();
  }, []);

  async function fetchRecyclingStatus() {
    try {
      setLoading(true);
      const res = await fetch("https://kabadiwaala-1.onrender.com/api/recycling-status");
      if (res.ok) {
        const data = await res.json();
        if (data.recyclingStatus && data.recyclingStatus.length > 0) {
          setRecords(
            data.recyclingStatus.map((s) => ({
              id: s.lotId || s.id,
              statusId: s.statusId,
              transaction: s.transactionId || "TXN-001",
              recycler: s.recyclerId || "REC-001",
              material: s.material || "E-Waste",
              status: s.currentStatus || "Received",
              percentage: s.percentageCompleted || 0,
              location: s.processingLocation || "Vijayawada Recycling Plant",
              remarks: s.remarks || "Processing smoothly",
              updated: s.updatedAt
                ? new Date(s.updatedAt).toLocaleDateString("en-IN", {
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
      console.warn("Failed to fetch recycling status from MongoDB:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = records.filter((r) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      (r.id || "").toLowerCase().includes(searchText) ||
      (r.material || "").toLowerCase().includes(searchText) ||
      (r.recycler || "").toLowerCase().includes(searchText) ||
      (r.location || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (r.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  function handleView(record) {
    alert(
      `Recycling Status Details\n\n` +
        `Lot ID: ${record.id}\n` +
        `Status ID: ${record.statusId}\n` +
        `Recycler: ${record.recycler}\n` +
        `Material: ${record.material}\n` +
        `Current Status: ${record.status}\n` +
        `Progress: ${record.percentage}%\n` +
        `Location: ${record.location}\n` +
        `Remarks: ${record.remarks}\n` +
        `Last Updated: ${record.updated}`
    );
  }

  const recycledCount = records.filter((r) => r.status === "Recycled" || r.status === "Completed").length;
  const processingCount = records.filter((r) => r.status === "Processing" || r.status === "Sorting" || r.status === "Dismantling").length;

  return (
    <div className="admin-traceability-screen">
      <div className="admin-traceability-container">

        {/* HEADER */}
        <div className="admin-traceability-header">
          <button
            type="button"
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
            <h1>Recycling Status</h1>
            <p>Track e-waste recycling progress and material recovery stages</p>
          </div>
        </div>

        {/* INFO BANNER */}
        <div className="admin-traceability-info">
          <div className="admin-traceability-info-icon">♻️</div>
          <div>
            <strong>Material Processing & Recovery</strong>
            <p>
              Monitor each lot through Sorting, Dismantling, Material Recovery, Processing, and Recycled completion stages.
            </p>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="admin-traceability-summary">
          <div className="admin-traceability-summary-card">
            <span>📦</span>
            <small>Active Lots</small>
            <strong>{records.length}</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>⚙️</span>
            <small>In Processing</small>
            <strong>{processingCount}</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>✓</span>
            <small>Fully Recycled</small>
            <strong>{recycledCount}</strong>
          </div>

          <div className="admin-traceability-summary-card">
            <span>🏭</span>
            <small>Recovery Facilities</small>
            <strong>5</strong>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="admin-traceability-controls">
          <input
            type="text"
            placeholder="Search by lot ID, recycler, material, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-traceability-search"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-traceability-select"
          >
            <option value="all">All Stages</option>
            <option value="received">Received</option>
            <option value="sorting">Sorting</option>
            <option value="dismantling">Dismantling</option>
            <option value="processing">Processing</option>
            <option value="recycled">Recycled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="admin-traceability-table-wrapper">
          <table className="admin-traceability-table">
            <thead>
              <tr>
                <th>Lot ID</th>
                <th>Recycler</th>
                <th>Material</th>
                <th>Progress</th>
                <th>Processing Facility</th>
                <th>Stage Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>{item.recycler}</td>
                    <td>{item.material}</td>
                    <td>
                      <span style={{ fontWeight: "700", color: item.percentage === 100 ? "#25b95f" : "#ffb703" }}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`traceability-badge status-${item.status.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.updated}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-traceability-view"
                        onClick={() => handleView(item)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="admin-traceability-empty">
                    {loading ? "Loading recycling records from MongoDB..." : "No recycling records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminRecyclingStatusScreen;
