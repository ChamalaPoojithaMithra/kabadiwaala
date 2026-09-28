import React, { useEffect } from "react";
import "./TodaysRateScreen.css";

function TodaysRateScreen({ language, onBack }) {
  const text = {
    en: {
      title: "Today's Rate",
      subtitle: "Check the current demo rates for e-waste",
      battery: "Battery",
      mobile: "Mobile Phone",
      computer: "Computer Parts",
      tv: "TV / Monitor",
      laptop: "Laptop",
      other: "Other E-Waste",
      perKg: "/ kg",
      demo: "Demo / illustrative rates for SIH prototype",
      back: "BACK",
      guidance: "Tap a material to hear its rate"
    },

    te: {
      title: "ఈరోజు ధర",
      subtitle: "ఈ-వేస్ట్ కోసం డెమో ధరలను చూడండి",
      battery: "బ్యాటరీ",
      mobile: "మొబైల్ ఫోన్",
      computer: "కంప్యూటర్ భాగాలు",
      tv: "టీవీ / మానిటర్",
      laptop: "ల్యాప్‌టాప్",
      other: "ఇతర ఈ-వేస్ట్",
      perKg: "/ కిలో",
      demo: "SIH ప్రోటోటైప్ కోసం డెమో / ఉదాహరణ ధరలు",
      back: "వెనుకకు",
      guidance: "ధర వినడానికి ఒక పదార్థాన్ని నొక్కండి"
    },

    hi: {
      title: "आज की दर",
      subtitle: "ई-वेस्ट की डेमो दरें देखें",
      battery: "बैटरी",
      mobile: "मोबाइल फोन",
      computer: "कंप्यूटर पार्ट्स",
      tv: "टीवी / मॉनिटर",
      laptop: "लैपटॉप",
      other: "अन्य ई-वेस्ट",
      perKg: "/ किलो",
      demo: "SIH प्रोटोटाइप के लिए डेमो / उदाहरण दरें",
      back: "वापस",
      guidance: "दर सुनने के लिए सामग्री पर टैप करें"
    },

    mr: {
      title: "आजचा दर",
      subtitle: "ई-वेस्टचे डेमो दर पहा",
      battery: "बॅटरी",
      mobile: "मोबाइल फोन",
      computer: "कॉम्प्युटर पार्ट्स",
      tv: "टीव्ही / मॉनिटर",
      laptop: "लॅपटॉप",
      other: "इतर ई-वेस्ट",
      perKg: "/ किलो",
      demo: "SIH प्रोटोटाइपसाठी डेमो / उदाहरण दर",
      back: "मागे",
      guidance: "दर ऐकण्यासाठी वस्तूवर टॅप करा"
    }
  };

  const currentText = text[language] || text.en;

  const [rates, setRates] = useState([
    {
      id: "battery",
      icon: "🔋",
      name: currentText.battery,
      price: "₹420"
    },
    {
      id: "mobile",
      icon: "📱",
      name: currentText.mobile,
      price: "₹430"
    },
    {
      id: "computer",
      icon: "💻",
      name: currentText.computer,
      price: "₹380"
    },
    {
      id: "tv",
      icon: "🖥️",
      name: currentText.tv,
      price: "₹350"
    },
    {
      id: "laptop",
      icon: "💻",
      name: currentText.laptop,
      price: "₹450"
    },
    {
      id: "other",
      icon: "♻️",
      name: currentText.other,
      price: "₹300"
    }
  ]);

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch("http://https://kabadiwala-1.onrender.com/api/price-demand");
        if (res.ok) {
          const data = await res.json();
          if (data.priceDemand && data.priceDemand.length > 0) {
            const iconMap = {
              "Batteries": "🔋",
              "Mobile Phones": "📱",
              "Computer Parts": "💻",
              "TV / Monitors": "🖥️",
              "Laptops": "💻",
              "Cables": "🔌",
              "Circuit Boards": "⚡"
            };
            setRates(
              data.priceDemand.map((pd) => ({
                id: pd.priceDemandId,
                icon: iconMap[pd.material] || "♻️",
                name: pd.material,
                price: `₹${pd.pricePerKg}`
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Failed to fetch price demand from MongoDB:", err.message);
      }
    }
    loadRates();
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${currentText.title}. ${currentText.subtitle}`
    );

    const voiceLanguages = {
      en: "en-IN",
      te: "te-IN",
      hi: "hi-IN",
      mr: "mr-IN"
    };

    speech.lang = voiceLanguages[language] || "en-IN";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [language]);

  function speakRate(rate) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${rate.name}. ${rate.price} ${currentText.perKg}`
    );

    const voiceLanguages = {
      en: "en-IN",
      te: "te-IN",
      hi: "hi-IN",
      mr: "mr-IN"
    };

    speech.lang = voiceLanguages[language] || "en-IN";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function handleBack() {
    window.speechSynthesis.cancel();
    onBack();
  }

  return (
    <div className="today-rate-screen">

      <div className="today-rate-header">

        <button
          className="today-rate-back-button"
          onClick={handleBack}
        >
          ← {currentText.back}
        </button>

        <button
          className="today-rate-speaker"
          onClick={() => {
            window.speechSynthesis.cancel();

            const speech = new SpeechSynthesisUtterance(
              `${currentText.title}. ${currentText.guidance}`
            );

            const voiceLanguages = {
              en: "en-IN",
              te: "te-IN",
              hi: "hi-IN",
              mr: "mr-IN"
            };

            speech.lang = voiceLanguages[language] || "en-IN";
            speech.rate = 0.8;

            window.speechSynthesis.speak(speech);
          }}
        >
          🔊
        </button>

      </div>

      <div className="today-rate-content">

        <div className="today-rate-title-area">

          <div className="today-rate-main-icon">
            💰
          </div>

          <h1>{currentText.title}</h1>

          <p>{currentText.subtitle}</p>

        </div>

        <div className="today-rate-guidance">

          <div className="today-rate-finger">
            ☝️
          </div>

          <span>{currentText.guidance}</span>

        </div>

        <div className="today-rate-grid">

          {rates.map((rate) => (
            <button
              key={rate.id}
              className="today-rate-card"
              onClick={() => speakRate(rate)}
            >

              <div className="today-rate-icon">
                {rate.icon}
              </div>

              <div className="today-rate-name">
                {rate.name}
              </div>

              <div className="today-rate-price">
                {rate.price}
              </div>

              <div className="today-rate-unit">
                {currentText.perKg}
              </div>

              <div className="today-rate-card-speaker">
                🔊
              </div>

            </button>
          ))}

        </div>

        <div className="today-rate-demo-note">
          ⚠️ {currentText.demo}
        </div>

      </div>

    </div>
  );
}

export default TodaysRateScreen;