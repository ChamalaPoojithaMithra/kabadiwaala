import React, { useEffect } from "react";
import "./MyEWasteScreen.css";

function MyEWasteScreen({ language, onBack }) {
  const translations = {
    en: {
      title: "My E-Waste",
      subtitle: "See your e-waste lots and their status",
      listen: "Listen",
      back: "Back",

      active: "ACTIVE LOTS",
      completed: "COMPLETED",
      total: "TOTAL LOTS",

      lot1: "LOT-2026-0001",
      material1: "Battery",
      weight1: "3 kg",
      status1: "Transaction Completed",

      lot2: "LOT-2026-0002",
      material2: "Mobile Phone",
      weight2: "5 kg",
      status2: "Offer Accepted",

      lot3: "LOT-2026-0003",
      material3: "Computer Parts",
      weight3: "7 kg",
      status3: "Waiting for Offers",

      view: "VIEW LOT",
      safeTitle: "Your e-waste records are safe",
      safeText:
        "Each lot has a unique ID so you can track your e-waste journey."
    },

    te: {
      title: "నా ఈ-వేస్ట్",
      subtitle: "మీ ఈ-వేస్ట్ లాట్లు మరియు వాటి స్థితిని చూడండి",
      listen: "వినండి",
      back: "వెనుకకు",

      active: "యాక్టివ్ లాట్లు",
      completed: "పూర్తయినవి",
      total: "మొత్తం లాట్లు",

      lot1: "LOT-2026-0001",
      material1: "బ్యాటరీ",
      weight1: "3 kg",
      status1: "లావాదేవీ పూర్తయింది",

      lot2: "LOT-2026-0002",
      material2: "మొబైల్ ఫోన్",
      weight2: "5 kg",
      status2: "ఆఫర్ అంగీకరించబడింది",

      lot3: "LOT-2026-0003",
      material3: "కంప్యూటర్ భాగాలు",
      weight3: "7 kg",
      status3: "ఆఫర్ల కోసం వేచి ఉంది",

      view: "లాట్ చూడండి",
      safeTitle: "మీ ఈ-వేస్ట్ రికార్డులు సురక్షితం",
      safeText:
        "ప్రతి లాట్‌కు ప్రత్యేక ID ఉంటుంది. దాంతో మీ ఈ-వేస్ట్ ప్రయాణాన్ని ట్రాక్ చేయవచ్చు."
    },

    hi: {
      title: "मेरा ई-वेस्ट",
      subtitle: "अपने ई-वेस्ट लॉट और उनकी स्थिति देखें",
      listen: "सुनें",
      back: "वापस",

      active: "सक्रिय लॉट",
      completed: "पूरे हुए",
      total: "कुल लॉट",

      lot1: "LOT-2026-0001",
      material1: "बैटरी",
      weight1: "3 kg",
      status1: "लेन-देन पूरा हुआ",

      lot2: "LOT-2026-0002",
      material2: "मोबाइल फोन",
      weight2: "5 kg",
      status2: "ऑफर स्वीकार किया गया",

      lot3: "LOT-2026-0003",
      material3: "कंप्यूटर पार्ट्स",
      weight3: "7 kg",
      status3: "ऑफर का इंतजार",

      view: "लॉट देखें",
      safeTitle: "आपके ई-वेस्ट रिकॉर्ड सुरक्षित हैं",
      safeText:
        "हर लॉट का एक अलग ID है, जिससे आप अपने ई-वेस्ट की स्थिति देख सकते हैं।"
    },

    mr: {
      title: "माझा ई-वेस्ट",
      subtitle: "तुमचे ई-वेस्ट लॉट आणि त्यांची स्थिती पहा",
      listen: "ऐका",
      back: "मागे",

      active: "सक्रिय लॉट",
      completed: "पूर्ण झालेले",
      total: "एकूण लॉट",

      lot1: "LOT-2026-0001",
      material1: "बॅटरी",
      weight1: "3 kg",
      status1: "व्यवहार पूर्ण",

      lot2: "LOT-2026-0002",
      material2: "मोबाईल फोन",
      weight2: "5 kg",
      status2: "ऑफर स्वीकारली",

      lot3: "LOT-2026-0003",
      material3: "कॉम्प्युटर पार्ट्स",
      weight3: "7 kg",
      status3: "ऑफरची वाट पाहत आहे",

      view: "लॉट पहा",
      safeTitle: "तुमचे ई-वेस्ट रेकॉर्ड सुरक्षित आहेत",
      safeText:
        "प्रत्येक लॉटला एक वेगळी ID आहे, त्यामुळे तुम्ही तुमच्या ई-वेस्टचा प्रवास पाहू शकता."
    }
  };

  const text = translations[language] || translations.en;

  useEffect(() => {
    speakScreen();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function getVoiceLanguage() {
    if (language === "te") return "te-IN";
    if (language === "hi") return "hi-IN";
    if (language === "mr") return "mr-IN";
    return "en-IN";
  }

  function speakScreen() {
    window.speechSynthesis.cancel();

    const messages = {
      en: "My E-Waste. Here you can see your e-waste lots and their current status.",
      te: "నా ఈ-వేస్ట్. ఇక్కడ మీ ఈ-వేస్ట్ లాట్లు మరియు వాటి స్థితిని చూడవచ్చు.",
      hi: "मेरा ई-वेस्ट। यहां आप अपने ई-वेस्ट लॉट और उनकी स्थिति देख सकते हैं।",
      mr: "माझा ई-वेस्ट. येथे तुम्ही तुमचे ई-वेस्ट लॉट आणि त्यांची स्थिती पाहू शकता."
    };

    const speech = new SpeechSynthesisUtterance(
      messages[language] || messages.en
    );

    speech.lang = getVoiceLanguage();
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  const [lots, setLots] = useState([]);

  useEffect(() => {
    async function loadLots() {
      try {
        const res = await fetch("https://kabadiwala-1.onrender.com/api/e-waste-lots");
        if (res.ok) {
          const data = await res.json();
          if (data.lots && data.lots.length > 0) {
            setLots(data.lots);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch e-waste lots from MongoDB:", err.message);
      }
    }
    loadLots();
  }, []);

  const activeCount = lots.filter(
    (l) => l.status === "Available" || l.status === "Offer Received" || l.status === "Accepted"
  ).length;
  const completedCount = lots.filter((l) => l.status === "Sold").length;
  const totalCount = lots.length || 3;

  return (
    <div className="my-ewaste-screen">

      <div className="my-ewaste-header">

        <button
          className="my-ewaste-back"
          onClick={() => {
            window.speechSynthesis.cancel();
            onBack();
          }}
        >
          ← {text.back}
        </button>

        <div className="my-ewaste-speaker-area">

          <div className="my-ewaste-finger-effect">
            <span className="my-ewaste-ring ring-1"></span>
            <span className="my-ewaste-ring ring-2"></span>
            <span className="my-ewaste-ring ring-3"></span>

            <span className="my-ewaste-finger">
              ☝️
            </span>
          </div>

          <button
            className="my-ewaste-speaker"
            onClick={speakScreen}
          >
            <span>🔊</span>
            <span>{text.listen}</span>
          </button>

        </div>

      </div>

      <div className="my-ewaste-content">

        <div className="my-ewaste-title-icon">
          ♻
        </div>

        <h1>{text.title}</h1>

        <p className="my-ewaste-subtitle">
          {text.subtitle}
        </p>

        <div className="my-ewaste-summary">

          <div className="ewaste-summary-card">
            <span className="summary-icon">📦</span>
            <strong>{lots.length > 0 ? activeCount : 2}</strong>
            <small>{text.active}</small>
          </div>

          <div className="ewaste-summary-card">
            <span className="summary-icon">✓</span>
            <strong>{lots.length > 0 ? completedCount : 1}</strong>
            <small>{text.completed}</small>
          </div>

          <div className="ewaste-summary-card">
            <span className="summary-icon">♻</span>
            <strong>{lots.length > 0 ? totalCount : 3}</strong>
            <small>{text.total}</small>
          </div>

        </div>

        <div className="my-ewaste-lots">

          <div className="ewaste-lot-card completed-lot">

            <div className="lot-top">

              <div className="lot-material-icon">
                🔋
              </div>

              <div className="lot-heading">
                <strong>{text.material1}</strong>
                <span>{text.lot1}</span>
              </div>

              <div className="lot-status completed-status">
                ✓
              </div>

            </div>

            <div className="lot-details">

              <div>
                <span>{text.weight1}</span>
                <small>Weight</small>
              </div>

              <div>
                <span>{text.status1}</span>
                <small>Status</small>
              </div>

            </div>

            <button className="lot-view-button">
              {text.view}
              <span>→</span>
            </button>

          </div>

          <div className="ewaste-lot-card accepted-lot">

            <div className="lot-top">

              <div className="lot-material-icon">
                📱
              </div>

              <div className="lot-heading">
                <strong>{text.material2}</strong>
                <span>{text.lot2}</span>
              </div>

              <div className="lot-status accepted-status">
                ₹
              </div>

            </div>

            <div className="lot-details">

              <div>
                <span>{text.weight2}</span>
                <small>Weight</small>
              </div>

              <div>
                <span>{text.status2}</span>
                <small>Status</small>
              </div>

            </div>

            <button className="lot-view-button">
              {text.view}
              <span>→</span>
            </button>

          </div>

          <div className="ewaste-lot-card offers-lot">

            <div className="lot-top">

              <div className="lot-material-icon">
                💻
              </div>

              <div className="lot-heading">
                <strong>{text.material3}</strong>
                <span>{text.lot3}</span>
              </div>

              <div className="lot-status offers-status">
                ⏳
              </div>

            </div>

            <div className="lot-details">

              <div>
                <span>{text.weight3}</span>
                <small>Weight</small>
              </div>

              <div>
                <span>{text.status3}</span>
                <small>Status</small>
              </div>

            </div>

            <button className="lot-view-button">
              {text.view}
              <span>→</span>
            </button>

          </div>

        </div>

        <div className="my-ewaste-safe-box">

          <div className="safe-box-icon">
            🛡️
          </div>

          <div>
            <strong>{text.safeTitle}</strong>
            <p>{text.safeText}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MyEWasteScreen;