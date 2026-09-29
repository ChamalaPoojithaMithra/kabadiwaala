const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const connectDB = require("./db.cjs");
const Collector = require("./models/Collector.cjs");
const Recycler = require("./models/Recycler.cjs");
const EWasteLot = require("./models/EWasteLot.cjs");
const Transaction = require("./models/Transaction.cjs");
const Payment = require("./models/Payment.cjs");
const Traceability = require("./models/Traceability.cjs");
const PickupRoute = require("./models/PickupRoute.cjs");
const PriceDemand = require("./models/PriceDemand.cjs");
const RecyclingStatus = require("./models/RecyclingStatus.cjs");
const Anomaly = require("./models/Anomaly.cjs");
const ivrService = require("./services/ivrService.cjs");
connectDB();

const app = express();

// ======================================================
// CORS CONFIGURATION
// ======================================================

app.use(cors({
  origin: [
    "https://kabadiwaala-1.onrender.com",
    "https://kabadiwala-1.onrender.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
}));
// ======================================================
// BODY PARSING
// ======================================================

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ======================================================
// GEMINI AI
// ======================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ======================================================
// HOME / HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "E-Waste Connect server is running",
    status: "OK"
  });
});

// ======================================================
// 1. COLLECTORS API
// ======================================================

// Add or get collector (prevent duplicates)
app.post("/api/collectors", async (req, res) => {
  try {
    const { collectorId, name, phone, location, verificationStatus } = req.body;

    if (!collectorId || !name || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: "Required collector fields are missing"
      });
    }

    // Check if collector already exists with same collectorId or phone
    const existing = await Collector.findOne({
      $or: [{ collectorId }, { phone }]
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Collector already registered",
        collector: existing
      });
    }

    const collector = new Collector({
      collectorId,
      name,
      phone,
      location,
      verificationStatus: verificationStatus || "Pending"
    });

    const savedCollector = await collector.save();

    res.status(201).json({
      success: true,
      message: "Collector saved successfully",
      collector: savedCollector
    });
  } catch (error) {
    console.error("Error saving collector:", error);

    if (error.code === 11000) {
      try {
        const existing = await Collector.findOne({
          $or: [
            { collectorId: req.body.collectorId },
            { phone: req.body.phone }
          ]
        });

        return res.status(200).json({
          success: true,
          message: "Collector already registered",
          collector: existing
        });
      } catch (lookupError) {
        console.error("Error finding existing collector:", lookupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save collector",
      error: error.message
    });
  }
});

// Get Collectors
app.get("/api/collectors", async (req, res) => {
  try {
    const query = {};
    if (req.query.verificationStatus) {
      query.verificationStatus = req.query.verificationStatus;
    }
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [{ name: regex }, { collectorId: regex }, { location: regex }, { phone: regex }];
    }

    const collectors = await Collector.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: collectors.length,
      collectors: collectors
    });
  } catch (error) {
    console.error("Error fetching collectors:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch collectors",
      error: error.message
    });
  }
});

// Get Collector by ID or Phone
app.get("/api/collectors/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const collector = await Collector.findOne({
      $or: [{ collectorId: identifier }, { phone: identifier }]
    });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: "Collector not found"
      });
    }

    res.json({
      success: true,
      collector
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collector",
      error: error.message
    });
  }
});

// ======================================================
// 2. RECYCLERS API
// ======================================================

// Add Recycler (Registration)
app.post("/api/recyclers", async (req, res) => {
  try {
    const {
      recyclerId,
      name,
      companyName,
      phone,
      location,
      verificationStatus
    } = req.body;

    if (!recyclerId || !name || !companyName || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: "Required recycler fields are missing"
      });
    }

    const existing = await Recycler.findOne({
      $or: [{ recyclerId }, { phone }]
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Recycler already registered",
        recycler: existing
      });
    }

    const recycler = new Recycler({
      recyclerId,
      name,
      companyName,
      phone,
      location,
      verificationStatus: verificationStatus || "Pending"
    });

    const savedRecycler = await recycler.save();

    res.status(201).json({
      success: true,
      message: "Recycler saved successfully",
      recycler: savedRecycler
    });
  } catch (error) {
    console.error("Error saving recycler:", error.message);
    if (error.code === 11000) {
      const existing = await Recycler.findOne({ recyclerId: req.body.recyclerId });
      return res.status(200).json({
        success: true,
        message: "Recycler ID already exists",
        recycler: existing
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to save recycler",
      error: error.message
    });
  }
});

