import React, { useEffect, useState } from "react";
import "./RecyclerVerificationScreen.css";

function RecyclerVerificationScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecyclers();
  }, []);

  async function fetchRecyclers() {
    try {
      setLoading(true);
      const res = await fetch("http://https://kabadiwala-1.onrender.com/api/recyclers");
      if (res.ok) {
        const data = await res.json();
        if (data.recyclers && data.recyclers.length > 0) {
          setRecyclers(
            data.recyclers.map((r) => ({
              id: r.recyclerId || r.id,
              name: r.companyName ? `${r.name} (${r.companyName})` : r.name,
              phone: r.phone,
              location: r.location,
              license: r.license || `LIC-${r.recyclerId}`,
              status: r.verificationStatus || "Pending"
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch recyclers from MongoDB:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecyclers = recyclers.filter((recycler) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (recycler.name || "").toLowerCase().includes(searchText) ||
      (recycler.id || "").toLowerCase().includes(searchText) ||
      (recycler.location || "").toLowerCase().includes(searchText) ||
      (recycler.license || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (recycler.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  async function updateStatus(id, newStatus) {
    // Optimistic UI update
    setRecyclers((previous) =>
      previous.map((recycler) =>
        recycler.id === id ? { ...recycler, status: newStatus } : recycler
      )
    );

    try {
      await fetch(`http://https://kabadiwala-1.onrender.com/api/recyclers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: newStatus })
      });
    } catch (err) {
      console.warn("Error updating recycler status in MongoDB:", err.message);
    }
  }

  function handleView(recycler) {
    alert(
      `Recycler Details\n\n` +
        `ID: ${recycler.id}\n` +
        `Name: ${recycler.name}\n` +
        `Phone: ${recycler.phone}\n` +
        `Location: ${recycler.location}\n` +
        `License: ${recycler.license}\n` +
        `Status: ${recycler.status}`
    );
  }

  return (
    <div className="recycler-verification-screen">

      {/* Top Navigation */}
      <div className="recycler-verification-top">

        <button
          type="button"
          className="recycler-verification-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="recycler-verification-top-title">
          Recycler Verification
        </div>

      </div>

      <main className="recycler-verification-container">

        {/* Header */}
        <div className="recycler-verification-header">

          <div className="recycler-verification-heading">

            <div className="recycler-verification-logo">
              ♻️
            </div>

            <div>
              <h1>Recycler Verification</h1>

              <p>
                Review and manage recycler registration and verification
              </p>
            </div>

          </div>

          <div className="recycler-total-box">

            <span>♻️</span>

            <div>
              <strong>86</strong>
              <small>Verified Recyclers</small>
            </div>

          </div>

        </div>

        {/* Summary Cards */}
        <div className="recycler-summary-grid">

          <div className="recycler-summary-card">

            <div className="recycler-summary-icon">
              ♻️
            </div>

            <div>
              <span>Total Recyclers</span>
              <strong>94</strong>
            </div>

          </div>

          <div className="recycler-summary-card">

            <div className="recycler-summary-icon">
              ✓
            </div>

            <div>
              <span>Verified</span>
              <strong>86</strong>
            </div>

          </div>

          <div className="recycler-summary-card">

            <div className="recycler-summary-icon">
              ⏳
            </div>

            <div>
              <span>Pending Review</span>
              <strong>5</strong>
            </div>

          </div>

          <div className="recycler-summary-card">

            <div className="recycler-summary-icon">
              ✕
            </div>

            <div>
              <span>Rejected</span>
              <strong>3</strong>
            </div>

          </div>

        </div>

        {/* Filters */}
        <div className="recycler-filters">

          <div className="recycler-search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by recycler, ID, location or license"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <select
            className="recycler-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

        </div>

        {/* Table */}
        <div className="recycler-table-card">

          <div className="recycler-table-heading">

            <div>
              <h2>Registered Recyclers</h2>

              <p>
                {filteredRecyclers.length} recyclers displayed
              </p>
            </div>

          </div>

          <div className="recycler-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Recycler ID</th>
                  <th>Recycler</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>License</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecyclers.length > 0 ? (

                  filteredRecyclers.map((recycler) => (

                    <tr key={recycler.id}>

                      <td>
                        <strong className="recycler-id">
                          {recycler.id}
                        </strong>
                      </td>

                      <td>
                        <div className="recycler-name-cell">

                          <div className="recycler-avatar">
                            {recycler.name.charAt(0)}
                          </div>

                          <span>{recycler.name}</span>

                        </div>
                      </td>

                      <td>
                        {recycler.phone}
                      </td>

                      <td>
                        <span className="recycler-location">
                          📍 {recycler.location}
                        </span>
                      </td>

                      <td>
                        <strong className="recycler-license">
                          {recycler.license}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={`recycler-status ${recycler.status.toLowerCase()}`}
                        >
                          {recycler.status}
                        </span>

                      </td>

                      <td>

                        <div className="recycler-actions">

                          <button
                            type="button"
                            className="recycler-view-button"
                            onClick={() => handleView(recycler)}
                          >
                            View
                          </button>

                          {recycler.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                className="recycler-approve-button"
                                onClick={() =>
                                  updateStatus(
                                    recycler.id,
                                    "Verified"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                className="recycler-reject-button"
                                onClick={() =>
                                  updateStatus(
                                    recycler.id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="recycler-empty"
                    >

                      <div>
                        <span>🔍</span>

                        <strong>
                          No recyclers found
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

      </main>

    </div>
  );
}

export default RecyclerVerificationScreen;