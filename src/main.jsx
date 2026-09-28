import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import RoleSelectionScreen from "./screen/RoleSelectionScreen.jsx";
import DemoIVRScreen from "./screen/DemoIVRScreen.jsx";
import CollectorDashboard from "./screen/CollectorDashboard.jsx";
import AddEWasteScreen from "./screen/AddEWasteScreen.jsx";
import CollectorLoginScreen from "./screen/CollectorLoginScreen.jsx";
import OTPVerificationScreen from "./screen/OTPVerificationScreen.jsx";
import CollectorProfile from "./screen/CollectorProfile.jsx";
import PhotoChoiceScreen from "./screen/PhotoChoiceScreen.jsx";
import CameraCaptureScreen from "./screen/CameraCaptureScreen.jsx";
import PhotoPreviewScreen from "./screen/PhotoPreviewScreen.jsx";
import EWasteIdentificationScreen from "./screen/EWasteIdentificationScreen.jsx";
import CreateLotScreen from "./screen/CreateLotScreen.jsx";
import RecyclerSearchScreen from "./screen/RecyclerSearchScreen.jsx";
import RecyclerMatchesScreen from "./screen/RecyclerMatchesScreen.jsx";
import BestMatchScreen from "./screen/BestMatchScreen.jsx";
import OfferAcceptedScreen from "./screen/OfferAcceptedScreen.jsx";
import PickupSchedulingScreen from "./screen/PickupSchedulingScreen.jsx";
import PickupConfirmedScreen from "./screen/PickupConfirmedScreen.jsx";
import RecyclerArrivalScreen from "./screen/RecyclerArrivalScreen.jsx";
import HandoverOTPScreen from "./screen/HandoverOTPScreen.jsx";
import HandoverSuccessScreen from "./screen/HandoverSuccessScreen.jsx";
import TransactionCompleteScreen from "./screen/TransactionCompleteScreen.jsx";
import PaymentEarningsScreen from "./screen/PaymentEarningsScreen.jsx";
import DigitalReceiptScreen from "./screen/DigitalReceiptScreen.jsx";
import MyEWasteScreen from "./screen/MyEWasteScreen.jsx";
import MyRequestsScreen from "./screen/MyRequestsScreen.jsx";
import TodaysRateScreen from "./screen/TodaysRateScreen.jsx";
import FindRecyclerScreen from "./screen/FindRecyclerScreen.jsx";
import TransactionsScreen from "./screen/TransactionsScreen.jsx";
import VerifiedRecyclersScreen from "./screen/VerifiedRecyclersScreen.jsx";
import NearbyRecyclersScreen from "./screen/NearbyRecyclersScreen.jsx";
import HelpSahayakScreen from "./screen/HelpSahayakScreen.jsx";
import RecyclerLoginScreen from "./screen/RecyclerLoginScreen.jsx";
import RecyclerDashboard from "./screen/RecyclerDashboard.jsx";
import AvailableEWasteLotsScreen from "./screen/AvailableEWasteLotsScreen.jsx";
import EWasteLotDetailsScreen from "./screen/EWasteLotDetailsScreen.jsx";
import MakeOfferScreen from "./screen/MakeOfferScreen.jsx";
import OfferSubmittedScreen from "./screen/OfferSubmittedScreen.jsx";
import CollectorOfferReceivedScreen from "./screen/CollectorOfferReceivedScreen.jsx";
import CollectorClusterScreen from "./screen/CollectorClusterScreen.jsx";
import CollectorClusterDetailsScreen from "./screen/CollectorClusterDetailsScreen.jsx";
import PickupFeasibilityScreen from "./screen/PickupFeasibilityScreen.jsx";
import PickupRouteOptimizationScreen from "./screen/PickupRouteOptimizationScreen.jsx";
import AdminLoginScreen from "./screen/AdminLoginScreen.jsx";
import AdminDashboard from "./screen/AdminDashboard.jsx";
import CollectorManagementScreen from "./screen/CollectorManagementScreen.jsx";
import RecyclerVerificationScreen from "./screen/RecyclerVerificationScreen.jsx";
import AdminEWasteLotsScreen from "./screen/AdminEWasteLotsScreen.jsx";
import AdminTransactionsScreen from "./screen/AdminTransactionsScreen.jsx";
import AdminPaymentsScreen from "./screen/AdminPaymentsScreen.jsx";
import AdminAnomalyReviewScreen from "./screen/AdminAnomalyReviewScreen.jsx";
import AdminCollectionClustersScreen from "./screen/AdminCollectionClustersScreen.jsx";
import AdminPickupRoutesScreen from "./screen/AdminPickupRoutesScreen.jsx";
import AdminPriceDemandScreen from "./screen/AdminPriceDemandScreen.jsx";
import AdminTraceabilityReportsScreen from "./screen/AdminTraceabilityReportsScreen.jsx";
import AdminRecyclingStatusScreen from "./screen/AdminRecyclingStatusScreen.jsx";


