// Get Recyclers
app.get("/api/recyclers", async (req, res) => {
  try {
    const query = {};
    if (req.query.verificationStatus) {
      query.verificationStatus = req.query.verificationStatus;
    }
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [
        { name: regex },
        { recyclerId: regex },
        { companyName: regex },
        { location: regex },
        { phone: regex }
      ];
    }

    const recyclers = await Recycler.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recyclers.length,
      recyclers: recyclers
    });
  } catch (error) {
    console.error("Error fetching recyclers:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recyclers",
      error: error.message
    });
  }
});

// Get single recycler
app.get("/api/recyclers/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const recycler = await Recycler.findOne({
      $or: [{ recyclerId: identifier }, { phone: identifier }]
    });

    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: "Recycler not found"
      });
    }

    res.json({
      success: true,
      recycler
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recycler",
      error: error.message
    });
  }
});

// Update Recycler verification status (Used by Admin Verification)
app.patch("/api/recyclers/:recyclerId", async (req, res) => {
  try {
    const { recyclerId } = req.params;
    const { verificationStatus } = req.body;

    const updated = await Recycler.findOneAndUpdate(
      { recyclerId },
      { verificationStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Recycler not found"
      });
    }

    res.json({
      success: true,
      message: "Recycler verification status updated",
      recycler: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update recycler status",
      error: error.message
    });
  }
});

// ======================================================
// 3. E-WASTE LOTS API
// ======================================================

// Create E-Waste Lot
app.post("/api/e-waste-lots", async (req, res) => {
  try {
    const {
      lotId,
      collectorId,
      material,
      category,
      description,
      weight,
      estimatedValue,
      imageUrl,
      identificationMethod,
      location,
      status
    } = req.body;

    const generatedId =
      lotId || `LOT-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const lot = new EWasteLot({
      lotId: generatedId,
      collectorId: collectorId || "COL-1001",
      material: material || "General E-Waste",
      category: category || "Electronics",
      description: description || "",
      weight: Number(weight) || 1,
      estimatedValue: Number(estimatedValue) || 0,
      imageUrl: imageUrl || "",
      identificationMethod: identificationMethod || "Manual",
      location: location || "Vijayawada",
      status: status || "Available"
    });

    const savedLot = await lot.save();

    res.status(201).json({
      success: true,
      message: "E-Waste lot created successfully",
      lot: savedLot
    });
  } catch (error) {
    console.error("Error creating e-waste lot:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create e-waste lot",
      error: error.message
    });
  }
});

// Get E-Waste Lots (supports ?status=Available, ?collectorId=...)
app.get("/api/e-waste-lots", async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.collectorId) {
      query.collectorId = req.query.collectorId;
    }
    if (req.query.material) {
      query.material = new RegExp(req.query.material, "i");
    }

    const lots = await EWasteLot.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: lots.length,
      lots
    });
  } catch (error) {
    console.error("Error fetching e-waste lots:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch e-waste lots",
      error: error.message
    });
  }
});

// Get single E-Waste Lot
app.get("/api/e-waste-lots/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    const lot = await EWasteLot.findOne({ lotId });

    if (!lot) {
      return res.status(404).json({
        success: false,
        message: "E-waste lot not found"
      });
    }

    res.json({
      success: true,
      lot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch e-waste lot",
      error: error.message
    });
  }
});

// Update E-Waste Lot Status
app.patch("/api/e-waste-lots/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    const { status } = req.body;

    const updated = await EWasteLot.findOneAndUpdate(
      { lotId },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "E-waste lot not found"
      });
    }

    res.json({
      success: true,
      message: "E-waste lot status updated",
      lot: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update lot status",
      error: error.message
    });
  }
});

// ======================================================
// 4. TRANSACTIONS API
// ======================================================

// Create Transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const {
      transactionId,
      collectorId,
      recyclerId,
      lotId,
      material,
      weight,
      pricePerKg,
      totalAmount,
      status,
      paymentStatus,
      transactionDate
    } = req.body;

    const generatedId =
      transactionId ||
      `TXN-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const txn = new Transaction({
      transactionId: generatedId,
      collectorId: collectorId || "COL-1001",
      recyclerId: recyclerId || "REC-001",
      lotId: lotId || "LOT-1001",
      material: material || "General E-Waste",
      weight: Number(weight) || 1,
      pricePerKg: Number(pricePerKg) || 0,
      totalAmount: Number(totalAmount) || (Number(pricePerKg) || 0) * (Number(weight) || 1),
      status: status || "Completed",
      paymentStatus: paymentStatus || "Pending",
      transactionDate: transactionDate ? new Date(transactionDate) : new Date()
    });

    const savedTxn = await txn.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: savedTxn
    });
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message
    });
  }
});

