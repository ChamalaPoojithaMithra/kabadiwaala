import React, { useEffect, useState } from "react";
import "./CollectorManagementScreen.css";

function CollectorManagementScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCollector, setSelectedCollector] = useState(null);

  // Add Collector states
  const [showAddCollector, setShowAddCollector] = useState(false);

  const [newCollector, setNewCollector] = useState({
    collectorId: "",
    name: "",
    phone: "",
    location: "",
    verificationStatus: "Pending"
  });

  const [savingCollector, setSavingCollector] = useState(false);
  const [saveError, setSaveError] = useState("");

  // --------------------------------------------------
  // FETCH COLLECTORS FROM MONGODB
  // --------------------------------------------------

  useEffect(() => {
    fetchCollectors();
  }, []);

  async function fetchCollectors() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://kabadiwaala-1.onrender.com/api/collectors"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collectors");
      }

      const data = await response.json();

      setCollectors(data.collectors || []);

    } catch (error) {
      console.error("Error fetching collectors:", error);

      setError(
        "Unable to load collectors. Please make sure the backend server is running."
      );

    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // ADD COLLECTOR
  // --------------------------------------------------

  async function handleAddCollector(e) {
    e.preventDefault();

    try {
      setSavingCollector(true);
      setSaveError("");

      // Basic validation
      if (
        !newCollector.collectorId ||
        !newCollector.name ||
        !newCollector.phone ||
        !newCollector.location
      ) {
        setSaveError(
          "Please fill all required fields."
        );

        setSavingCollector(false);
        return;
      }

      const response = await fetch(
        "https://kabadiwaala-1.onrender.com/api/collectors",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(newCollector)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save collector"
        );
      }

      // Add newly saved collector to table
      setCollectors((prevCollectors) => [
        data.collector,
        ...prevCollectors
      ]);

      // Clear form
      setNewCollector({
        collectorId: "",
        name: "",
        phone: "",
        location: "",
        verificationStatus: "Pending"
      });

      // Close modal
      setShowAddCollector(false);

    } catch (error) {
      console.error(
        "Error adding collector:",
        error
      );

      setSaveError(error.message);

    } finally {
      setSavingCollector(false);
    }
  }

  // --------------------------------------------------
  // VIEW COLLECTOR
  // --------------------------------------------------

  function handleView(collector) {
    setSelectedCollector(collector);
  }

  // --------------------------------------------------
  // FILTER COLLECTORS
  // --------------------------------------------------

  const filteredCollectors = collectors.filter(
    (collector) => {
      const searchText = search.toLowerCase();

      const collectorStatus =
        collector.verificationStatus || "Pending";

      const matchesSearch =
        (collector.name || "")
          .toLowerCase()
          .includes(searchText) ||

        (collector.collectorId || "")
          .toLowerCase()
          .includes(searchText) ||

        (collector.phone || "")
          .includes(search) ||

        (collector.location || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        collectorStatus.toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // --------------------------------------------------
  // SUMMARY VALUES
  // --------------------------------------------------

  const totalCollectors =
    collectors.length;

  const verifiedCollectors =
    collectors.filter(
      (collector) =>
        (collector.verificationStatus || "")
          .toLowerCase() === "verified"
    ).length;

  const pendingCollectors =
    collectors.filter(
      (collector) =>
        (collector.verificationStatus || "")
          .toLowerCase() === "pending"
    ).length;

  const locationsCount =
    new Set(
      collectors.map(
        (collector) => collector.location
      )
    ).size;

  return (
    <div className="collector-management-screen">

      {/* ==================================================
          TOP NAVIGATION
      ================================================== */}

      <div className="collector-management-top">

        <button
          type="button"
          className="collector-management-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="collector-management-top-title">
          Collector Management
        </div>

      </div>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="collector-management-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="collector-management-header">

          <div className="collector-management-heading">

            <div className="collector-management-logo">
              👥
            </div>

            <div>
              <h1>
                Collector Management
              </h1>

              <p>
                View and manage registered e-waste
                collectors
              </p>
            </div>

          </div>


          <div className="collector-management-header-actions">

            {/* TOTAL */}

            <div className="collector-management-total">

              <span>
                👥
              </span>

              <div>

                <strong>
                  {totalCollectors}
                </strong>

                <small>
                  Total Collectors
                </small>

              </div>

            </div>


            {/* ADD COLLECTOR */}

            <button
              type="button"
              className="collector-add-button"
              onClick={() => {
                setShowAddCollector(true);
                setSaveError("");
              }}
            >
              + Add Collector
            </button>

          </div>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="collector-summary-grid">

          {/* TOTAL */}

          <div className="collector-summary-card">

            <div className="collector-summary-icon">
              👥
            </div>

            <div>

              <span>
                Total Collectors
              </span>

              <strong>
                {totalCollectors}
              </strong>

            </div>

          </div>


          {/* VERIFIED */}

          <div className="collector-summary-card">

            <div className="collector-summary-icon">
              ✓
            </div>

            <div>

              <span>
                Verified Collectors
              </span>

              <strong>
                {verifiedCollectors}
              </strong>

            </div>

          </div>


          {/* PENDING */}

          <div className="collector-summary-card">

            <div className="collector-summary-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending Verification
              </span>

              <strong>
                {pendingCollectors}
              </strong>

            </div>

          </div>


          {/* LOCATIONS */}

          <div className="collector-summary-card">

            <div className="collector-summary-icon">
              📍
            </div>

            <div>

              <span>
                Locations
              </span>

              <strong>
                {locationsCount}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="collector-filters">

          <div className="collector-search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name, ID, phone or location"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="collector-status-filter"
          >

            <option value="all">
              All Status
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="pending">
              Pending
            </option>

          </select>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="collector-table-card">

          <div className="collector-table-title">

            <div>

              <h2>
                Registered Collectors
              </h2>

              <p>
                {filteredCollectors.length} collectors
                displayed
              </p>

            </div>

          </div>


          <div className="collector-table-wrapper">

            {/* LOADING */}

            {loading ? (

              <div className="collector-empty">

                <div>

                  <span>
                    ⏳
                  </span>

                  <strong>
                    Loading collectors...
                  </strong>

                  <p>
                    Fetching collector data from
                    MongoDB.
                  </p>

                </div>

              </div>

            ) : error ? (

              /* ERROR */

              <div className="collector-empty">

                <div>

                  <span>
                    ⚠️
                  </span>

                  <strong>
                    Unable to load collectors
                  </strong>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    className="collector-view-button"
                    onClick={fetchCollectors}
                  >
                    Retry
                  </button>

                </div>

              </div>

            ) : (

              /* TABLE */

              <table>

                <thead>

                  <tr>

                    <th>
                      Collector ID
                    </th>

                    <th>
                      Collector
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Verification
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCollectors.length > 0 ? (

                    filteredCollectors.map(
                      (collector) => (

                        <tr
                          key={collector._id}
                        >

                          {/* ID */}

                          <td>

                            <strong className="collector-id">
                              {collector.collectorId}
                            </strong>

                          </td>


                          {/* NAME */}

                          <td>

                            <div className="collector-name-cell">

                              <div className="collector-avatar">

                                {(collector.name || "?")
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>

                              <span>
                                {collector.name}
                              </span>

                            </div>

                          </td>


                          {/* PHONE */}

                          <td>
                            {collector.phone}
                          </td>


                          {/* LOCATION */}

                          <td>
                            📍 {collector.location}
                          </td>


                          {/* VERIFICATION */}

                          <td>

                            <span
                              className={
                                (collector.verificationStatus || "")
                                  .toLowerCase() ===
                                "verified"
                                  ? "collector-status active"
                                  : "collector-status inactive"
                              }
                            >
                              {collector.verificationStatus ||
                                "Pending"}
                            </span>

                          </td>


                          {/* VIEW */}

                          <td>

                            <button
                              type="button"
                              className="collector-view-button"
                              onClick={() =>
                                handleView(
                                  collector
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        className="collector-empty"
                      >

                        <div>

                          <span>
                            🔍
                          </span>

                          <strong>
                            No collectors found
                          </strong>

                          <p>
                            Try changing your
                            search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </main>


      {/* ==================================================
          COLLECTOR DETAILS MODAL
      ================================================== */}

      {selectedCollector && (

        <div
          className="collector-details-overlay"
          onClick={() =>
            setSelectedCollector(null)
          }
        >

          <div
            className="collector-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="collector-details-header">

              <div>

                <div className="collector-details-icon">
                  👤
                </div>

                <h2>
                  Collector Details
                </h2>

                <p>
                  Registered collector information
                </p>

              </div>


              <button
                type="button"
                className="collector-details-close"
                onClick={() =>
                  setSelectedCollector(null)
                }
              >
                ×
              </button>

            </div>


            <div className="collector-details-body">

              <div className="collector-detail-item">

                <span>
                  Collector ID
                </span>

                <strong>
                  {selectedCollector.collectorId}
                </strong>

              </div>


              <div className="collector-detail-item">

                <span>
                  Name
                </span>

                <strong>
                  {selectedCollector.name}
                </strong>

              </div>


              <div className="collector-detail-item">

                <span>
                  Phone
                </span>

                <strong>
                  {selectedCollector.phone}
                </strong>

              </div>


              <div className="collector-detail-item">

                <span>
                  Location
                </span>

                <strong>
                  📍 {selectedCollector.location}
                </strong>

              </div>


              <div className="collector-detail-item">

                <span>
                  Verification Status
                </span>

                <strong
                  className={
                    (
                      selectedCollector.verificationStatus ||
                      ""
                    ).toLowerCase() === "verified"
                      ? "collector-detail-verified"
                      : "collector-detail-pending"
                  }
                >
                  {selectedCollector.verificationStatus ||
                    "Pending"}
                </strong>

              </div>


              <div className="collector-detail-item">

                <span>
                  Registered On
                </span>

                <strong>
                  {selectedCollector.createdAt
                    ? new Date(
                        selectedCollector.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>

              </div>

            </div>


            <div className="collector-details-footer">

              <button
                type="button"
                className="collector-details-close-button"
                onClick={() =>
                  setSelectedCollector(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          ADD COLLECTOR MODAL
      ================================================== */}

      {showAddCollector && (

        <div
          className="collector-add-overlay"
          onClick={() => {
            if (!savingCollector) {
              setShowAddCollector(false);
            }
          }}
        >

          <div
            className="collector-add-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="collector-add-header">

              <div>

                <div className="collector-add-icon">
                  👥
                </div>

                <h2>
                  Add New Collector
                </h2>

                <p>
                  Register a new e-waste collector
                </p>

              </div>


              <button
                type="button"
                className="collector-details-close"
                disabled={savingCollector}
                onClick={() =>
                  setShowAddCollector(false)
                }
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="collector-add-form"
              onSubmit={handleAddCollector}
            >

              {/* COLLECTOR ID */}

              <div className="collector-form-group">

                <label>
                  Collector ID
                </label>

                <input
                  type="text"
                  placeholder="Example: COL-1003"
                  value={newCollector.collectorId}
                  onChange={(e) =>
                    setNewCollector({
                      ...newCollector,
                      collectorId:
                        e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* NAME */}

              <div className="collector-form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter collector name"
                  value={newCollector.name}
                  onChange={(e) =>
                    setNewCollector({
                      ...newCollector,
                      name: e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* PHONE */}

              <div className="collector-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCollector.phone}
                  onChange={(e) =>
                    setNewCollector({
                      ...newCollector,
                      phone: e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* LOCATION */}

              <div className="collector-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Example: Vijayawada"
                  value={newCollector.location}
                  onChange={(e) =>
                    setNewCollector({
                      ...newCollector,
                      location:
                        e.target.value
                    })
                  }
                  required
                />

              </div>


              {/* VERIFICATION */}

              <div className="collector-form-group">

                <label>
                  Verification Status
                </label>

                <select
                  value={
                    newCollector.verificationStatus
                  }
                  onChange={(e) =>
                    setNewCollector({
                      ...newCollector,
                      verificationStatus:
                        e.target.value
                    })
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Verified">
                    Verified
                  </option>

                </select>

              </div>


              {/* ERROR */}

              {saveError && (

                <div className="collector-form-error">
                  ⚠️ {saveError}
                </div>

              )}


              {/* BUTTONS */}

              <div className="collector-form-actions">

                <button
                  type="button"
                  className="collector-form-cancel"
                  disabled={savingCollector}
                  onClick={() => {
                    setShowAddCollector(false);
                    setSaveError("");
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="collector-form-save"
                  disabled={savingCollector}
                >

                  {savingCollector
                    ? "Saving..."
                    : "Save Collector"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default CollectorManagementScreen;