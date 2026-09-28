import React, { useEffect } from "react";
import "./TransactionsScreen.css";

function TransactionsScreen({ language, onBack }) {
  const translations = {
    en: {
      title: "Transactions",
      subtitle: "See your completed e-waste transactions",
      back: "← Back",
      totalTransactions: "Total Transactions",
      totalEarnings: "Total Earnings",
      completed: "Completed",
      paymentReady: "Payment Ready",
      transactionId: "Transaction ID",
      material: "Material",
      weight: "Weight",
      recycler: "Recycler",
      amount: "Amount",
      status: "Status",
      viewReceipt: "View Receipt",
      guidance: "Tap a transaction to hear its details.",
      safe: "Only completed transactions are shown.",
      demo: "Demo transaction records for SIH prototype",
      battery: "Battery",
      mobile: "Mobile Phone",
      kg: "kg",
      transactionCompleted: "Transaction Completed"
    },

    te: {
      title: "లావాదేవీలు",
      subtitle: "మీ పూర్తయిన ఈ-వేస్ట్ లావాదేవీలను చూడండి",
      back: "← వెనుకకు",
      totalTransactions: "మొత్తం లావాదేవీలు",
      totalEarnings: "మొత్తం ఆదాయం",
      completed: "పూర్తయినవి",
      paymentReady: "చెల్లింపు సిద్ధంగా ఉంది",
      transactionId: "లావాదేవీ ID",
      material: "పదార్థం",
      weight: "బరువు",
      recycler: "రీసైక్లర్",
      amount: "మొత్తం",
      status: "స్థితి",
      viewReceipt: "రసీదు చూడండి",
      guidance: "వివరాలు వినడానికి లావాదేవీని నొక్కండి.",
      safe: "పూర్తయిన లావాదేవీలు మాత్రమే చూపబడతాయి.",
      demo: "SIH ప్రోటోటైప్ కోసం డెమో లావాదేవీ రికార్డులు",
      battery: "బ్యాటరీ",
      mobile: "మొబైల్ ఫోన్",
      kg: "కిలోలు",
      transactionCompleted: "లావాదేవీ పూర్తయింది"
    },

    hi: {
      title: "लेन-देन",
      subtitle: "अपने पूरे हुए ई-वेस्ट लेन-देन देखें",
      back: "← वापस",
      totalTransactions: "कुल लेन-देन",
      totalEarnings: "कुल कमाई",
      completed: "पूरे हुए",
      paymentReady: "भुगतान तैयार",
      transactionId: "लेन-देन ID",
      material: "सामग्री",
      weight: "वजन",
      recycler: "रीसायक्लर",
      amount: "राशि",
      status: "स्थिति",
      viewReceipt: "रसीद देखें",
      guidance: "विवरण सुनने के लिए लेन-देन पर टैप करें।",
      safe: "केवल पूरे हुए लेन-देन दिखाए जाते हैं।",
      demo: "SIH प्रोटोटाइप के लिए डेमो लेन-देन रिकॉर्ड",
      battery: "बैटरी",
      mobile: "मोबाइल फोन",
      kg: "किलो",
      transactionCompleted: "लेन-देन पूरा हुआ"
    },

    mr: {
      title: "व्यवहार",
      subtitle: "तुमचे पूर्ण झालेले ई-वेस्ट व्यवहार पहा",
      back: "← मागे",
      totalTransactions: "एकूण व्यवहार",
      totalEarnings: "एकूण कमाई",
      completed: "पूर्ण झाले",
      paymentReady: "पेमेंट तयार",
      transactionId: "व्यवहार ID",
      material: "साहित्य",
      weight: "वजन",
      recycler: "रीसायकलर",
      amount: "रक्कम",
      status: "स्थिती",
      viewReceipt: "पावती पहा",
      guidance: "तपशील ऐकण्यासाठी व्यवहारावर टॅप करा.",
      safe: "फक्त पूर्ण झालेले व्यवहार दाखवले जातात.",
      demo: "SIH प्रोटोटाइपसाठी डेमो व्यवहार रेकॉर्ड",
      battery: "बॅटरी",
      mobile: "मोबाइल फोन",
      kg: "किलो",
      transactionCompleted: "व्यवहार पूर्ण झाला"
    }
  };

  const text = translations[language] || translations.en;

  const voiceLanguages = {
    en: "en-IN",
    te: "te-IN",
    hi: "hi-IN",
    mr: "mr-IN"
  };

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, [language]);

  async function fetchTransactions() {
    try {
      const res = await fetch("http://https://kabadiwala-1.onrender.com/api/transactions");
      if (res.ok) {
        const data = await res.json();
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(
            data.transactions.map((t) => ({
              id: t.transactionId || t.id,
              material: t.material,
              weight: t.weight,
              recycler: t.recyclerId || "Recycler A",
              price: t.pricePerKg || 420,
              amount: t.totalAmount,
              status: text.transactionCompleted
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to fetch transactions from MongoDB:", err.message);
    }
  }

  useEffect(() => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${text.title}. ${text.subtitle}. ${text.guidance}`
    );

    speech.lang = voiceLanguages[language] || "en-IN";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [language]);

  function speakTransaction(transaction) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${transaction.id}. ` +
      `${text.material}: ${transaction.material}. ` +
      `${text.weight}: ${transaction.weight} ${text.kg}. ` +
      `${text.recycler}: ${transaction.recycler}. ` +
      `${text.amount}: ${transaction.amount} rupees. ` +
      `${text.status}: ${transaction.status}. ` +
      `${text.paymentReady}.`
    );

    speech.lang = voiceLanguages[language] || "en-IN";
    speech.rate = 0.75;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function handleBack() {
    window.speechSynthesis.cancel();
    onBack();
  }

  function speakScreen() {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      `${text.title}. ${text.subtitle}. ${text.guidance}`
    );

    speech.lang = voiceLanguages[language] || "en-IN";
    speech.rate = 0.8;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  return (
    <div className="transactions-screen">

      <div className="transactions-header">

        <button
          className="transactions-back-button"
          onClick={handleBack}
        >
          {text.back}
        </button>

        <button
          className="transactions-speaker-button"
          onClick={speakScreen}
        >
          🔊
        </button>

      </div>

      <div className="transactions-container">

        <div className="transactions-heading">

          <div className="transactions-main-icon">
            💳
          </div>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>

        </div>

        <div className="transactions-guidance">

          <span className="transactions-guidance-finger">
            ☝️
          </span>

          <span>{text.guidance}</span>

        </div>

        <div className="transactions-summary">

          <div className="transactions-summary-card">
            <span>📦</span>
            <small>{text.totalTransactions}</small>
            <strong>2</strong>
          </div>

          <div className="transactions-summary-card">
            <span>💰</span>
            <small>{text.totalEarnings}</small>
            <strong>₹3,410</strong>
          </div>

          <div className="transactions-summary-card">
            <span>✅</span>
            <small>{text.completed}</small>
            <strong>2</strong>
          </div>

        </div>

        <div className="transactions-list">

          {transactions.map((transaction) => (

            <div
              key={transaction.id}
              className="transaction-card"
              onClick={() => speakTransaction(transaction)}
            >

              <div className="transaction-top">

                <div className="transaction-id">
                  {transaction.id}
                </div>

                <div className="transaction-status">
                  ✓ {transaction.status}
                </div>

              </div>

              <div className="transaction-material">
                ♻️ {transaction.material}
              </div>

              <div className="transaction-weight">
                ⚖️ {transaction.weight} {text.kg}
              </div>

              <div className="transaction-divider"></div>

              <div className="transaction-details">

                <div>
                  <span>{text.recycler}</span>
                  <strong>{transaction.recycler}</strong>
                </div>

                <div>
                  <span>{text.amount}</span>
                  <strong>₹{transaction.amount}</strong>
                </div>

              </div>

              <div className="transaction-payment">
                💰 {text.paymentReady}
              </div>

              <button
                className="transaction-receipt-button"
                onClick={(event) => {
                  event.stopPropagation();
                  speakTransaction(transaction);
                }}
              >
                {text.viewReceipt}
                <span>→</span>
              </button>

              <div className="transaction-finger">
                ☝️
              </div>

            </div>

          ))}

        </div>

        <div className="transactions-safe-message">
          🛡️ {text.safe}
        </div>

        <div className="transactions-demo-message">
          ⚠️ {text.demo}
        </div>

      </div>

    </div>
  );
}

export default TransactionsScreen;