// Get Transactions (supports ?collectorId=..., ?recyclerId=..., ?status=...)
app.get("/api/transactions", async (req, res) => {
  try {
    const query = {};
    if (req.query.collectorId) {
      query.collectorId = req.query.collectorId;
    }
    if (req.query.recyclerId) {
      query.recyclerId = req.query.recyclerId;
    }
    if (req.query.status && req.query.status !== "all") {
      query.status = new RegExp(req.query.status, "i");
    }
    if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
      query.paymentStatus = new RegExp(req.query.paymentStatus, "i");
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
});

// Get single transaction
app.get("/api/transactions/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
      error: error.message
    });
  }
});

// Update transaction
app.patch("/api/transactions/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, paymentStatus } = req.body;
    const updateFields = { updatedAt: new Date() };
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const updated = await Transaction.findOneAndUpdate(
      { transactionId },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.json({
      success: true,
      message: "Transaction updated",
      transaction: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
      error: error.message
    });
  }
});

// ======================================================
// 5. PAYMENTS API
// ======================================================

// Create Payment
app.post("/api/payments", async (req, res) => {
  try {
    const {
      paymentId,
      transactionId,
      collectorId,
      recyclerId,
      amount,
      paymentMethod,
      paymentStatus,
      paymentDate,
      referenceNumber
    } = req.body;

    const generatedId =
      paymentId ||
      `PAY-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const payment = new Payment({
      paymentId: generatedId,
      transactionId: transactionId || "TXN-001",
      collectorId: collectorId || "COL-1001",
      recyclerId: recyclerId || "REC-001",
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: paymentStatus || "Pending",
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      referenceNumber: referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: savedPayment
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message
    });
  }
});

// Get Payments
app.get("/api/payments", async (req, res) => {
  try {
    const query = {};
    if (req.query.collectorId) query.collectorId = req.query.collectorId;
    if (req.query.recyclerId) query.recyclerId = req.query.recyclerId;
    if (req.query.transactionId) query.transactionId = req.query.transactionId;
    if (req.query.status && req.query.status !== "all") {
      query.paymentStatus = new RegExp(req.query.status, "i");
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message
    });
  }
});

// Get single payment
app.get("/api/payments/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message
    });
  }
});

// Update payment status
app.patch("/api/payments/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentStatus } = req.body;

    const updated = await Payment.findOneAndUpdate(
      { paymentId },
      { paymentStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      message: "Payment status updated",
      payment: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message
    });
  }
});

// ======================================================
// 6. TRACEABILITY API
// ======================================================

// Create Traceability Event
app.post("/api/traceability", async (req, res) => {
  try {
    const {
      traceabilityId,
      lotId,
      collectorId,
      recyclerId,
      transactionId,
      currentStage,
      previousStage,
      location,
      timestamp,
      remarks
    } = req.body;

    const generatedId =
      traceabilityId ||
      `TRACE-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const trace = new Traceability({
      traceabilityId: generatedId,
      lotId: lotId || "LOT-1001",
      collectorId: collectorId || "COL-1001",
      recyclerId: recyclerId || "REC-001",
      transactionId: transactionId || "",
      currentStage: currentStage || "Collected",
      previousStage: previousStage || "",
      location: location || "Vijayawada",
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      remarks: remarks || ""
    });

    const savedTrace = await trace.save();

    res.status(201).json({
      success: true,
      message: "Traceability record saved",
      traceability: savedTrace
    });
  } catch (error) {
    console.error("Error saving traceability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save traceability record",
      error: error.message
    });
  }
});

