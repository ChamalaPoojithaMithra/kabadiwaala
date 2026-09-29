import React, { useState, useEffect, useRef } from "react";
import "./DemoIVRScreen.css";

// API Base URL (reusing existing Express server)
const API_BASE = "https://kabadiwaala-1.onrender.com";

// DTMF Frequencies for keypad beeps
const DTMF_FREQS = {
  "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
  "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
  "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
  "*": [941, 1209], "0": [941, 1336], "#": [941, 1477]
};

function playDTMF(digit) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const freqs = DTMF_FREQS[digit] || [700, 1200];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.12);
  } catch {
    // AudioContext may be restricted by autoplay policy
  }
}

// Multilingual IVR Strings
const IVR_TEXTS = {
  en: {
    title: "E-Waste Connect IVR",
    subtitle: "Interactive Voice Response",
    enterMobile: "Enter your 10-digit mobile number",
    mobilePlaceholder: "Enter 10-digit mobile number",
    callBtn: "CALL E-WASTE CONNECT",
    callingState: "Calling E-Waste Connect...",
    connectingState: "Connecting to IVR Server...",
    connectedState: "Connected",
    welcomeTitle: "Welcome to E-Waste Connect",
    selectLangPrompt: "Please select your language",
    mainMenuTitle: "Choose an option:",
    optRegister: "Register / Verify Collector",
    optTransaction: "Check Transaction",
    optPayment: "Check Payment",
    optHelp: "Get Help",
    optRepeat: "Repeat Menu",
    mainMenuBtn: "Main Menu",
    repeatBtn: "Repeat",
    endCallBtn: "End Call",
    listenBtn: "Listen",
    stopBtn: "Stop",
    accountFound: "Your collector account has been found.",
    alreadyRegisteredSpeech: "Your account is already registered.",
    accountNotFound: "Collector account not found for this number.",
    registerTitle: "Demo Quick Registration",
    nameLabel: "Your Full Name",
    locationLabel: "Your Location / City",
    registerBtn: "Register Collector",
    regSuccess: "Your collector registration is complete.",
    txTitle: "Transaction History",
    noTx: "No transactions were found for your account.",
    txCount: (c) => `You have ${c} transaction${c > 1 ? "s" : ""}.`,
    payTitle: "Payment Status",
    noPay: "No payment records were found for your account.",
    paySpeech: (amt, st) => `Your latest payment is ${amt} rupees. Status: ${st}.`,
    helpTitle: "E-Waste Connect Help",
    help1: "1. How to Register: Dial this IVR and press 1 to register with your mobile number without a smartphone.",
    help2: "2. How to Sell: Bring e-waste to your nearest collection center to be weighed and sold to verified recyclers.",
    help3: "3. How to Check Payment: Hand over e-waste, then call this IVR and press 3 to check payment immediately.",
    help4: "4. Support: Visit your nearest local collection hub or ask your Digital Sahayak for assistance."
  },

  te: {
    title: "ఈ-వేస్ట్ కనెక్ట్ ఐ.వి.ఆర్",
    subtitle: "వాయిస్ రెస్పాన్స్ సర్వీస్",
    enterMobile: "మీ 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి",
    mobilePlaceholder: "10 అంకెల మొబైల్ నంబర్",
    callBtn: "ఈ-వేస్ట్ కనెక్ట్‌కు కాల్ చేయండి",
    callingState: "ఈ-వేస్ట్ కనెక్ట్‌కు కాల్ కనెక్ట్ అవుతోంది...",
    connectingState: "ఐ.వి.ఆర్ సర్వర్‌కు కనెక్ట్ అవుతోంది...",
    connectedState: "కనెక్ట్ అయ్యింది",
    welcomeTitle: "ఈ-వేస్ట్ కనెక్ట్‌కు స్వాగతం",
    selectLangPrompt: "దయచేసి మీ భాషను ఎంచుకోండి",
    mainMenuTitle: "ఒక ఎంపికను ఎంచుకోండి:",
    optRegister: "కలెక్టర్ రిజిస్ట్రేషన్ / ధృవీకరణ",
    optTransaction: "లావాదేవీలను తనిఖీ చేయండి",
    optPayment: "చెల్లింపులను తనిఖీ చేయండి",
    optHelp: "సహాయం పొందండి",
    optRepeat: "మెనూని మళ్ళీ వినండి",
    mainMenuBtn: "ప్రధాన మెనూ",
    repeatBtn: "పునరావృతం",
    endCallBtn: "కాల్ ముగించు",
    listenBtn: "వినండి",
    stopBtn: "ఆపు",
    accountFound: "మీ కలెక్టర్ ఖాతా కనుగొనబడింది.",
    alreadyRegisteredSpeech: "మీ ఖాతా ఇప్పటికే నమోదై ఉంది.",
    accountNotFound: "ఈ నంబర్‌కు కలెక్టర్ ఖాతా కనుగొనబడలేదు.",
    registerTitle: "డెమో శీఘ్ర రిజిస్ట్రేషన్",
    nameLabel: "మీ పూర్తి పేరు",
    locationLabel: "మీ ప్రాంతం / నగరం",
    registerBtn: "కలెక్టర్‌గా నమోదు చేయండి",
    regSuccess: "మీ కలెక్టర్ రిజిస్ట్రేషన్ పూర్తయింది.",
    txTitle: "లావాదేవీల చరిత్ర",
    noTx: "మీ ఖాతాలో ఎలాంటి లావాదేవీలు కనుగొనబడలేదు.",
    txCount: (c) => `మీకు ${c} లావాదేవీలు ఉన్నాయి.`,
    payTitle: "చెల్లింపు స్థితి",
    noPay: "మీ ఖాతాలో ఎలాంటి చెల్లింపు రికార్డులు లేవు.",
    paySpeech: (amt, st) => `మీ తాజా చెల్లింపు ${amt} రూపాయలు. స్థితి: ${st}.`,
    helpTitle: "ఈ-వేస్ట్ కనెక్ట్ సహాయం",
    help1: "1. నమోదు: స్మార్ట్‌ఫోన్ లేకుండా మొబైల్ నంబర్‌తో నమోదు కావడానికి ఈ ఐవిఆర్‌కు కాల్ చేసి 1 నొక్కండి.",
    help2: "2. అమ్మకం: మీ ఈ-వ్యర్థాలను సమీప కేంద్రానికి తీసుకెళ్లి రీసైక్లర్‌కు విక్రయించండి.",
    help3: "3. చెల్లింపు: వ్యర్థాలను అప్పగించిన తర్వాత ఐవిఆర్‌లో 3 నొక్కి చెల్లింపు స్థితిని తెలుసుకోండి.",
    help4: "4. సహాయం: సమీప కేంద్రంలోని డిజిటల్ సహాయక్‌ను సంప్రదించండి."
  },

  hi: {
    title: "ई-वेस्ट कनेक्ट आईवीआर",
    subtitle: "वॉइस रिस्पांस सेवा",
    enterMobile: "अपना 10-अंकीय मोबाइल नंबर दर्ज करें",
    mobilePlaceholder: "10-अंकीय मोबाइल नंबर",
    callBtn: "ई-वेस्ट कनेक्ट को कॉल करें",
    callingState: "ई-वेस्ट कनेक्ट को कॉल किया जा रहा है...",
    connectingState: "आईवीआर सर्वर से जुड़ रहा है...",
    connectedState: "कॉल जुड़ गई",
    welcomeTitle: "ई-वेस्ट कनेक्ट में आपका स्वागत है",
    selectLangPrompt: "कृपया अपनी भाषा चुनें",
    mainMenuTitle: "एक विकल्प चुनें:",
    optRegister: "कलेक्टर पंजीकरण / सत्यापन",
    optTransaction: "लेनदेन की जांच करें",
    optPayment: "भुगतान स्थिति जांचें",
    optHelp: "सहायता प्राप्त करें",
    optRepeat: "मेनू दोहराएं",
    mainMenuBtn: "मुख्य मेनू",
    repeatBtn: "दोहराएं",
    endCallBtn: "कॉल समाप्त करें",
    listenBtn: "सुनें",
    stopBtn: "रोकें",
    accountFound: "आपका कलेक्टर खाता मिल गया है।",
    alreadyRegisteredSpeech: "आपका खाता पहले से पंजीकृत है।",
    accountNotFound: "इस नंबर के लिए कोई खाता नहीं मिला।",
    registerTitle: "डेमो त्वरित पंजीकरण",
    nameLabel: "आपका पूरा नाम",
    locationLabel: "स्थान / शहर",
    registerBtn: "पंजीकरण करें",
    regSuccess: "आपका कलेक्टर पंजीकरण पूरा हो गया है।",
    txTitle: "लेनदेन विवरण",
    noTx: "आपके खाते में कोई लेनदेन नहीं मिला।",
    txCount: (c) => `आपके पास ${c} लेनदेन हैं।`,
    payTitle: "भुगतान विवरण",
    noPay: "आपके खाते में कोई भुगतान रिकॉर्ड नहीं मिला।",
    paySpeech: (amt, st) => `आपका नवीनतम भुगतान ₹${amt} है। स्थिति: ${st}।`,
    helpTitle: "ई-वेस्ट कनेक्ट सहायता",
    help1: "1. पंजीकरण: बिना स्मार्टफोन के पंजीकरण के लिए इस आईवीआर पर 1 दबाएं।",
    help2: "2. ई-कचरा बेचें: अपने नजदीकी संग्रह केंद्र पर ले जाएं और रीसाइक्लर को बेचें।",
    help3: "3. भुगतान जांचें: ई-कचरा सौंपने के बाद 3 दबाकर भुगतान तुरंत जांचें।",
    help4: "4. सहायता: नजदीकी केंद्र पर डिजिटल सहायक से संपर्क करें।"
  },

  mr: {
    title: "ई-वेस्ट कनेक्ट आय.व्ही.आर",
    subtitle: "व्हॉइस रिस्पॉन्स सेवा",
    enterMobile: "तुमचा 10-अंकी मोबाइल नंबर टाका",
    mobilePlaceholder: "10-अंकी मोबाइल नंबर",
    callBtn: "ई-वेस्ट कनेक्टला कॉल करा",
    callingState: "ई-वेस्ट कनेक्टला कॉल लागत आहे...",
    connectingState: "आय.व्ही.आर सर्व्हरशी जोडत आहे...",
    connectedState: "कॉल जोडला गेला",
    welcomeTitle: "ई-वेस्ट कनेक्ट मध्ये आपले स्वागत आहे",
    selectLangPrompt: "कृपया तुमची भाषा निवडा",
    mainMenuTitle: "पर्याय निवडा:",
    optRegister: "संकलक नोंदणी / पडताळणी",
    optTransaction: "व्यवहार तपासा",
    optPayment: "पेमेंट तपासा",
    optHelp: "मदत मिळवा",
    optRepeat: "मेनू पुन्हा ऐका",
    mainMenuBtn: "मुख्य मेनू",
    repeatBtn: "पुन्हा",
    endCallBtn: "कॉल संपवा",
    listenBtn: "ऐका",
    stopBtn: "थांबवा",
    accountFound: "आपले संकलक खाते आढळले आहे.",
    alreadyRegisteredSpeech: "आपले खाते आधीच नोंदणीकृत आहे.",
    accountNotFound: "या नंबरसाठी संकलक खाते आढळले नाही.",
    registerTitle: "डेमो जलद नोंदणी",
    nameLabel: "पूर्ण नाव",
    locationLabel: "स्थान / शहर",
    registerBtn: "नोंदणी करा",
    regSuccess: "आपली संकलक नोंदणी पूर्ण झाली आहे.",
    txTitle: "व्यवहार इतिहास",
    noTx: "आपल्या खात्यात कोणताही व्यवहार आढळला नाही.",
    txCount: (c) => `आपल्याकडे ${c} व्यवहार आहेत.`,
    payTitle: "पेमेंट स्थिती",
    noPay: "आपल्या खात्यात कोणतीही पेमेंट नोंद आढळली नाही.",
    paySpeech: (amt, st) => `आपले नवीनतम पेमेंट ₹${amt} आहे. स्थिती: ${st}.`,
    helpTitle: "ई-वेस्ट कनेक्ट मदत",
    help1: "1. नोंदणी: स्मार्टफोनशिवाय नोंदणीसाठी या आयव्हीआर वर 1 दाबा.",
    help2: "2. ई-कचरा विक्री: जवळच्या संकलन केंद्रावर जमा करून सत्यापित रिसायकलरला विका.",
    help3: "3. पेमेंट तपासा: ई-कचरा दिल्यावर पेमेंट तपासण्यासाठी 3 दाबा.",
    help4: "4. मदत: जवळच्या केंद्रातील डिजिटल सहाय्यकाशी संपर्क साधा."
  }
};

