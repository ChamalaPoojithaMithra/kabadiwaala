import React, { useEffect, useState } from "react";
import "./AdminPickupRoutesScreen.css";

function AdminPickupRoutesScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const res = await fetch("https://kabadiwaala-1.onrender.com/api/pickup-routes");
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          setRoutes(
            data.routes.map((r, i) => ({
              id: r.routeId || r.id,
              area: r.pickupLocation ? r.pickupLocation.split(",")[0].trim() : "Vijayawada",
              collectors: 4 + (i % 5),
              ewaste: `${20 + (i * 4)} kg`,
              distance: r.distanceKm ? `${r.distanceKm} km` : "18.5 km",
              stops: 4 + (i % 5),
              time: r.estimatedTimeMinutes ? `${r.estimatedTimeMinutes} min` : "42 min",
              status: r.routeStatus === "Completed" ? "Optimized" : r.routeStatus || "Pending"
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch pickup routes from MongoDB:", err.message);
    }
  }

  const filteredRoutes = routes.filter((route) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (route.id || "").toLowerCase().includes(searchText) ||
      (route.area || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (route.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  function handleView(route) {
    alert(
      `Pickup Route\n\n` +
        `Route ID: ${route.id}\n` +
        `Area: ${route.area}\n` +
        `Collectors: ${route.collectors}\n` +
        `E-Waste: ${route.ewaste}\n` +
        `Distance: ${route.distance}\n` +
        `Stops: ${route.stops}\n` +
        `Estimated Time: ${route.time}\n` +
        `Status: ${route.status}`
    );
  }

  return (
    <div className="admin-routes-screen">

      {/* TOP NAVIGATION */}
      <div className="admin-routes-top">
        <button
          type="button"
          className="admin-routes-back"
          onClick={() => {
            if (onBack) {
              onBack();
            }
          }}
        >
          ← Back
        </button>

        <div className="admin-routes-top-title">
          Pickup Routes
        </div>
      </div>

      <main className="admin-routes-container">

        {/* HEADER */}
        <div className="admin-routes-header">

          <div className="admin-routes-heading">

            <div className="admin-routes-logo">
              🚚
            </div>

            <div>
              <h1>Pickup Routes</h1>

              <p>
                Monitor and manage optimized collection routes
              </p>
            </div>

          </div>

          <div className="admin-routes-total-box">

            <span>🚚</span>

            <div>
              <strong>24</strong>
              <small>Active Routes</small>
            </div>

          </div>

        </div>


        {/* INFORMATION */}
        <div className="admin-routes-info">

          <div className="admin-routes-info-icon">
            🚚
          </div>

          <div>
            <strong>Route Optimization</strong>

            <p>
              Pickup routes group compatible collection opportunities
              based on material, quantity, location and distance.
            </p>
          </div>

        </div>


        {/* SUMMARY */}
        <div className="admin-routes-summary">

          <div className="admin-routes-summary-card">

            <div className="admin-routes-summary-icon">
              🚚
            </div>

            <div>
              <span>Active Routes</span>
              <strong>24</strong>
            </div>

          </div>


          <div className="admin-routes-summary-card">

            <div className="admin-routes-summary-icon">
              👥
            </div>

            <div>
              <span>Collectors Served</span>
              <strong>126</strong>
            </div>

          </div>


          <div className="admin-routes-summary-card">

            <div className="admin-routes-summary-icon">
              ⚖️
            </div>

            <div>
              <span>E-Waste Planned</span>
              <strong>486 kg</strong>
            </div>

          </div>


          <div className="admin-routes-summary-card">

            <div className="admin-routes-summary-icon">
              ✓
            </div>

            <div>
              <span>Optimized Routes</span>
              <strong>19</strong>
            </div>

          </div>

        </div>


        {/* SEARCH AND FILTER */}
        <div className="admin-routes-controls">

          <div className="admin-routes-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search route or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Route Status</option>
            <option value="optimized">Optimized</option>
            <option value="pending">Pending</option>
          </select>

        </div>


        {/* ROUTES TABLE */}
        <div className="admin-routes-table-section">

          <div className="admin-section-heading">

            <div>

              <h2>Pickup Routes</h2>

              <p>
                {filteredRoutes.length} routes displayed
              </p>

            </div>

          </div>


          <div className="admin-routes-table-wrapper">

            {filteredRoutes.length > 0 ? (

              <table className="admin-routes-table">

                <thead>

                  <tr>
                    <th>Route ID</th>
                    <th>Area</th>
                    <th>Collectors</th>
                    <th>E-Waste</th>
                    <th>Distance</th>
                    <th>Stops</th>
                    <th>Est. Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {filteredRoutes.map((route) => (

                    <tr key={route.id}>

                      <td>
                        <strong className="route-id">
                          {route.id}
                        </strong>
                      </td>


                      <td>

                        <div className="route-area">

                          <span>📍</span>

                          <strong>
                            {route.area}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <div className="route-collectors">

                          <span>👥</span>

                          <strong>
                            {route.collectors}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <strong className="route-ewaste">
                          {route.ewaste}
                        </strong>

                      </td>


                      <td>
                        {route.distance}
                      </td>


                      <td>
                        {route.stops}
                      </td>


                      <td>
                        {route.time}
                      </td>


                      <td>

                        <span
                          className={
                            route.status === "Optimized"
                              ? "route-status route-optimized"
                              : "route-status route-pending"
                          }
                        >
                          {route.status}
                        </span>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="route-view-button"
                          onClick={() => handleView(route)}
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            ) : (

              <div className="admin-routes-empty">

                <div>🔎</div>

                <h3>No routes found</h3>

                <p>
                  Try changing your search or route status filter.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ROUTE PROCESS */}
        <div className="admin-route-process">

          <h2>
            Route Optimization Process
          </h2>


          <div className="admin-route-chain">

            <div className="admin-route-step">

              <span>♻️</span>

              <strong>
                Compatible Lots
              </strong>

              <small>
                Material matched
              </small>

            </div>


            <div className="admin-route-arrow">
              →
            </div>


            <div className="admin-route-step">

              <span>📦</span>

              <strong>
                Quantity
              </strong>

              <small>
                Minimum checked
              </small>

            </div>


            <div className="admin-route-arrow">
              →
            </div>


            <div className="admin-route-step">

              <span>📍</span>

              <strong>
                Location
              </strong>

              <small>
                Distance calculated
              </small>

            </div>


            <div className="admin-route-arrow">
              →
            </div>


            <div className="admin-route-step">

              <span>🗺️</span>

              <strong>
                Route
              </strong>

              <small>
                Stops grouped
              </small>

            </div>


            <div className="admin-route-arrow">
              →
            </div>


            <div className="admin-route-step">

              <span>🚚</span>

              <strong>
                Pickup
              </strong>

              <small>
                Route ready
              </small>

            </div>

          </div>

        </div>


        {/* BOTTOM NOTE */}
        <div className="admin-routes-note">

          <span>ℹ️</span>

          <p>
            Route optimization groups nearby compatible pickup
            opportunities. Each collector's e-waste ownership,
            transaction and payment records remain separate.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AdminPickupRoutesScreen;