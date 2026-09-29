import React, { useEffect, useState } from "react";
import "./AdminEWasteLotsScreen.css";

function AdminEWasteLotsScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lots, setLots] = useState([]);

  useEffect(() => {
    fetchLots();
  }, []);

  async function fetchLots() {
    try {
      const res = await fetch("https://kabadiwala-1.onrender.com/api/e-waste-lots");
      if (res.ok) {
        const data = await res.json();
        if (data.lots && data.lots.length > 0) {
          setLots(
            data.lots.map((l) => ({
              id: l.lotId || l.id,
              collector: l.collectorId || l.collector || "COL-1001",
              material: l.material,
              weight: typeof l.weight === "number" ? `${l.weight} kg` : l.weight,
              location: l.location || "Vijayawada",
              status: l.status || "Available",
              date: l.createdAt
                ? new Date(l.createdAt).toLocaleDateString("en-IN", {
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
      console.warn("Failed to fetch e-waste lots from MongoDB:", err.message);
    }
  }

  const filteredLots = lots.filter((lot) => {
    const matchesSearch =
      (lot.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (lot.collector || "").toLowerCase().includes(search.toLowerCase()) ||
      (lot.material || "").toLowerCase().includes(search.toLowerCase()) ||
      (lot.location || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (lot.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  function handleView(lot) {
    alert(
      `E-Waste Lot Details\n\n` +
        `Lot ID: ${lot.id}\n` +
        `Collector ID: ${lot.collector}\n` +
        `Material: ${lot.material}\n` +
        `Weight: ${lot.weight}\n` +
        `Location: ${lot.location}\n` +
        `Status: ${lot.status}\n` +
        `Created: ${lot.date}`
    );
  }

  return (
    <div className="admin-ewaste-lots-screen">
      <div className="admin-ewaste-lots-container">

        {/* HEADER */}

        <div className="admin-ewaste-lots-header">

          <div>
            <button
              className="admin-ewaste-lots-back"
              onClick={onBack}
            >
              ← Back
            </button>

            <h1>E-Waste Lots</h1>

            <p>
              Monitor registered e-waste lots across the platform
            </p>
          </div>

          <div className="admin-ewaste-total-box">
            <span>📦</span>

            <div>
              <strong>342</strong>
              <small>Active Lots</small>
            </div>
          </div>

        </div>

        {/* SUMMARY */}

        <div className="admin-ewaste-summary-grid">

          <div className="admin-ewaste-summary-card">
            <div className="admin-ewaste-summary-icon">📦</div>

            <div>
              <span>Total Lots</span>
              <strong>1,842</strong>
            </div>
          </div>

          <div className="admin-ewaste-summary-card">
            <div className="admin-ewaste-summary-icon">🟢</div>

            <div>
              <span>Active</span>
              <strong>342</strong>
            </div>
          </div>

          <div className="admin-ewaste-summary-card">
            <div className="admin-ewaste-summary-icon">💰</div>

            <div>
              <span>Offers Received</span>
              <strong>128</strong>
            </div>
          </div>

          <div className="admin-ewaste-summary-card">
            <div className="admin-ewaste-summary-icon">✓</div>

            <div>
              <span>Sold Lots</span>
              <strong>1,372</strong>
            </div>
          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="admin-ewaste-filters">

          <div className="admin-ewaste-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by Lot ID, collector, material or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="offer received">Offer Received</option>
            <option value="sold">Sold</option>
          </select>

        </div>

        {/* TABLE */}

        <div className="admin-ewaste-table-card">

          <div className="admin-ewaste-table-heading">

            <div>
              <h2>Registered E-Waste Lots</h2>

              <p>
                {filteredLots.length} lots displayed
              </p>
            </div>

          </div>

          <div className="admin-ewaste-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Lot ID</th>
                  <th>Collector ID</th>
                  <th>Material</th>
                  <th>Weight</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredLots.length > 0 ? (

                  filteredLots.map((lot) => (

                    <tr key={lot.id}>

                      <td>
                        <strong className="admin-ewaste-lot-id">
                          {lot.id}
                        </strong>
                      </td>

                      <td>
                        <strong className="admin-ewaste-collector-id">
                          {lot.collector}
                        </strong>
                      </td>

                      <td>
                        <div className="admin-ewaste-material">
                          <span>♻️</span>
                          {lot.material}
                        </div>
                      </td>

                      <td>
                        <strong>{lot.weight}</strong>
                      </td>

                      <td>
                        📍 {lot.location}
                      </td>

                      <td>{lot.date}</td>

                      <td>

                        <span
                          className={`admin-ewaste-status ${lot.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {lot.status}
                        </span>

                      </td>

                      <td>

                        <button
                          className="admin-ewaste-view-button"
                          onClick={() => handleView(lot)}
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-ewaste-empty"
                    >

                      <div>

                        <span>🔍</span>

                        <strong>
                          No e-waste lots found
                        </strong>

                        <p>
                          Try changing your search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminEWasteLotsScreen;