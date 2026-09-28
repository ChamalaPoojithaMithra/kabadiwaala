import React, { useEffect, useState } from "react";
import "./AvailableEWasteLotsScreen.css";

function AvailableEWasteLotsScreen({
  language,
  onBack,
  onViewLot,
}) {
  const content = {
    en: {
      title: "Available E-Waste Lots",
      subtitle: "E-waste lots available from verified collectors",
      back: "Back",
      viewLot: "View Lot",

      material: "Material",
      quantity: "Quantity",
      location: "Location",

      allMaterials: "All Materials",
      allQuantities: "All Quantities",
      allLocations: "All Locations",

      mobile: "Mobile Phones",
      laptop: "Laptops",
      computer: "Computer Parts",
      tv: "TV / Monitors",

      small: "Small (< 10 kg)",
      medium: "Medium (10–20 kg)",
      large: "Large (> 20 kg)",

      kg: "kg",

      location1: "Vijayawada",
      location2: "Guntur",
      location3: "Nuzvid",

      posted: "Posted recently",
      expectedValue: "Expected value",
      noLots: "No e-waste lots match your filters.",
    },

    te: {
      title: "అందుబాటులో ఉన్న ఈ-వేస్ట్ లాట్లు",
      subtitle: "ధృవీకరించబడిన కలెక్టర్ల నుండి ఈ-వేస్ట్ లాట్లు",
      back: "వెనుకకు",
      viewLot: "లాట్ చూడండి",

      material: "మెటీరియల్",
      quantity: "పరిమాణం",
      location: "ప్రాంతం",

      allMaterials: "అన్ని మెటీరియల్స్",
      allQuantities: "అన్ని పరిమాణాలు",
      allLocations: "అన్ని ప్రాంతాలు",

      mobile: "మొబైల్ ఫోన్లు",
      laptop: "ల్యాప్‌టాప్‌లు",
      computer: "కంప్యూటర్ భాగాలు",
      tv: "టీవీ / మానిటర్లు",

      small: "చిన్నది (< 10 కిలోలు)",
      medium: "మధ్యస్థం (10–20 కిలోలు)",
      large: "పెద్దది (> 20 కిలోలు)",

      kg: "కిలోలు",

      location1: "విజయవాడ",
      location2: "గుంటూరు",
      location3: "నూజివీడు",

      posted: "ఇటీవల పోస్ట్ చేయబడింది",
      expectedValue: "అంచనా విలువ",
      noLots: "మీ ఫిల్టర్‌లకు సరిపోయే ఈ-వేస్ట్ లాట్లు లేవు.",
    },

    hi: {
      title: "उपलब्ध ई-वेस्ट लॉट",
      subtitle: "सत्यापित कलेक्टरों से उपलब्ध ई-वेस्ट",
      back: "वापस",
      viewLot: "लॉट देखें",

      material: "सामग्री",
      quantity: "मात्रा",
      location: "स्थान",

      allMaterials: "सभी सामग्री",
      allQuantities: "सभी मात्रा",
      allLocations: "सभी स्थान",

      mobile: "मोबाइल फोन",
      laptop: "लैपटॉप",
      computer: "कंप्यूटर पार्ट्स",
      tv: "टीवी / मॉनिटर",

      small: "छोटा (< 10 किलो)",
      medium: "मध्यम (10–20 किलो)",
      large: "बड़ा (> 20 किलो)",

      kg: "किलो",

      location1: "विजयवाड़ा",
      location2: "गुंटूर",
      location3: "नुज़विद",

      posted: "हाल ही में पोस्ट किया गया",
      expectedValue: "अनुमानित मूल्य",
      noLots: "आपके फ़िल्टर से मेल खाने वाले ई-वेस्ट लॉट नहीं हैं।",
    },

    mr: {
      title: "उपलब्ध ई-वेस्ट लॉट",
      subtitle: "सत्यापित कलेक्टरकडून उपलब्ध ई-वेस्ट",
      back: "मागे",
      viewLot: "लॉट पहा",

      material: "साहित्य",
      quantity: "प्रमाण",
      location: "स्थान",

      allMaterials: "सर्व साहित्य",
      allQuantities: "सर्व प्रमाण",
      allLocations: "सर्व स्थान",

      mobile: "मोबाईल फोन",
      laptop: "लॅपटॉप",
      computer: "कॉम्प्युटर पार्ट्स",
      tv: "टीव्ही / मॉनिटर्स",

      small: "लहान (< 10 किलो)",
      medium: "मध्यम (10–20 किलो)",
      large: "मोठे (> 20 किलो)",

      kg: "किलो",

      location1: "विजयवाडा",
      location2: "गुंटूर",
      location3: "नुझविद",

      posted: "अलीकडे पोस्ट केले",
      expectedValue: "अपेक्षित मूल्य",
      noLots: "तुमच्या फिल्टरशी जुळणारे ई-वेस्ट लॉट उपलब्ध नाहीत.",
    },
  };

  const t = content[language] || content.en;

  // --------------------------------------------------
  // FILTER STATES
  // --------------------------------------------------

  const [materialFilter, setMaterialFilter] = useState("all");
  const [quantityFilter, setQuantityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // --------------------------------------------------
  // VOICE GUIDANCE
  // --------------------------------------------------

  useEffect(() => {
    const message = new SpeechSynthesisUtterance(
      `${t.title}. ${t.subtitle}`
    );

    const voiceMap = {
      en: "en-IN",
      te: "te-IN",
      hi: "hi-IN",
      mr: "mr-IN",
    };

    message.lang = voiceMap[language] || "en-IN";
    message.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(message);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [language, t.title, t.subtitle]);

  // --------------------------------------------------
  // AVAILABLE E-WASTE LOTS (FROM MONGODB)
  // --------------------------------------------------

  const [lots, setLots] = useState([]);

  useEffect(() => {
    fetchAvailableLots();
  }, [language]);

  async function fetchAvailableLots() {
    try {
      const res = await fetch("http://https://kabadiwala-1.onrender.com/api/e-waste-lots");
      if (res.ok) {
        const data = await res.json();
        if (data.lots && data.lots.length > 0) {
          const iconMap = {
            "Mobile Phones": "📱",
            "Mobile Phone": "📱",
            "Laptops": "💻",
            "Laptop": "💻",
            "Computer Parts": "🖥️",
            "TV / Monitors": "📺",
            "TV / Monitor": "📺",
            "Batteries": "🔋",
            "Battery": "🔋",
            "Cables": "🔌"
          };

          const availableOnly = data.lots.filter(
            (l) => !l.status || l.status === "Available" || l.status === "Active"
          );

          const listToUse = availableOnly.length > 0 ? availableOnly : data.lots;

          setLots(
            listToUse.map((l, idx) => ({
              id: l.lotId || idx + 1,
              lotId: l.lotId,
              collectorId: l.collectorId,
              icon: iconMap[l.material] || "♻️",
              material: l.material,
              weight: String(l.weight || 1),
              location: l.location || "Vijayawada",
              price: l.estimatedValue
                ? `₹${l.estimatedValue.toLocaleString("en-IN")}`
                : `₹${(Number(l.weight) || 1) * 420}`,
              status: l.status,
              rawLot: l
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch lots from MongoDB:", err.message);
    }
  }

  // --------------------------------------------------
  // FILTER LOTS
  // --------------------------------------------------

  const filteredLots = lots.filter((lot) => {
    const materialMatch =
      materialFilter === "all" ||
      lot.material === materialFilter;

    const quantityMatch =
      quantityFilter === "all" ||
      (quantityFilter === "small" &&
        Number(lot.weight) < 10) ||
      (quantityFilter === "medium" &&
        Number(lot.weight) >= 10 &&
        Number(lot.weight) <= 20) ||
      (quantityFilter === "large" &&
        Number(lot.weight) > 20);

    const locationMatch =
      locationFilter === "all" ||
      lot.location === locationFilter;

    return (
      materialMatch &&
      quantityMatch &&
      locationMatch
    );
  });

  // --------------------------------------------------
  // VIEW LOT
  // --------------------------------------------------

  function handleViewLot(lot) {
    window.speechSynthesis.cancel();

    if (onViewLot) {
      onViewLot(lot);
    }
  }

  // --------------------------------------------------
  // RETURN UI
  // --------------------------------------------------

  return (
    <div className="available-lots-screen">

      <div className="available-lots-card">

        {/* BACK BUTTON */}

        <button
          className="available-lots-back"
          onClick={() => {
            window.speechSynthesis.cancel();

            if (onBack) {
              onBack();
            }
          }}
        >
          ← {t.back}
        </button>

        {/* HEADER */}

        <div className="available-lots-header">

          <div className="available-lots-icon">
            📦
          </div>

          <div>
            <h1>{t.title}</h1>

            <p>
              {t.subtitle}
            </p>
          </div>

        </div>

        {/* FILTER SECTION */}

        <div className="available-lots-filters">

          {/* MATERIAL FILTER */}

          <div className="filter-group">

            <label>
              {t.material}
            </label>

            <select
              value={materialFilter}
              onChange={(event) => {
                setMaterialFilter(event.target.value);
              }}
            >
              <option value="all">
                {t.allMaterials}
              </option>

              <option value={t.mobile}>
                {t.mobile}
              </option>

              <option value={t.laptop}>
                {t.laptop}
              </option>

              <option value={t.computer}>
                {t.computer}
              </option>

              <option value={t.tv}>
                {t.tv}
              </option>
            </select>

          </div>

          {/* QUANTITY FILTER */}

          <div className="filter-group">

            <label>
              {t.quantity}
            </label>

            <select
              value={quantityFilter}
              onChange={(event) => {
                setQuantityFilter(event.target.value);
              }}
            >
              <option value="all">
                {t.allQuantities}
              </option>

              <option value="small">
                {t.small}
              </option>

              <option value="medium">
                {t.medium}
              </option>

              <option value="large">
                {t.large}
              </option>
            </select>

          </div>

          {/* LOCATION FILTER */}

          <div className="filter-group">

            <label>
              {t.location}
            </label>

            <select
              value={locationFilter}
              onChange={(event) => {
                setLocationFilter(event.target.value);
              }}
            >
              <option value="all">
                {t.allLocations}
              </option>

              <option value={t.location1}>
                {t.location1}
              </option>

              <option value={t.location2}>
                {t.location2}
              </option>

              <option value={t.location3}>
                {t.location3}
              </option>
            </select>

          </div>

        </div>

        {/* LOT LIST */}

        <div className="available-lots-list">

          {filteredLots.length === 0 ? (

            <div className="no-lots-message">

              <div className="no-lots-icon">
                📦
              </div>

              <p>
                {t.noLots}
              </p>

            </div>

          ) : (

            filteredLots.map((lot) => (

              <div
                className="available-lot-card"
                key={lot.id}
              >

                {/* LOT ICON */}

                <div className="lot-icon">
                  {lot.icon}
                </div>

                {/* LOT INFORMATION */}

                <div className="lot-information">

                  <h2>
                    {lot.material}
                  </h2>

                  <div className="lot-details">

                    <span>
                      ⚖️ {lot.weight} {t.kg}
                    </span>

                    <span>
                      📍 {lot.location}
                    </span>

                  </div>

                  <div className="lot-price">

                    {t.expectedValue}:{" "}

                    <strong>
                      {lot.price}
                    </strong>

                  </div>

                  <small>
                    🕒 {t.posted}
                  </small>

                </div>

                {/* VIEW LOT BUTTON */}

                <button
                  className="view-lot-button"
                  onClick={() => {
                    handleViewLot(lot);
                  }}
                >
                  {t.viewLot}
                  <span>→</span>
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default AvailableEWasteLotsScreen;