// Get Traceability Records
app.get("/api/traceability", async (req, res) => {
  try {
    const query = {};
    if (req.query.lotId) query.lotId = req.query.lotId;
    if (req.query.collectorId) query.collectorId = req.query.collectorId;
    if (req.query.recyclerId) query.recyclerId = req.query.recyclerId;

    const records = await Traceability.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error("Error fetching traceability records:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch traceability records",
      error: error.message
    });
  }
});

// Get Traceability for specific Lot
app.get("/api/traceability/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    const records = await Traceability.find({ lotId }).sort({ timestamp: 1 });

    res.json({
      success: true,
      lotId,
      count: records.length,
      timeline: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lot traceability",
      error: error.message
    });
  }
});

// ======================================================
// 7. PICKUP ROUTES API
// ======================================================

// Create Pickup Route
app.post("/api/pickup-routes", async (req, res) => {
  try {
    const {
      routeId,
      collectorId,
      recyclerId,
      lotId,
      pickupLocation,
      destination,
      pickupDate,
      distanceKm,
      estimatedTimeMinutes,
      routeStatus
    } = req.body;

    const generatedId =
      routeId ||
      `ROUTE-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const route = new PickupRoute({
      routeId: generatedId,
      collectorId: collectorId || "COL-1001",
      recyclerId: recyclerId || "REC-001",
      lotId: lotId || "LOT-1001",
      pickupLocation: pickupLocation || "Vijayawada",
      destination: destination || "Recycling Facility",
      pickupDate: pickupDate ? new Date(pickupDate) : new Date(),
      distanceKm: Number(distanceKm) || 0,
      estimatedTimeMinutes: Number(estimatedTimeMinutes) || 0,
      routeStatus: routeStatus || "Pending"
    });

    const savedRoute = await route.save();

    res.status(201).json({
      success: true,
      message: "Pickup route created successfully",
      route: savedRoute
    });
  } catch (error) {
    console.error("Error creating pickup route:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create pickup route",
      error: error.message
    });
  }
});

// Get Pickup Routes
app.get("/api/pickup-routes", async (req, res) => {
  try {
    const query = {};
    if (req.query.collectorId) query.collectorId = req.query.collectorId;
    if (req.query.recyclerId) query.recyclerId = req.query.recyclerId;
    if (req.query.routeStatus) query.routeStatus = req.query.routeStatus;

    const routes = await PickupRoute.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error("Error fetching pickup routes:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup routes",
      error: error.message
    });
  }
});

// Get single pickup route
app.get("/api/pickup-routes/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await PickupRoute.findOne({ routeId });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Pickup route not found"
      });
    }

    res.json({
      success: true,
      route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup route",
      error: error.message
    });
  }
});

// Update pickup route status
app.patch("/api/pickup-routes/:routeId", async (req, res) => {
  try {
    const { routeId } = req.params;
    const { routeStatus } = req.body;

    const updated = await PickupRoute.findOneAndUpdate(
      { routeId },
      { routeStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Pickup route not found"
      });
    }

    res.json({
      success: true,
      message: "Pickup route status updated",
      route: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update pickup route",
      error: error.message
    });
  }
});

// ======================================================
// 8. PRICE AND DEMAND API (Demo data for prototype)
// ======================================================

// Add or update Price Demand
app.post("/api/price-demand", async (req, res) => {
  try {
    const {
      priceDemandId,
      material,
      category,
      pricePerKg,
      demandLevel,
      availableDemandKg,
      source
    } = req.body;

    if (!material || pricePerKg === undefined) {
      return res.status(400).json({
        success: false,
        message: "Material and pricePerKg are required"
      });
    }

    const id =
      priceDemandId ||
      `PD-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const priceItem = await PriceDemand.findOneAndUpdate(
      { material: new RegExp(`^${material.trim()}$`, "i") },
      {
        priceDemandId: id,
        material,
        category: category || "E-Waste",
        pricePerKg: Number(pricePerKg),
        demandLevel: demandLevel || "Medium",
        availableDemandKg: Number(availableDemandKg) || 100,
        source: source || "Prototype Reference Market Data (Demo)",
        lastUpdated: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Price & demand record saved (prototype demo data)",
      priceDemand: priceItem
    });
  } catch (error) {
    console.error("Error saving price demand:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save price demand",
      error: error.message
    });
  }
});