const VOICE_LANGS = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
  mr: "mr-IN"
};

function DemoIVRScreen({ language = "en", onBack }) {
  // Navigation & session states
  const [ivrLang, setIvrLang] = useState(language || "en");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState("phone_input"); // phone_input, calling, welcome, main_menu, register_verify, transaction, payment, help
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // DB Data states
  const [collector, setCollector] = useState(null);
  const [regName, setRegName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = IVR_TEXTS[ivrLang] || IVR_TEXTS.en;
  const timerRef = useRef(null);

  // Stop speech synthesis
  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  // Speak text with specified or current language
  function speak(textToSpeak, langCode = ivrLang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = VOICE_LANGS[langCode] || "en-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  // Active call duration timer
  useEffect(() => {
    if (step !== "phone_input" && step !== "calling") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Format call duration MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // -------------------------------------------------------------
  // STEP 1: INITIATE CALL
  // -------------------------------------------------------------
  function handleStartCall(e) {
    if (e && e.preventDefault) e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length !== 10) {
      alert("Please enter a valid 10-digit mobile number for this demo.");
      return;
    }

    stopSpeaking();
    playDTMF("1");
    setStep("calling");

    // Simulate network dial & connect (2.2 seconds)
    setTimeout(() => {
      setStep("welcome");
      // Read welcome message
      const welcomePrompt =
        "Welcome to E-Waste Connect. Please select your language. " +
        "Telugu for 1. Hindi for 2. English for 3. Marathi for 4.";
      speak(welcomePrompt, "en");
    }, 2200);
  }

  // -------------------------------------------------------------
  // STEP 2: SELECT LANGUAGE
  // -------------------------------------------------------------
  function handleSelectLanguage(langCode, digit) {
    playDTMF(digit);
    stopSpeaking();
    setIvrLang(langCode);

    const localized = IVR_TEXTS[langCode] || IVR_TEXTS.en;
    setStep("main_menu");

    const menuPrompt = `${localized.welcomeTitle}. ${localized.mainMenuTitle} 1: ${localized.optRegister}. 2: ${localized.optTransaction}. 3: ${localized.optPayment}. 4: ${localized.optHelp}. 0: ${localized.optRepeat}.`;
    setTimeout(() => {
      speak(menuPrompt, langCode);
    }, 200);
  }

  // -------------------------------------------------------------
  // STEP 3: MAIN MENU SELECTION (Option 1, 2, 3, 4, 0)
  // -------------------------------------------------------------
  async function handleMenuChoice(choice) {
    playDTMF(choice);
    stopSpeaking();

    if (choice === "0") {
      // Repeat current menu
      const menuPrompt = `${t.welcomeTitle}. ${t.mainMenuTitle} 1: ${t.optRegister}. 2: ${t.optTransaction}. 3: ${t.optPayment}. 4: ${t.optHelp}. 0: ${t.optRepeat}.`;
      speak(menuPrompt);
      return;
    }

    if (choice === "1") {
      // Option 1: Register / Verify Collector
      setLoading(true);
      setStep("register_verify");
      try {
        const res = await fetch(`${API_BASE}/api/collectors/${phoneNumber}`);
        const data = await res.json();
        if (data.success && data.collector) {
          setCollector(data.collector);
          speak(`${t.accountFound} ${t.alreadyRegisteredSpeech}`);
        } else {
          setCollector(null);
          speak(t.accountNotFound);
        }
      } catch {
        // Fallback for offline demo
        setCollector(null);
        speak(t.accountNotFound);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (choice === "2") {
      // Option 2: Check Transactions
      setLoading(true);
      setStep("transaction");
      try {
        const res = await fetch(`${API_BASE}/api/ivr/transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callerNumber: phoneNumber, language: ivrLang })
        });
        const data = await res.json();
        if (data.success && data.count > 0) {
          setTransactions(data.transactions || [data.latestTransaction]);
          speak(data.audioText || t.txCount(data.count));
        } else {
          setTransactions([]);
          speak(t.noTx);
        }
      } catch {
        // Safe fallback for demo if database has no transaction
        setTransactions([]);
        speak(t.noTx);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (choice === "3") {
      // Option 3: Check Payment
      setLoading(true);
      setStep("payment");
      try {
        const res = await fetch(`${API_BASE}/api/ivr/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callerNumber: phoneNumber, language: ivrLang })
        });
        const data = await res.json();
        if (data.success && data.count > 0) {
          setPayments(data.payments || [data.latestPayment]);
          speak(data.audioText || t.paySpeech(data.latestPayment.amount, data.latestPayment.paymentStatus));
        } else {
          setPayments([]);
          speak(t.noPay);
        }
      } catch {
        setPayments([]);
        speak(t.noPay);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (choice === "4") {
      // Option 4: Get Help
      setStep("help");
      speak(`${t.helpTitle}. ${t.help1}. ${t.help2}. ${t.help3}. ${t.help4}`);
      return;
    }
  }

  // -------------------------------------------------------------
  // QUICK REGISTRATION FOR DEMO
  // -------------------------------------------------------------
  async function handleQuickRegister(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!regName.trim()) {
      alert("Please enter a name.");
      return;
    }

    setLoading(true);
    stopSpeaking();
    const newCollectorId = `COL-${phoneNumber.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const res = await fetch(`${API_BASE}/api/collectors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectorId: newCollectorId,
          name: regName.trim(),
          phone: phoneNumber,
          location: regLocation.trim() || "Local Hub",
          verificationStatus: "Pending"
        })
      });
      const data = await res.json();
      if (data.success && data.collector) {
        setCollector(data.collector);
      } else {
        setCollector({
          collectorId: newCollectorId,
          name: regName.trim(),
          phone: phoneNumber,
          location: regLocation.trim() || "Local Hub",
          verificationStatus: "Pending"
        });
      }
      speak(t.regSuccess);
    } catch {
      // Offline fallback
      setCollector({
        collectorId: newCollectorId,
        name: regName.trim(),
        phone: phoneNumber,
        location: regLocation.trim() || "Local Hub",
        verificationStatus: "Pending"
      });
      speak(t.regSuccess);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------
  // END CALL / HANG UP
  // -------------------------------------------------------------
  function handleEndCall() {
    playDTMF("#");
    stopSpeaking();
    setStep("phone_input");
    setCallDuration(0);
    setCollector(null);
    setTransactions([]);
    setPayments([]);
  }

  // -------------------------------------------------------------
  // KEYPAD INTERACTION MAPPER
  // -------------------------------------------------------------
  function handleKeypadPress(digit) {
    playDTMF(digit);

    if (step === "welcome") {
      if (digit === "1") handleSelectLanguage("te", "1");
      if (digit === "2") handleSelectLanguage("hi", "2");
      if (digit === "3") handleSelectLanguage("en", "3");
      if (digit === "4") handleSelectLanguage("mr", "4");
      return;
    }

    if (step === "main_menu") {
      if (["1", "2", "3", "4", "0"].includes(digit)) {
        handleMenuChoice(digit);
      }
      return;
    }

    if (step === "register_verify" || step === "transaction" || step === "payment" || step === "help") {
      if (digit === "1") {
        setStep("main_menu");
        stopSpeaking();
        const menuPrompt = `${t.mainMenuTitle} 1: ${t.optRegister}. 2: ${t.optTransaction}. 3: ${t.optPayment}. 4: ${t.optHelp}. 0: ${t.optRepeat}.`;
        speak(menuPrompt);
      } else if (digit === "0") {
        if (step === "register_verify") {
          speak(collector ? `${t.accountFound} ${t.alreadyRegisteredSpeech}` : t.accountNotFound);
        } else if (step === "transaction") {
          speak(transactions.length > 0 ? t.txCount(transactions.length) : t.noTx);
        } else if (step === "payment") {
          speak(payments.length > 0 ? t.paySpeech(payments[0].amount, payments[0].paymentStatus) : t.noPay);
        } else if (step === "help") {
          setStep("main_menu");
          speak(t.mainMenuTitle);
        }
      }
    }
  }

  return (
    <div className="demo-ivr-page">
      {/* Top Header */}
      <div className="demo-ivr-topbar">
        <button
          className="demo-ivr-back-btn"
          onClick={() => {
            stopSpeaking();
            if (onBack) onBack();
          }}
        >
          ← Back
        </button>

        <div className="demo-ivr-topbar-title">
          <h2>☎️ {t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="demo-ivr-voice-controls">
          <button
            className={`demo-ivr-voice-btn ${isSpeaking ? "active" : ""}`}
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                if (step === "welcome") {
                  speak("Welcome to E-Waste Connect. Please select your language.");
                } else if (step === "main_menu") {
                  speak(`${t.welcomeTitle}. ${t.mainMenuTitle} 1: ${t.optRegister}. 2: ${t.optTransaction}. 3: ${t.optPayment}. 4: ${t.optHelp}. 0: ${t.optRepeat}.`);
                } else {
                  speak(t.title);
                }
              }
            }}
          >
            {isSpeaking ? `⏹ ${t.stopBtn}` : `🔊 ${t.listenBtn}`}
          </button>
        </div>
      </div>

      {/* Main Simulated Phone Container */}
      <div className="demo-ivr-phone-device">
        {/* Phone Speaker & Camera Notch */}
        <div className="demo-ivr-phone-notch">
          <span className="demo-ivr-camera"></span>
          <span className="demo-ivr-speaker-slit"></span>
        </div>

        {/* Active Call Status Bar */}
        {step !== "phone_input" && (
          <div className="demo-ivr-call-status-bar">
            <span className="demo-ivr-live-dot"></span>
            <span className="demo-ivr-call-state-text">
              {step === "calling" ? t.callingState : `Active Call • ${formatTime(callDuration)}`}
            </span>
            <span className="demo-ivr-caller-badge">📞 +91-{phoneNumber}</span>
          </div>
        )}

        {/* Screen Dynamic Viewport */}
        <div className="demo-ivr-screen-display">
          {/* =========================================================
              VIEW 1: PHONE NUMBER INPUT STEP
          ========================================================= */}
          {step === "phone_input" && (
            <div className="demo-ivr-input-card">
              <div className="demo-ivr-badge">SIH Prototype Demo</div>
              <h3>{t.enterMobile}</h3>
              <p className="demo-ivr-hint">
                Enter any 10-digit number to simulate a basic phone caller experience without an internet connection.
              </p>

              <form onSubmit={handleStartCall} className="demo-ivr-form">
                <div className="demo-ivr-input-wrap">
                  <span className="demo-ivr-prefix">+91</span>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder={t.mobilePlaceholder}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="demo-ivr-phone-input"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length !== 10}
                  className="demo-ivr-start-call-btn"
                >
                  📞 {t.callBtn}
                </button>
              </form>
            </div>
          )}

          {/* =========================================================
              VIEW 2: CALLING / CONNECTING ANIMATION
          ========================================================= */}
          {step === "calling" && (
            <div className="demo-ivr-calling-screen">
              <div className="demo-ivr-calling-pulse">
                <span className="pulse-ring ring-1"></span>
                <span className="pulse-ring ring-2"></span>
                <span className="pulse-ring ring-3"></span>
                <span className="calling-icon">☎️</span>
              </div>
              <h3>{t.callingState}</h3>
              <p>{t.connectingState}</p>
            </div>
          )}

          {/* =========================================================
              VIEW 3: WELCOME & LANGUAGE SELECTION
          ========================================================= */}
          {step === "welcome" && (
            <div className="demo-ivr-content-view">
              <div className="demo-ivr-view-header">
                <span className="view-icon">☎️</span>
                <h3>{t.welcomeTitle}</h3>
                <p className="view-instruction">{t.selectLangPrompt}</p>
              </div>

              <div className="demo-ivr-options-grid">
                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleSelectLanguage("te", "1")}
                >
                  <span className="key-tag">1</span>
                  <span className="choice-label">తెలుగు (Telugu)</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleSelectLanguage("hi", "2")}
                >
                  <span className="key-tag">2</span>
                  <span className="choice-label">हिन्दी (Hindi)</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleSelectLanguage("en", "3")}
                >
                  <span className="key-tag">3</span>
                  <span className="choice-label">English</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleSelectLanguage("mr", "4")}
                >
                  <span className="key-tag">4</span>
                  <span className="choice-label">मराठी (Marathi)</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 4: MAIN IVR MENU
          ========================================================= */}
          {step === "main_menu" && (
            <div className="demo-ivr-content-view">
              <div className="demo-ivr-view-header">
                <h3>{t.title}</h3>
                <p className="view-instruction">{t.mainMenuTitle}</p>
              </div>

              <div className="demo-ivr-options-grid">
                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleMenuChoice("1")}
                >
                  <span className="key-tag">1</span>
                  <span className="choice-label">{t.optRegister}</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleMenuChoice("2")}
                >
                  <span className="key-tag">2</span>
                  <span className="choice-label">{t.optTransaction}</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleMenuChoice("3")}
                >
                  <span className="key-tag">3</span>
                  <span className="choice-label">{t.optPayment}</span>
                </button>

                <button
                  className="demo-ivr-choice-btn"
                  onClick={() => handleMenuChoice("4")}
                >
                  <span className="key-tag">4</span>
                  <span className="choice-label">{t.optHelp}</span>
                </button>

                <button
                  className="demo-ivr-choice-btn repeat-btn"
                  onClick={() => handleMenuChoice("0")}
                >
                  <span className="key-tag">0</span>
                  <span className="choice-label">{t.optRepeat}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 5: OPTION 1 — REGISTER / VERIFY COLLECTOR
          ========================================================= */}
          {step === "register_verify" && (
            <div className="demo-ivr-content-view">
              {loading ? (
                <div className="demo-ivr-loading">Checking collector records...</div>
              ) : collector ? (
                <div className="demo-ivr-result-card">
                  <div className="result-badge success">✓ {t.accountFound}</div>
                  <div className="result-details">
                    <div className="detail-row">
                      <span className="label">Collector ID:</span>
                      <strong className="value id">{collector.collectorId}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Name:</span>
                      <strong className="value">{collector.name}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <strong className="value">{collector.phone}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className="status-pill">{collector.verificationStatus || "Pending"}</span>
                    </div>
                  </div>
                  <p className="voice-narrative">"{t.alreadyRegisteredSpeech}"</p>
                </div>
              ) : (
                <div className="demo-ivr-reg-form">
                  <div className="result-badge warn">! {t.accountNotFound}</div>
                  <h4>{t.registerTitle}</h4>
                  <div className="form-group">
                    <label>{t.nameLabel}</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.locationLabel}</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad / Hub 4"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                    />
                  </div>
                  <button className="demo-ivr-action-btn" onClick={handleQuickRegister}>
                    ✓ {t.registerBtn}
                  </button>
                </div>
              )}

              <div className="demo-ivr-action-bar">
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("1")}
                >
                  <span className="key-tag">1</span> {t.mainMenuBtn}
                </button>
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("0")}
                >
                  <span className="key-tag">0</span> {t.repeatBtn}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 6: OPTION 2 — CHECK TRANSACTION
          ========================================================= */}
          {step === "transaction" && (
            <div className="demo-ivr-content-view">
              <div className="demo-ivr-view-header">
                <h3>{t.txTitle}</h3>
              </div>

              {loading ? (
                <div className="demo-ivr-loading">Fetching transactions from MongoDB...</div>
              ) : transactions && transactions.length > 0 ? (
                <div className="demo-ivr-result-card">
                  <div className="result-badge info">{t.txCount(transactions.length)}</div>
                  <div className="result-details">
                    <div className="detail-row">
                      <span className="label">Transaction ID:</span>
                      <strong className="value id">{transactions[0].transactionId}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Material:</span>
                      <strong className="value">{transactions[0].material || "E-Waste"}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Weight:</span>
                      <strong className="value">{transactions[0].weight || 0} kg</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <strong className="value highlight">₹{transactions[0].totalAmount || 0}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className="status-pill">{transactions[0].status || "Completed"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="demo-ivr-empty-card">
                  <span className="empty-icon">📂</span>
                  <p>{t.noTx}</p>
                </div>
              )}

              <div className="demo-ivr-action-bar">
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("1")}
                >
                  <span className="key-tag">1</span> {t.mainMenuBtn}
                </button>
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("0")}
                >
                  <span className="key-tag">0</span> {t.repeatBtn}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 7: OPTION 3 — CHECK PAYMENT
          ========================================================= */}
          {step === "payment" && (
            <div className="demo-ivr-content-view">
              <div className="demo-ivr-view-header">
                <h3>{t.payTitle}</h3>
              </div>

              {loading ? (
                <div className="demo-ivr-loading">Checking payment records...</div>
              ) : payments && payments.length > 0 ? (
                <div className="demo-ivr-result-card">
                  <div className="result-badge success">
                    ₹{payments[0].amount} • {payments[0].paymentStatus || "Paid"}
                  </div>
                  <div className="result-details">
                    <div className="detail-row">
                      <span className="label">Payment ID:</span>
                      <strong className="value id">{payments[0].paymentId}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <strong className="value highlight">₹{payments[0].amount}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className="status-pill">{payments[0].paymentStatus || "Paid"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Method:</span>
                      <strong className="value">{payments[0].paymentMethod || "UPI / Direct"}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="demo-ivr-empty-card">
                  <span className="empty-icon">💳</span>
                  <p>{t.noPay}</p>
                </div>
              )}

              <div className="demo-ivr-action-bar">
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("1")}
                >
                  <span className="key-tag">1</span> {t.mainMenuBtn}
                </button>
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("0")}
                >
                  <span className="key-tag">0</span> {t.repeatBtn}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 8: OPTION 4 — GET HELP
          ========================================================= */}
          {step === "help" && (
            <div className="demo-ivr-content-view">
              <div className="demo-ivr-view-header">
                <h3>{t.helpTitle}</h3>
              </div>

              <div className="demo-ivr-help-list">
                <div
                  className="help-item"
                  onClick={() => {
                    playDTMF("1");
                    setHelpTopic("1");
                    speak(t.help1);
                  }}
                >
                  <span className="help-key">1</span>
                  <p>{t.help1}</p>
                </div>

                <div
                  className="help-item"
                  onClick={() => {
                    playDTMF("2");
                    speak(t.help2);
                  }}
                >
                  <span className="help-key">2</span>
                  <p>{t.help2}</p>
                </div>

                <div
                  className="help-item"
                  onClick={() => {
                    playDTMF("3");
                    speak(t.help3);
                  }}
                >
                  <span className="help-key">3</span>
                  <p>{t.help3}</p>
                </div>

                <div
                  className="help-item"
                  onClick={() => {
                    playDTMF("4");
                    speak(t.help4);
                  }}
                >
                  <span className="help-key">4</span>
                  <p>{t.help4}</p>
                </div>
              </div>

              <div className="demo-ivr-action-bar">
                <button
                  className="demo-ivr-sub-btn"
                  onClick={() => handleKeypadPress("1")}
                >
                  <span className="key-tag">0</span> {t.mainMenuBtn}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            SIMULATED TELEPHONE KEYPAD (12-KEY DTMF)
        ========================================================= */}
        {step !== "phone_input" && (
          <div className="demo-ivr-keypad-panel">
            <div className="keypad-grid">
              {[
                { k: "1", sub: "" },
                { k: "2", sub: "ABC" },
                { k: "3", sub: "DEF" },
                { k: "4", sub: "GHI" },
                { k: "5", sub: "JKL" },
                { k: "6", sub: "MNO" },
                { k: "7", sub: "PQRS" },
                { k: "8", sub: "TUV" },
                { k: "9", sub: "WXYZ" },
                { k: "*", sub: "" },
                { k: "0", sub: "+" },
                { k: "#", sub: "" }
              ].map(({ k, sub }) => (
                <button
                  key={k}
                  className="keypad-key"
                  onClick={() => handleKeypadPress(k)}
                >
                  <span className="digit">{k}</span>
                  {sub && <span className="letters">{sub}</span>}
                </button>
              ))}
            </div>

            {/* End Call Button */}
            <div className="keypad-call-actions">
              <button
                className="end-call-btn"
                onClick={handleEndCall}
              >
                📵 {t.endCallBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemoIVRScreen;
