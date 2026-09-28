import React, { useEffect, useState } from "react";
import "./EWasteIdentificationScreen.css";

function EWasteIdentificationScreen({
  language,
  photo,
  onBack,
  onContinue
}) {
  const [analyzing, setAnalyzing] = useState(true);
  const [identifiedMaterial, setIdentifiedMaterial] = useState(null);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const translations = {
    en: {
      title: "Identifying E-Waste",
      analyzing: "Analyzing your e-waste photo...",
      identified: "E-Waste Identified",
      confidence: "AI Identification",
      weightTitle: "Enter Approximate Weight",
      weightPlaceholder: "Enter weight",
      continue: "Continue",
      back: "← Back",
      kg: "kg",
      listen: "Listen",
      error: "Unable to identify the e-waste. Please try again.",
      noPhoto: "No photo available"
    },

    te: {
      title: "ఈ-వ్యర్థాన్ని గుర్తిస్తోంది",
      analyzing: "మీ ఈ-వ్యర్థం ఫోటోను విశ్లేషిస్తోంది...",
      identified: "ఈ-వ్యర్థం గుర్తించబడింది",
      confidence: "AI గుర్తింపు",
      weightTitle: "సుమారు బరువును నమోదు చేయండి",
      weightPlaceholder: "బరువు నమోదు చేయండి",
      continue: "కొనసాగించండి",
      back: "← వెనుకకు",
      kg: "కిలోలు",
      listen: "వినండి",
      error:
        "ఈ-వ్యర్థాన్ని గుర్తించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
      noPhoto: "ఫోటో అందుబాటులో లేదు"
    },

    hi: {
      title: "ई-कचरे की पहचान",
      analyzing:
        "आपकी ई-कचरे की फोटो का विश्लेषण किया जा रहा है...",
      identified: "ई-कचरा पहचाना गया",
      confidence: "AI पहचान",
      weightTitle: "अनुमानित वजन दर्ज करें",
      weightPlaceholder: "वजन दर्ज करें",
      continue: "जारी रखें",
      back: "← वापस",
      kg: "किग्रा",
      listen: "सुनें",
      error:
        "ई-कचरे की पहचान नहीं हो सकी। कृपया फिर से प्रयास करें।",
      noPhoto: "फोटो उपलब्ध नहीं है"
    },

    mr: {
      title: "ई-कचरा ओळखत आहे",
      analyzing:
        "तुमच्या ई-कचऱ्याच्या फोटोचे विश्लेषण करत आहे...",
      identified: "ई-कचरा ओळखला गेला",
      confidence: "AI ओळख",
      weightTitle: "अंदाजे वजन प्रविष्ट करा",
      weightPlaceholder: "वजन प्रविष्ट करा",
      continue: "पुढे जा",
      back: "← मागे",
      kg: "किलो",
      listen: "ऐका",
      error:
        "ई-कचरा ओळखता आला नाही. कृपया पुन्हा प्रयत्न करा.",
      noPhoto: "फोटो उपलब्ध नाही"
    }
  };

  const text =
    translations[language] || translations.en;

  const voiceLanguages = {
    en: "en-IN",
    te: "te-IN",
    hi: "hi-IN",
    mr: "mr-IN"
  };

  // ==========================================
  // SPEAKER
  // ==========================================

  function speakScreen() {
    window.speechSynthesis.cancel();

    const speechText = {
      en:
        "This screen identifies your e-waste using artificial intelligence. Please wait while your photo is analyzed. After the material is identified, enter the approximate weight of the material in kilograms. Then click Continue.",

      te:
        "ఈ స్క్రీన్ కృత్రిమ మేధస్సును ఉపయోగించి మీ ఈ-వ్యర్థాన్ని గుర్తిస్తుంది. మీ ఫోటో విశ్లేషించబడే వరకు దయచేసి వేచి ఉండండి. పదార్థాన్ని గుర్తించిన తర్వాత, దాని సుమారు బరువును కిలోగ్రాములలో నమోదు చేయండి. తర్వాత కొనసాగించండి బటన్‌ను నొక్కండి.",

      hi:
        "यह स्क्रीन आर्टिफिशियल इंटेलिजेंस का उपयोग करके आपके ई-कचरे की पहचान करती है। आपकी फोटो का विश्लेषण होने तक कृपया प्रतीक्षा करें। सामग्री की पहचान होने के बाद उसका अनुमानित वजन किलोग्राम में दर्ज करें। फिर जारी रखें बटन दबाएं।",

      mr:
        "ही स्क्रीन कृत्रिम बुद्धिमत्तेचा वापर करून तुमचा ई-कचरा ओळखते. तुमच्या फोटोचे विश्लेषण होईपर्यंत कृपया प्रतीक्षा करा. साहित्य ओळखल्यानंतर त्याचे अंदाजे वजन किलोग्रॅममध्ये प्रविष्ट करा. त्यानंतर पुढे जा बटण दाबा."
    };

    const speech = new SpeechSynthesisUtterance(
      speechText[language] || speechText.en
    );

    speech.lang =
      voiceLanguages[language] || "en-IN";

    speech.rate = 0.75;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  // ==========================================
  // IDENTIFY PHOTO USING GEMINI
  // ==========================================

  useEffect(() => {
    identifyEWaste();
  }, [photo]);

  async function identifyEWaste() {
    if (!photo) {
      setAnalyzing(false);
      setError(text.noPhoto);
      return;
    }

    setAnalyzing(true);
    setError("");
    setIdentifiedMaterial(null);

    try {
      const response = await fetch(
        "http://https://kabadiwala-1.onrender.com/identify-ewaste",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: photo,
            mimeType: getMimeType(photo)
          })
        }
      );

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();

      console.log("Gemini response:", data);

      if (!data.success) {
        throw new Error(
          data.message || "Identification failed"
        );
      }

      const materialInfo =
        getMaterialInfo(data.material);

      setIdentifiedMaterial(materialInfo);

    } catch (error) {
      console.error(
        "E-waste identification error:",
        error
      );

      setError(text.error);

    } finally {
      setAnalyzing(false);
    }
  }

  // ==========================================
  // GET IMAGE MIME TYPE
  // ==========================================

  function getMimeType(image) {
    if (image.startsWith("data:image/png")) {
      return "image/png";
    }

    if (image.startsWith("data:image/webp")) {
      return "image/webp";
    }

    if (image.startsWith("data:image/gif")) {
      return "image/gif";
    }

    return "image/jpeg";
  }

  // ==========================================
  // MATERIAL INFORMATION
  // ==========================================

  function getMaterialInfo(material) {
    const materials = {
      "Mobile Phone": {
        name: "Mobile Phone",
        icon: "📱"
      },

      Laptop: {
        name: "Laptop",
        icon: "💻"
      },

      "Computer Parts": {
        name: "Computer Parts",
        icon: "🖥️"
      },

      "TV / Monitor": {
        name: "TV / Monitor",
        icon: "📺"
      },

      Battery: {
        name: "Battery",
        icon: "🔋"
      },

      "Other E-Waste": {
        name: "Other E-Waste",
        icon: "♻️"
      }
    };

    return (
      materials[material] ||
      materials["Other E-Waste"]
    );
  }

  // ==========================================
  // CONTINUE
  // ==========================================

  function handleContinue() {
    if (!identifiedMaterial || !weight) {
      return;
    }

    const lotData = {
      material: identifiedMaterial.name,
      materialIcon: identifiedMaterial.icon,
      weight: weight,
      unit: "kg",
      photo: photo
    };

    console.log(
      "Final E-Waste Details:",
      lotData
    );

    window.speechSynthesis.cancel();

    onContinue(lotData);
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <div className="ewaste-identification-screen">

      {/* LISTEN BUTTON */}

      <div className="identification-speaker-area">

        <div className="speaker-finger-effect">

          <span className="speaker-ring speaker-ring-1"></span>

          <span className="speaker-ring speaker-ring-2"></span>

          <span className="speaker-ring speaker-ring-3"></span>

          <span className="speaker-finger">
            ☝️
          </span>

        </div>

        <button
          className="ewaste-identification-speaker"
          onClick={speakScreen}
        >
          <span className="speaker-icon">
            🔊
          </span>

          <span>
            {text.listen}
          </span>
        </button>

      </div>

      {/* BACK BUTTON */}

      <button
        className="back-button"
        onClick={() => {
          window.speechSynthesis.cancel();
          onBack();
        }}
      >
        {text.back}
      </button>

      {/* MAIN CONTAINER */}

      <div className="ewaste-identification-container">

        {/* HEADER */}

        <div className="ewaste-identification-header">

          <div className="ewaste-identification-icon">
            🤖
          </div>

          <h1>
            {text.title}
          </h1>

          {analyzing && (
            <p>
              {text.analyzing}
            </p>
          )}

        </div>

        {/* PHOTO */}

        <div className="ewaste-identification-photo-card">

          {photo ? (
            <img
              src={photo}
              alt="E-waste"
              className="ewaste-identification-photo"
            />
          ) : (
            <div className="ewaste-identification-no-photo">
              📷

              <p>
                {text.noPhoto}
              </p>
            </div>
          )}

          {/* SCANNING OVERLAY */}

          {analyzing && (
            <div className="ewaste-scanning-overlay">

              <div className="ewaste-scan-line"></div>

              <div className="ewaste-spinner"></div>

              <p>
                {text.analyzing}
              </p>

            </div>
          )}

        </div>

        {/* IDENTIFICATION RESULT */}

        {!analyzing &&
          identifiedMaterial && (
            <div className="ewaste-identification-result">

              <div className="ewaste-result-icon">
                {identifiedMaterial.icon}
              </div>

              <div className="ewaste-result-content">

                <p>
                  {text.identified}
                </p>

                <h2>
                  {identifiedMaterial.name}
                </h2>

                <span>
                  ✓ {text.confidence}
                </span>

              </div>

            </div>
          )}

        {/* ERROR */}

        {!analyzing &&
          error && (
            <div className="ewaste-identification-error">

              {error}

              <br />

              <button
                onClick={identifyEWaste}
                className="try-again-button"
              >
                Try Again
              </button>

            </div>
          )}

        {/* WEIGHT */}

        {!analyzing &&
          identifiedMaterial && (
            <div className="weight-section">

              <h2>
                {text.weightTitle}
              </h2>

              <div className="weight-input-row">

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(event) =>
                    setWeight(event.target.value)
                  }
                  placeholder={
                    text.weightPlaceholder
                  }
                />

                <span className="weight-unit">
                  {text.kg}
                </span>

              </div>

            </div>
          )}

        {/* CONTINUE */}

        <div className="identification-continue-wrapper">

          <button
            className="ewaste-identification-continue"
            onClick={handleContinue}
            disabled={
              analyzing ||
              !identifiedMaterial ||
              !weight
            }
          >
            {text.continue}

            <span>
              →
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}

export default EWasteIdentificationScreen;