// Get all Price and Demand
app.get("/api/price-demand", async (req, res) => {
  try {
    const items = await PriceDemand.find().sort({ material: 1 });

    res.json({
      success: true,
      count: items.length,
      notice: "Prototype demonstration values only. Not real market prices.",
      priceDemand: items
    });
  } catch (error) {
    console.error("Error fetching price demand:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch price demand",
      error: error.message
    });
  }
});

// Get Price and Demand by Material
app.get("/api/price-demand/:material", async (req, res) => {
  try {
    const { material } = req.params;
    const item = await PriceDemand.findOne({
      material: new RegExp(`^${material.trim()}$`, "i")
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Price data for material not found"
      });
    }

    res.json({
      success: true,
      notice: "Prototype demonstration values only. Not real market prices.",
      priceDemand: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch price data",
      error: error.message
    });
  }
});

// ======================================================
// 9. RECYCLING STATUS API
// ======================================================

// Create / Update Recycling Status
app.post("/api/recycling-status", async (req, res) => {
  try {
    const {
      statusId,
      lotId,
      transactionId,
      recyclerId,
      material,
      currentStatus,
      percentageCompleted,
      processingLocation,
      remarks
    } = req.body;

    if (!lotId || !recyclerId || !material) {
      return res.status(400).json({
        success: false,
        message: "lotId, recyclerId, and material are required"
      });
    }

    const id =
      statusId ||
      `STATUS-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const statusRecord = await RecyclingStatus.findOneAndUpdate(
      { lotId },
      {
        statusId: id,
        lotId,
        transactionId: transactionId || "",
        recyclerId,
        material,
        currentStatus: currentStatus || "Received",
        percentageCompleted: Number(percentageCompleted) || 0,
        processingLocation: processingLocation || "Vijayawada Recycling Center",
        remarks: remarks || "",
        updatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Recycling status saved successfully",
      recyclingStatus: statusRecord
    });
  } catch (error) {
    console.error("Error saving recycling status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save recycling status",
      error: error.message
    });
  }
});

// Get all Recycling Status records
app.get("/api/recycling-status", async (req, res) => {
  try {
    const query = {};
    if (req.query.currentStatus) query.currentStatus = req.query.currentStatus;
    if (req.query.recyclerId) query.recyclerId = req.query.recyclerId;

    const records = await RecyclingStatus.find(query).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: records.length,
      recyclingStatus: records
    });
  } catch (error) {
    console.error("Error fetching recycling status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recycling status",
      error: error.message
    });
  }
});

// Get Recycling Status by Lot ID
app.get("/api/recycling-status/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    const statusRecord = await RecyclingStatus.findOne({ lotId });

    if (!statusRecord) {
      return res.status(404).json({
        success: false,
        message: "Recycling status for lot not found"
      });
    }

    res.json({
      success: true,
      recyclingStatus: statusRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recycling status",
      error: error.message
    });
  }
});

// ======================================================
// 10. ANOMALIES / FRAUD REVIEW API
// ======================================================

// Create Anomaly
app.post("/api/anomalies", async (req, res) => {
  try {
    const {
      anomalyId,
      transactionId,
      collectorId,
      recyclerId,
      anomalyType,
      description,
      severity,
      detectedBy,
      status,
      remarks
    } = req.body;

    const generatedId =
      anomalyId ||
      `ANOM-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const anomaly = new Anomaly({
      anomalyId: generatedId,
      transactionId: transactionId || "",
      collectorId: collectorId || "",
      recyclerId: recyclerId || "",
      anomalyType: anomalyType || "Suspicious Activity",
      description: description || "Anomaly flag raised for review",
      severity: severity || "Medium",
      detectedBy: detectedBy || "System",
      status: status || "Open",
      remarks: remarks || ""
    });

    const savedAnomaly = await anomaly.save();

    res.status(201).json({
      success: true,
      message: "Anomaly logged successfully",
      anomaly: savedAnomaly
    });
  } catch (error) {
    console.error("Error logging anomaly:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to log anomaly",
      error: error.message
    });
  }
});