/* =====================================================
   SCREEN 1 — WELCOME SCREEN
===================================================== */

function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">

      <div className="welcome-card">

        <div className="logo">
          ♻
        </div>

        <p className="organization">
          MINISTRY OF MINES • SIH 2026
        </p>

        <h1>
          KABADIWALA
          <br />
          <span>CONNECT</span>
        </h1>

        <p className="description">
          Waste is not the end...
          <br />
          It is the beginning.
        </p>

        <div className="start-area">

          <div className="finger">
            ☝️
          </div>

          <button
            className="start-button"
            onClick={onStart}
          >
            GET STARTED
            <span>→</span>
          </button>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   SCREEN 2 — LANGUAGE SCREEN
===================================================== */

function LanguageScreen({ onSelect, onBack }) {

  const [speaking, setSpeaking] = useState(null);

  const languages = [

    {
      code: "en",
      name: "English",
      native: "English",
      voice: "en-IN"
    },

    {
      code: "te",
      name: "Telugu",
      native: "తెలుగు",
      voice: "te-IN"
    },

    {
      code: "hi",
      name: "Hindi",
      native: "हिन्दी",
      voice: "hi-IN"
    },

    {
      code: "mr",
      name: "Marathi",
      native: "मराठी",
      voice: "mr-IN"
    }

  ];


  /* ===================================================
     SPEAK ONE LANGUAGE
  =================================================== */

  function speak(language) {

    window.speechSynthesis.cancel();

    setSpeaking(language.code);

    const speech =
      new SpeechSynthesisUtterance(
        language.native
      );

    speech.lang =
      language.voice;

    speech.rate = 0.8;

    speech.pitch = 1;

    speech.onend = () => {
      setSpeaking(null);
    };

    speech.onerror = () => {
      setSpeaking(null);
    };

    window.speechSynthesis.speak(
      speech
    );
  }


  /* ===================================================
     SPEAK ALL LANGUAGES
  =================================================== */

  function speakAllLanguages() {

    window.speechSynthesis.cancel();

    let index = 0;

    function speakNext() {

      if (index >= languages.length) {

        setSpeaking(null);

        return;
      }

      const language =
        languages[index];

      setSpeaking(language.code);

      const speech =
        new SpeechSynthesisUtterance(
          language.native
        );

      speech.lang =
        language.voice;

      speech.rate = 0.8;

      speech.pitch = 1;

      speech.onend = () => {

        setSpeaking(null);

        index++;

        setTimeout(() => {
          speakNext();
        }, 400);

      };

      speech.onerror = () => {

        setSpeaking(null);

        index++;

        setTimeout(() => {
          speakNext();
        }, 400);

      };

      window.speechSynthesis.speak(
        speech
      );
    }

    speakNext();
  }


  /* ===================================================
     SELECT LANGUAGE
  =================================================== */

  function selectLanguage(language) {

    window.speechSynthesis.cancel();

    const selectedText = {

      en: "Selected language: English",

      te: "ఎంచుకున్న భాష: తెలుగు",

      hi: "चयनित भाषा: हिन्दी",

      mr: "निवडलेली भाषा: मराठी"

    };

    const speech =
      new SpeechSynthesisUtterance(
        selectedText[language.code]
      );

    speech.lang =
      language.voice;

    speech.rate = 0.8;

    speech.pitch = 1;

    let moved = false;

    function moveToNextScreen() {

      if (moved) {
        return;
      }

      moved = true;

      onSelect(language.code);
    }

    speech.onend = () => {
      moveToNextScreen();
    };

    speech.onerror = () => {
      moveToNextScreen();
    };

    window.speechSynthesis.speak(
      speech
    );
  }


  return (

    <div className="language-screen">

      <div className="language-container">

        <button
          className="back-button"
          onClick={() => {

            window.speechSynthesis.cancel();

            onBack();

          }}
        >
          ← Back
        </button>


        <div
          className="language-title-area"
          onClick={speakAllLanguages}
        >

          <h1>
            Choose Your Language
          </h1>

          <div className="language-finger">
            ☝️
          </div>

        </div>


        <p>
          Select a language to continue
        </p>


        <div className="language-grid">

          {languages.map(
            (language) => (

              <div
                key={language.code}

                className={
                  `language-card ${
                    speaking === language.code
                      ? "speaking"
                      : ""
                  }`
                }

                onClick={() =>
                  selectLanguage(language)
                }
              >

                <button
                  className="speaker-button"

                  onClick={(event) => {

                    event.stopPropagation();

                    speak(language);

                  }}
                >
                  🔊
                </button>


                <div className="language-select-button">

                  <strong>
                    {language.native}
                  </strong>

                  <span>
                    {language.name}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}


/* =====================================================
   MAIN APP
===================================================== */

function App() {

  const [collectorPhone, setCollectorPhone] =
    useState("");

  const [screen, setScreen] =
    useState("welcome");
    const [selectedCluster, setSelectedCluster] = useState(null);
const [selectedLot, setSelectedLot] = useState(null);
const [offerData, setOfferData] = useState(null);
  const [language, setLanguage] =
    useState(null);

  const [capturedPhoto, setCapturedPhoto] =
    useState(null);
const [lotData, setLotData] =
  useState(null);

  /* ===================================================
     SCREEN 1 — WELCOME
  =================================================== */

  if (screen === "welcome") {

    return (

      <WelcomeScreen

        onStart={() => {

          setScreen("language");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 2 — LANGUAGE
  =================================================== */

  if (screen === "language") {

    return (

      <LanguageScreen

        onSelect={(selectedLanguage) => {

          setLanguage(selectedLanguage);

          setScreen("role");

        }}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("welcome");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 3 — ROLE SELECTION
  =================================================== */

  /* ===================================================
   SCREEN 3 — ROLE SELECTION
=================================================== */

/* ===================================================
   SCREEN 3 — ROLE SELECTION
=================================================== */

if (screen === "role") {

  return (

    <RoleSelectionScreen

      language={language}

      onSelectRole={(selectedRole) => {

        window.speechSynthesis.cancel();

        if (selectedRole === "collector") {
          setScreen("collector-login");
        }

        if (selectedRole === "recycler") {
          setScreen("recycler-login");
        }

        if (selectedRole === "admin") {
          setScreen("admin-login");
        }
        if (selectedRole === "sahayak") {
          window.speechSynthesis.cancel();
          setScreen("help-sahayak");
        }

      }}

      onOpenDemoIVR={() => {
        window.speechSynthesis.cancel();
        setScreen("demo-ivr");
      }}

      onBack={() => {

        window.speechSynthesis.cancel();

        setScreen("language");

      }}

    />

  );

}

/* ===================================================
   SCREEN 3B — DEMO IVR SCREEN
=================================================== */

if (screen === "demo-ivr") {

  return (

    <DemoIVRScreen

      language={language}

      onBack={() => {

        window.speechSynthesis.cancel();

        setScreen("role");

      }}

    />

  );

}

/* ===================================================
   SCREEN 4A — ADMIN LOGIN
=================================================== */

if (screen === "admin-login") {

  return (

    <AdminLoginScreen

      onBack={() => {

        window.speechSynthesis.cancel();

        setScreen("role");

      }}

      onLogin={() => {

  window.speechSynthesis.cancel();

  console.log("Admin Login Successful");

  setScreen("admin-dashboard");

}}

    />

  );

}
/* ===================================================
   SCREEN 4B — ADMIN DASHBOARD
=================================================== */

if (screen === "admin-dashboard") {

  return (

    <AdminDashboard

      onLogout={() => {

        window.speechSynthesis.cancel();

        setScreen("role");

      }}

      onCollectors={() => {
  window.speechSynthesis.cancel();
  setScreen("collector-management");
}}

      onRecyclers={() => {
  window.speechSynthesis.cancel();
  setScreen("recycler-verification");
}}

      onEWasteLots={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-ewaste-lots");
}}

      onTransactions={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-transactions");
}}

      onPayments={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-payments");
}}

      onAnomalies={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-anomaly-review");
}}

      onClusters={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-collection-clusters");
}}

      onRoutes={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-pickup-routes");
}}

      onPriceDemand={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-price-demand");
}}

      onTraceability={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-traceability-reports");
}}

      onRecyclingStatus={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-recycling-status");
}}

      onReports={() => {
  window.speechSynthesis.cancel();
  setScreen("admin-traceability-reports");
}}

    />

  );

}
if (screen === "admin-recycling-status") {
  return (
    <AdminRecyclingStatusScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-traceability-reports") {
  return (
    <AdminTraceabilityReportsScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-transactions") {
  return (
    <AdminTransactionsScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "recycler-verification") {
  return (
    <RecyclerVerificationScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-ewaste-lots") {
  return (
    <AdminEWasteLotsScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-payments") {
  return (
    <AdminPaymentsScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-anomaly-review") {
  return (
    <AdminAnomalyReviewScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-collection-clusters") {
  return (
    <AdminCollectionClustersScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-pickup-routes") {
  return (
    <AdminPickupRoutesScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}
if (screen === "admin-price-demand") {
  return (
    <AdminPriceDemandScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}

if (screen === "collector-management") {
  return (
    <CollectorManagementScreen
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("admin-dashboard");
      }}
    />
  );
}

if (screen === "recycler-login") {
  return (
    <RecyclerLoginScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("role");
      }}
      onLogin={async (phone) => {
        window.speechSynthesis.cancel();
        console.log("Recycler Login:", phone);

        try {
          await fetch("http://https://kabadiwala-1.onrender.com/api/recyclers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recyclerId: `REC-${phone.slice(-4)}`,
              name: `Recycler ${phone.slice(-4)}`,
              companyName: `Eco Recycling Facility ${phone.slice(-4)}`,
              phone: phone,
              location: "Vijayawada",
              verificationStatus: "Verified"
            })
          });
        } catch (err) {
          console.warn("MongoDB Recycler registration note:", err.message);
        }

        setScreen("recycler-dashboard");
      }}
    />
  );
}
/* ===================================================
   SCREEN 35 — RECYCLER DASHBOARD
=================================================== */

if (screen === "recycler-dashboard") {
  return (
    <RecyclerDashboard
      language={language}

      onLogout={() => {
        window.speechSynthesis.cancel();
        setScreen("role");
      }}

      onAvailableLots={() => {
  window.speechSynthesis.cancel();
  setScreen("available-ewaste-lots");
}}

      onFindCollectors={() => {
        window.speechSynthesis.cancel();
        console.log("Find Collectors");
      }}

      onMyOffers={() => {
        window.speechSynthesis.cancel();
        console.log("My Offers");
      }}

      onPickupRequests={() => {
        window.speechSynthesis.cancel();
        console.log("Pickup Requests");
      }}

      onTransactions={() => {
        window.speechSynthesis.cancel();
        console.log("Active Transactions");
      }}

      onPayments={() => {
        window.speechSynthesis.cancel();
        console.log("Payments");
      }}

      onHistory={() => {
        window.speechSynthesis.cancel();
        console.log("Transaction History");
      }}

      onProfile={() => {
        window.speechSynthesis.cancel();
        console.log("Recycler Profile");
      }}

      onHelp={() => {
        window.speechSynthesis.cancel();
        console.log("Recycler Help");
      }}
      onCollectorClusters={() => {
  window.speechSynthesis.cancel();
  setScreen("collector-clusters");
}}
    />
  );
}
/* ===================================================
   SCREEN 36 — AVAILABLE E-WASTE LOTS
=================================================== */

if (screen === "available-ewaste-lots") {
  return (
    <AvailableEWasteLotsScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-dashboard");
        
      }}
      onViewLot={(lot) => {
        window.speechSynthesis.cancel();
        setSelectedLot(lot);
        setScreen("ewaste-lot-details");
      }}
    />
  );
}
/* ===================================================
   SCREEN 37 — E-WASTE LOT DETAILS
=================================================== */

if (screen === "ewaste-lot-details") {
  return (
    <EWasteLotDetailsScreen
      language={language}
      lot={selectedLot}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("available-ewaste-lots");
      }}

      onMakeOffer={(lot) => {
  window.speechSynthesis.cancel();
  setSelectedLot(lot);
  setScreen("make-offer");
}}
    />
  );
}
/* ===================================================
   SCREEN 38 — MAKE AN OFFER
=================================================== */

if (screen === "make-offer") {
  return (
    <MakeOfferScreen
      language={language}
      lot={selectedLot}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("ewaste-lot-details");
      }}
onSubmitOffer={(data) => {
  window.speechSynthesis.cancel();

  console.log("Offer Submitted:", data);

  setOfferData(data);
  setSelectedLot(data.lot);
  setScreen("offer-submitted");
}}
    />
  );
}
/* ===================================================
   SCREEN 39 — OFFER SUBMITTED
=================================================== */

