import React, { useEffect, useState } from "react";
import "./AdminPriceDemandScreen.css";

function AdminPriceDemandScreen({ onBack }) {
  const [search, setSearch] = useState("");
  const [demandFilter, setDemandFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    fetchPriceDemand();
  }, []);

  async function fetchPriceDemand() {
    try {
      const res = await fetch("https://://kabadiwala-1.onrender.com/api/price-demand");
      if (res.ok) {
        const data = await res.json();
        if (data.priceDemand && data.priceDemand.length > 0) {
          setPriceData(
            data.priceDemand.map((item, index) => ({
              id: item.priceDemandId || item.id,
              material: item.material,
              price: item.pricePerKg || item.price,
              unit: "kg",
              location: ["Vijayawada", "Guntur", "Nuzvid", "Eluru"][index % 4],
              demand: item.demandLevel || item.demand || "Medium",
              source: item.source || "Prototype Reference Market Data (Demo)",
              updated: item.lastUpdated
                ? new Date(item.lastUpdated).toLocaleDateString("en-IN", {
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
      console.warn("Failed to fetch price demand from MongoDB:", err.message);
    }
  }

  const filteredData = priceData.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (item.id || "").toLowerCase().includes(searchText) ||
      (item.material || "").toLowerCase().includes(searchText) ||
      (item.location || "").toLowerCase().includes(searchText);

    const matchesDemand =
      demandFilter === "all" ||
      (item.demand || "").toLowerCase() === demandFilter.toLowerCase();

    const matchesLocation =
      locationFilter === "all" ||
      (item.location || "").toLowerCase() === locationFilter.toLowerCase();

    return matchesSearch && matchesDemand && matchesLocation;
  });

  function handleView(item) {
    alert(
      `Price & Demand Details\n\n` +
        `Record ID: ${item.id}\n` +
        `Material: ${item.material}\n` +
        `Reference Price: ₹${item.price}/${item.unit}\n` +
        `Location: ${item.location}\n` +
        `Demand: ${item.demand}\n` +
        `Source: ${item.source}\n` +
        `Updated: ${item.updated}\n\n` +
        `Note: Reference price is informational. Final recycler offers may differ.`
    );
  }

  return (
    <div className="admin-price-demand-screen">

      {/* TOP NAVIGATION */}
      <div className="admin-price-demand-top">

        <button
          type="button"
          className="admin-price-demand-back"
          onClick={() => {
            if (onBack) {
              onBack();
            }
          }}
        >
          ← Back
        </button>

        <div className="admin-price-demand-top-title">
          Price & Demand
        </div>

      </div>


      <main className="admin-price-demand-container">

        {/* HEADER */}
        <div className="admin-price-demand-header">

          <div className="admin-price-demand-heading">

            <div className="admin-price-demand-logo">
              💰
            </div>

            <div>
              <h1>Price & Demand Data</h1>

              <p>
                Monitor reference prices and e-waste demand across locations
              </p>
            </div>

          </div>


          <div className="admin-price-demand-total-box">

            <span>💰</span>

            <div>
              <strong>42</strong>
              <small>Price Records</small>
            </div>

          </div>

        </div>


        {/* INFORMATION */}
        <div className="admin-price-demand-info">

          <div className="admin-price-demand-info-icon">
            💰
          </div>

          <div>

            <strong>
              Reference Price Information
            </strong>

            <p>
              These values are reference prices for market awareness.
              Final recycler offers may vary based on material condition,
              quantity, location and recycler terms.
            </p>

          </div>

        </div>


        {/* SUMMARY CARDS */}
        <div className="admin-price-demand-summary">

          <div className="admin-price-demand-summary-card">

            <div className="admin-price-demand-summary-icon">
              💰
            </div>

            <div>
              <span>Price Records</span>
              <strong>42</strong>
            </div>

          </div>


          <div className="admin-price-demand-summary-card">

            <div className="admin-price-demand-summary-icon">
              📈
            </div>

            <div>
              <span>High Demand</span>
              <strong>18</strong>
            </div>

          </div>


          <div className="admin-price-demand-summary-card">

            <div className="admin-price-demand-summary-icon">
              📊
            </div>

            <div>
              <span>Medium Demand</span>
              <strong>16</strong>
            </div>

          </div>


          <div className="admin-price-demand-summary-card">

            <div className="admin-price-demand-summary-icon">
              📉
            </div>

            <div>
              <span>Low Demand</span>
              <strong>8</strong>
            </div>

          </div>

        </div>


        {/* SEARCH + FILTERS */}
        <div className="admin-price-demand-controls">

          <div className="admin-price-demand-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search material, location or record..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <select
            value={demandFilter}
            onChange={(e) => setDemandFilter(e.target.value)}
          >
            <option value="all">All Demand</option>
            <option value="high">High Demand</option>
            <option value="medium">Medium Demand</option>
            <option value="low">Low Demand</option>
          </select>


          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="vijayawada">Vijayawada</option>
            <option value="guntur">Guntur</option>
            <option value="nuzvid">Nuzvid</option>
            <option value="eluru">Eluru</option>
          </select>

        </div>


        {/* LARGE TABLE CARD */}
        <div className="admin-price-demand-table-section">

          <div className="admin-price-demand-table-heading">

            <div>
              <h2>Price & Demand Records</h2>

              <p>
                {filteredData.length} records displayed
              </p>
            </div>

          </div>


          <div className="admin-price-demand-table-wrapper">

            {filteredData.length > 0 ? (

              <table className="admin-price-demand-table">

                <thead>

                  <tr>
                    <th>Record ID</th>
                    <th>Material</th>
                    <th>Reference Price</th>
                    <th>Location</th>
                    <th>Demand</th>
                    <th>Source</th>
                    <th>Updated</th>
                    <th>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {filteredData.map((item) => (

                    <tr key={item.id}>

                      <td>
                        <strong className="price-record-id">
                          {item.id}
                        </strong>
                      </td>


                      <td>

                        <div className="price-material">

                          <span>♻️</span>

                          <strong>
                            {item.material}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <strong className="reference-price">
                          ₹{item.price}/{item.unit}
                        </strong>

                      </td>


                      <td>

                        <span className="price-location">
                          📍 {item.location}
                        </span>

                      </td>


                      <td>

                        <span
                          className={`demand-badge demand-${item.demand.toLowerCase()}`}
                        >
                          {item.demand}
                        </span>

                      </td>


                      <td>

                        <span className="price-source">
                          {item.source}
                        </span>

                      </td>


                      <td>
                        {item.updated}
                      </td>


                      <td>

                        <button
                          type="button"
                          className="price-view-button"
                          onClick={() => handleView(item)}
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            ) : (

              <div className="admin-price-demand-empty">

                <div>🔎</div>

                <h3>
                  No records found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* FOOTER */}
        <div className="admin-price-demand-footer">

          <div>
            <span>📌</span>

            <strong>
              Price discovery
            </strong>
          </div>

          <p>
            Reference prices help collectors understand approximate market
            value before comparing actual recycler offers.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AdminPriceDemandScreen;