// Get Anomalies
app.get("/api/anomalies", async (req, res) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== "all") {
      query.status = new RegExp(req.query.status, "i");
    }
    if (req.query.severity && req.query.severity !== "all") {
      query.severity = new RegExp(req.query.severity, "i");
    }

    const anomalies = await Anomaly.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: anomalies.length,
      anomalies
    });
  } catch (error) {
    console.error("Error fetching anomalies:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch anomalies",
      error: error.message
    });
  }
});

// Get single anomaly
app.get("/api/anomalies/:anomalyId", async (req, res) => {
  try {
    const { anomalyId } = req.params;
    const anomaly = await Anomaly.findOne({ anomalyId });

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found"
      });
    }

    res.json({
      success: true,
      anomaly
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch anomaly",
      error: error.message
    });
  }
});

// Update Anomaly (Status / Resolution)
app.patch("/api/anomalies/:anomalyId", async (req, res) => {
  try {
    const { anomalyId } = req.params;
    const { status, remarks } = req.body;

    const updateData = { updatedAt: new Date() };
    if (status) {
      updateData.status = status;
      if (status === "Resolved" || status === "Dismissed") {
        updateData.resolvedAt = new Date();
      }
    }
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    const updated = await Anomaly.findOneAndUpdate(
      { anomalyId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found"
      });
    }

    res.json({
      success: true,
      message: "Anomaly updated successfully",
      anomaly: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update anomaly",
      error: error.message
    });
  }
});

// ======================================================
// GEMINI ANALYZE API (Preserved)
// ======================================================

app.post("/api/analyze", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required"
      });
    }

    const models = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];
    let resultText = null;

    for (const m of models) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt
        });
        if (response && response.text) {
          resultText = response.text;
          break;
        }
      } catch (e) {
        // try next model
      }
    }

    if (resultText) {
      return res.json({ result: resultText });
    }

    res.status(500).json({
      message: "Gemini AI request failed",
      error: "All Gemini model calls failed"
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    res.status(500).json({
      message: "Gemini AI request failed",
      error: error.message
    });
  }
});

// ======================================================
// GEMINI E-WASTE IDENTIFICATION (/identify-ewaste)
// ======================================================