if (screen === "offer-submitted") {
  return (
    <OfferSubmittedScreen
      language={language}
      lot={selectedLot}
      offerData={offerData}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("make-offer");
      }}

      onDone={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-dashboard");
      }}
    />
  );
}
if (screen === "collector-offer-received") {
  return (
    <CollectorOfferReceivedScreen
      language={language}
      offerData={offerData}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}

      onAccept={(data) => {
  window.speechSynthesis.cancel();

  console.log("Collector Accepted Offer:", data);

  setOfferData(data);

  if (data?.lot) {
    setLotData(data.lot);
  }

  setScreen("offer-accepted");
}}

      onReject={(data) => {
        window.speechSynthesis.cancel();

        console.log("Collector Rejected Offer:", data);

        setScreen("collector");
      }}
    />
  );
}

  /* ===================================================
     SCREEN 4 — COLLECTOR LOGIN
  =================================================== */

  if (screen === "collector-login") {

    return (

      <CollectorLoginScreen

        language={language}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("role");

        }}

        onContinue={(phone) => {

          window.speechSynthesis.cancel();

          setCollectorPhone(phone);

          setScreen("otp");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 5 — OTP VERIFICATION
  =================================================== */

  if (screen === "otp") {

    return (

      <OTPVerificationScreen

        language={language}

        phone={collectorPhone}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("collector-login");

        }}

        onVerify={async () => {
          window.speechSynthesis.cancel();

          try {
            await fetch("http://https://kabadiwala-1.onrender.com/api/collectors", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                collectorId: `COL-${collectorPhone ? collectorPhone.slice(-4) : "1001"}`,
                name: `Collector ${collectorPhone ? collectorPhone.slice(-4) : "User"}`,
                phone: collectorPhone || "9876543210",
                location: "Vijayawada",
                verificationStatus: "Verified"
              })
            });
          } catch (err) {
            console.warn("MongoDB Collector save note:", err.message);
          }

          setScreen("collector");
        }}

      />

    );

  }


  /* ===================================================
     SCREEN 6 — COLLECTOR DASHBOARD
  =================================================== */
if (screen === "todays-rate") {
  return (
    <TodaysRateScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "find-recycler") {
  return (
    <FindRecyclerScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "transactions") {
  return (
    <TransactionsScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "help-sahayak") {
  return (
    <HelpSahayakScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "verified-recyclers") {
  return (
    <VerifiedRecyclersScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "nearby-recyclers") {
  return (
    <NearbyRecyclersScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
  if (screen === "collector") {

    return (

      <CollectorDashboard

        language={language}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("role");

        }}

        onAddWaste={() => {

          window.speechSynthesis.cancel();

          setScreen("add-ewaste");

        }}

        onProfile={() => {

          window.speechSynthesis.cancel();

          setScreen("collector-profile");

        }}
        onTodaysRate={() => {
  window.speechSynthesis.cancel();
  setScreen("todays-rate");
}}
onFindRecycler={() => {
  window.speechSynthesis.cancel();
  setScreen("find-recycler");
}}
onVerifiedRecyclers={() => {
  window.speechSynthesis.cancel();
  setScreen("verified-recyclers");
}}
onHelpSahayak={() => {
  window.speechSynthesis.cancel();
  setScreen("help-sahayak");
}}
onNearbyRecyclers={() => {
  window.speechSynthesis.cancel();
  setScreen("nearby-recyclers");
}}
onTransactions={() => {
  window.speechSynthesis.cancel();
  setScreen("transactions");
}}
        onMyEWaste={() => {
  window.speechSynthesis.cancel();
  setScreen("my-ewaste");
}}
onMyRequests={() => {
  window.speechSynthesis.cancel();
  setScreen("my-requests");
}}
onTestOfferReceived={() => {
  window.speechSynthesis.cancel();
  setScreen("collector-offer-received");
}}

      />

    );

  }


  /* ===================================================
     SCREEN 7 — COLLECTOR PROFILE
  =================================================== */

  if (screen === "collector-profile") {

    return (

      <CollectorProfile

        language={language}

        phone={collectorPhone}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("collector");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 8 — ADD E-WASTE
  =================================================== */

  if (screen === "add-ewaste") {

    return (

      <AddEWasteScreen

        language={language}

        photo={capturedPhoto}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("collector");

        }}

        /* ---------------------------------------------
           CAMERA BUTTON
           Opens Photo Choice Screen
        --------------------------------------------- */

        onCameraChoice={() => {

          window.speechSynthesis.cancel();

          setScreen("photo-choice");

        }}

        /* ---------------------------------------------
           UPLOAD / CAPTURED PHOTO
           Opens Photo Preview Screen
        --------------------------------------------- */

        onPhotoUploaded={(image) => {

          setCapturedPhoto(image);

          setScreen("photo-preview");

        }}
        onManualContinue={(data) => {
  window.speechSynthesis.cancel();

  const manualLotData = {
    material: data.wasteType,
    weight: Number(data.quantity),
    unit: data.unit || "kg",
    photo: data.photo || null,
    identificationMethod: "manual"
  };

  console.log("Manual E-Waste Details:", manualLotData);

  setLotData(manualLotData);
  setScreen("create-lot");
}}
      />

    );

  }


  /* ===================================================
     SCREEN 9 — PHOTO CHOICE
  ===================================================== */

  if (screen === "photo-choice") {

    return (

      <PhotoChoiceScreen

        language={language}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("add-ewaste");

        }}

        onTakePhoto={() => {

          window.speechSynthesis.cancel();

          setScreen("camera-capture");

        }}

        onUploadPhoto={() => {

          /*
             This is intentionally kept as a fallback.
             The actual upload can also happen directly
             from AddEWasteScreen.
          */

          window.speechSynthesis.cancel();

          setScreen("add-ewaste");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 10 — CAMERA CAPTURE
  ===================================================== */

  if (screen === "camera-capture") {

    return (

      <CameraCaptureScreen

        language={language}

        onBack={() => {

          window.speechSynthesis.cancel();

          setScreen("photo-choice");

        }}

        onPhotoCaptured={(image) => {

          setCapturedPhoto(image);

          setScreen("photo-preview");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 11 — PHOTO PREVIEW
  ===================================================== */

  if (screen === "photo-preview") {

    return (

      <PhotoPreviewScreen

        language={language}

        photo={capturedPhoto}

        onBack={() => {

          setScreen("camera-capture");

        }}

        onContinue={() => {

          setScreen("ewaste-identification");

        }}

      />

    );

  }


  /* ===================================================
     SCREEN 12 — E-WASTE IDENTIFICATION
  ===================================================== */

  /* ===================================================
   SCREEN 12 — E-WASTE IDENTIFICATION
===================================================== */

if (screen === "ewaste-identification") {

  return (

    <EWasteIdentificationScreen

      language={language}

      photo={capturedPhoto}

      onBack={() => {

        setScreen("photo-preview");

      }}

      onContinue={(data) => {

  console.log("E-Waste Details:", data);

  setLotData(data);

  setScreen("create-lot");

}}

    />

  );

}


  /* ===================================================
     FUTURE SCREEN — CREATE LOT
  ===================================================== */

 if (screen === "create-lot") {

  return (

    <CreateLotScreen

      language={language}

      material={lotData?.material}

      weight={lotData?.weight}

      photo={lotData?.photo}

      onBack={() => {

        window.speechSynthesis.cancel();

        setScreen("ewaste-identification");

      }}

      onCreateLot={async (createdLot) => {
        console.log("Created Lot:", createdLot);
        setLotData(createdLot);

        try {
          await fetch("http://https://kabadiwala-1.onrender.com/api/e-waste-lots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lotId: createdLot.lotId,
              collectorId: collectorPhone ? `COL-${collectorPhone.slice(-4)}` : "COL-1001",
              material: createdLot.material || "Battery",
              weight: Number(createdLot.weight) || 1,
              imageUrl: createdLot.photo || "",
              identificationMethod: createdLot.photo ? "Gemini AI" : "Manual",
              location: "Vijayawada",
              status: "Available"
            })
          });
        } catch (err) {
          console.warn("MongoDB Lot save note:", err.message);
        }

        setScreen("recycler-search");
      }}

    />

  );

}
/* ===================================================
   SCREEN 14 — RECYCLER SEARCH
===================================================== */

if (screen === "recycler-search") {

  return (

    <RecyclerSearchScreen

      language={language}

      lotData={lotData}

      onBack={() => {

        window.speechSynthesis.cancel();

        setScreen("create-lot");

      }}

      onComplete={() => {

        window.speechSynthesis.cancel();

        setScreen("recycler-matches");

      }}

    />

  );

}
if (screen === "recycler-matches") {
  return (
    <RecyclerMatchesScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-search");
      }}
      onViewBestMatch={() => {
        window.speechSynthesis.cancel();
        setScreen("best-match");
      }}
    />
  );
}
if (screen === "best-match") {
  return (
    <BestMatchScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-matches");
      }}
      onAcceptOffer={(acceptedOffer) => {
        console.log("Accepted Offer:", acceptedOffer);

        setLotData((previousLot) => ({
          ...previousLot,
          ...acceptedOffer
        }));

        setScreen("offer-accepted");
      }}
    />
  );
}
if (screen === "offer-accepted") {
  return (
    <OfferAcceptedScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("best-match");
      }}
      onSchedulePickup={() => {
        window.speechSynthesis.cancel();
        setScreen("pickup-scheduling");
      }}
    />
  );
}
if (screen === "pickup-scheduling") {
  return (
    <PickupSchedulingScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("offer-accepted");
      }}
      onConfirmPickup={(pickupData) => {
        console.log("Pickup Scheduled:", pickupData);

        setLotData((previousLot) => ({
          ...previousLot,
          ...pickupData
        }));

        setScreen("pickup-confirmed");
      }}
    />
  );
}
if (screen === "pickup-confirmed") {
  return (
    <PickupConfirmedScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("pickup-scheduling");
      }}
      onNext={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-arrival");
      }}
    />
  );
}
if (screen === "recycler-arrival") {
  return (
    <RecyclerArrivalScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("pickup-confirmed");
      }}
      onVerifyRecycler={() => {
        window.speechSynthesis.cancel();
        setScreen("handover-otp");
      }}
    />
  );
}
if (screen === "handover-otp") {
  return (
    <HandoverOTPScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-arrival");
      }}
      onVerified={() => {
        window.speechSynthesis.cancel();
        setScreen("handover-success");
      }}
    />
  );
}
if (screen === "handover-success") {
  return (
    <HandoverSuccessScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("handover-otp");
      }}
      onCompleteTransaction={() => {
        window.speechSynthesis.cancel();
        setScreen("transaction-complete");
      }}
    />
  );
}
if (screen === "transaction-complete") {
  return (
    <TransactionCompleteScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("handover-success");
      }}
      onContinue={async (transactionData) => {
        console.log("Transaction Complete:", transactionData);

        setLotData((previousLot) => ({
          ...previousLot,
          ...transactionData
        }));

        try {
          const txnId = transactionData.transactionId || `TXN-${Date.now().toString().slice(-4)}`;
          const colId = collectorPhone ? `COL-${collectorPhone.slice(-4)}` : (lotData?.collectorId || "COL-1001");
          const recId = lotData?.recyclerId || "REC-001";
          const amount = Number(transactionData.totalAmount) || 1260;
          const lotId = lotData?.lotId || "LOT-1001";

          await fetch("http://https://kabadiwala-1.onrender.com/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: txnId,
              collectorId: colId,
              recyclerId: recId,
              lotId: lotId,
              material: lotData?.material || "Battery",
              weight: Number(lotData?.weight) || 3,
              pricePerKg: Number(lotData?.pricePerKg) || 420,
              totalAmount: amount,
              status: "Completed",
              paymentStatus: "Pending"
            })
          });

          await fetch("http://https://kabadiwala-1.onrender.com/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: `PAY-${Date.now().toString().slice(-4)}`,
              transactionId: txnId,
              collectorId: colId,
              recyclerId: recId,
              amount: amount,
              paymentMethod: "UPI",
              paymentStatus: "Paid"
            })
          });

          await fetch("http://https://kabadiwala-1.onrender.com/api/traceability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              traceabilityId: `TRACE-${Date.now().toString().slice(-4)}`,
              lotId: lotId,
              collectorId: colId,
              recyclerId: recId,
              transactionId: txnId,
              currentStage: "Recycled",
              previousStage: "Processing",
              location: "Vijayawada Facility",
              remarks: "Verified handover and recycling complete"
            })
          });

          await fetch(`http://https://kabadiwala-1.onrender.com/api/e-waste-lots/${lotId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Sold" })
          });
        } catch (err) {
          console.warn("MongoDB Transaction save note:", err.message);
        }

        setScreen("payment-earnings");
      }}
    />
  );
}
if (screen === "payment-earnings") {
  return (
    <PaymentEarningsScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("transaction-complete");
      }}
      onContinue={(paymentData) => {
        console.log("Payment Ready:", paymentData);

        setLotData((previousLot) => ({
          ...previousLot,
          ...paymentData
        }));

        setScreen("digital-receipt");
      }}
    />
  );
}
if (screen === "my-ewaste") {
  return (
    <MyEWasteScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "digital-receipt") {
  return (
    <DigitalReceiptScreen
      language={language}
      lotData={lotData}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("payment-earnings");
      }}
      onDone={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "my-requests") {
  return (
    <MyRequestsScreen
      language={language}
      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector");
      }}
    />
  );
}
if (screen === "collector-clusters") {
  return (
    <CollectorClusterScreen
      language={language}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("recycler-dashboard");
      }}

      onViewCluster={(cluster) => {
  window.speechSynthesis.cancel();

  console.log("Selected Collector Cluster:", cluster);

  setSelectedCluster(cluster);

  setScreen("collector-cluster-details");
}}

      
    />
  );
}
if (screen === "collector-cluster-details") {
  return (
    <CollectorClusterDetailsScreen
      language={language}
      cluster={selectedCluster}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector-clusters");
      }}

      onContinue={(cluster) => {
  window.speechSynthesis.cancel();

  setSelectedCluster(cluster);

  setScreen("pickup-feasibility");
}}
    />
  );
}
if (screen === "pickup-feasibility") {
  return (
    <PickupFeasibilityScreen
      language={language}
      cluster={selectedCluster}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("collector-cluster-details");
      }}

      onContinue={(cluster) => {
  window.speechSynthesis.cancel();

  setSelectedCluster(cluster);

  setScreen("pickup-route-optimization");
}}
    />
  );
}
if (screen === "pickup-route-optimization") {
  return (
    <PickupRouteOptimizationScreen
      language={language}
      cluster={selectedCluster}

      onBack={() => {
        window.speechSynthesis.cancel();
        setScreen("pickup-feasibility");
      }}

      onContinue={(cluster) => {
        window.speechSynthesis.cancel();

        console.log("Pickup Route Started:", cluster);

        setSelectedCluster(cluster);

        setScreen("recycler-arrival");
      }}
    />
  );
}

  return null;
}


/* =====================================================
   START REACT APP
===================================================== */

createRoot(
  document.getElementById("root")
).render(
  <App />
);