app.post("/identify-ewaste", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const categories = [
      "Mobile Phone",
      "Laptop",
      "Computer Parts",
      "TV / Monitor",
      "Battery",
      "Other E-Waste"
    ];

let identifiedMaterial = "Other E-Waste";

// Strip data URI prefix if present
let cleanBase64 = image;
let effectiveMime = mimeType || "image/jpeg";

if (image.startsWith("data:")) {
  const parts = image.split(",");
  const header = parts[0];
  cleanBase64 = parts[1] || "";
  const mimeMatch = header.match(/data:([^;]+);base64/);
  if (mimeMatch) {
    effectiveMime = mimeMatch[1];
  }
}

      const promptText =
        "Identify what category of electronic waste is shown in this photo. " +
        "Select EXACTLY ONE of the following: " +
        "Mobile Phone, Laptop, Computer Parts, TV / Monitor, Battery, Other E-Waste. " +
        "Return ONLY the exact category name and nothing else.";

const models = ["gemini-2.5-flash", "gemini-2.0-flash"];

let reply = null;
let geminiError = null;

for (const m of models) {
  try {
    const response = await ai.models.generateContent({
      model: m,
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: effectiveMime,
                data: cleanBase64
              }
            }
          ]
        }
      ]
    });

    if (response && response.text) {
      reply = response.text.trim();
      console.log(`Gemini model ${m} response:`, reply);
      break;
    }
  } catch (mErr) {
    console.error(`Gemini model ${m} failed:`, mErr.message);
    geminiError = mErr;
  }
}

if (reply) {
  const match = categories.find((c) =>
    reply.toLowerCase().includes(c.toLowerCase())
  );

  if (match) {
    identifiedMaterial = match;
  } else {
    identifiedMaterial = "Other E-Waste";
  }
} else {
  console.error("All Gemini models failed:", geminiError?.message);

  return res.status(502).json({
    success: false,
    message: "Gemini image identification failed",
    error: geminiError?.message || "No identification result received"
  });
}

res.json({
  success: true,
  material: identifiedMaterial
});

} catch (error) {
  console.error("identify-ewaste route error:", error.message);
  res.status(500).json({
    success: false,
    message: "Identification process encountered an error",
    error: error.message
  });
}
});

// ======================================================
// 12. IVR (INTERACTIVE VOICE RESPONSE) APIS
// ======================================================

// Start IVR Call - Welcome & language selection
app.post("/api/ivr/start", (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const result = ivrService.handleStart(callerNumber);
    res.json(result);
  } catch (error) {
    console.error("IVR start error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Language Selection (1=te, 2=hi, 3=en, 4=mr)
app.post("/api/ivr/language", (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const digit =
      req.body.digit || req.body.Digits || req.body.choice || "3";
    const result = ivrService.handleLanguageSelect(callerNumber, digit);
    res.json(result);
  } catch (error) {
    console.error("IVR language error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Main Menu Navigation (1=Register, 2=Transaction, 3=Payment, 4=Help, 0=Repeat)
app.post("/api/ivr/menu", async (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const language = req.body.language || req.body.lang || "en";
    const digit =
      req.body.digit || req.body.Digits || req.body.choice || "0";
    const result = await ivrService.handleMainMenu(
      callerNumber,
      language,
      digit,
      req.body
    );
    res.json(result);
  } catch (error) {
    console.error("IVR menu error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register or Verify Collector via IVR
app.post("/api/ivr/register", async (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const language = req.body.language || req.body.lang || "en";
    const result = await ivrService.handleRegisterOrVerify(
      callerNumber,
      language,
      req.body
    );
    res.json(result);
  } catch (error) {
    console.error("IVR register error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check Latest Transactions via IVR
app.post("/api/ivr/transaction", async (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const language = req.body.language || req.body.lang || "en";
    const result = await ivrService.handleCheckTransaction(
      callerNumber,
      language
    );
    res.json(result);
  } catch (error) {
    console.error("IVR transaction error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check Latest Payments via IVR
app.post("/api/ivr/payment", async (req, res) => {
  try {
    const callerNumber =
      req.body.callerNumber || req.body.phone || req.body.From || "";
    const language = req.body.language || req.body.lang || "en";
    const result = await ivrService.handleCheckPayment(
      callerNumber,
      language
    );
    res.json(result);
  } catch (error) {
    console.error("IVR payment error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Help / Voice Instructions via IVR
app.post("/api/ivr/help", (req, res) => {
  try {
    const language = req.body.language || req.body.lang || "en";
    const result = ivrService.handleHelp(language);
    res.json(result);
  } catch (error) {
    console.error("IVR help error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ======================================================
// SERVE FRONTEND
// ======================================================

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`E-Waste Connect server running on port ${PORT}`);
});
