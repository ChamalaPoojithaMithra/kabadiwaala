const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    if (
      !mongoURI.startsWith("mongodb://") &&
      !mongoURI.startsWith("mongodb+srv://")
    ) {
      throw new Error("Invalid MongoDB connection string format");
    }

    const parsedURI = new URL(mongoURI);

    console.log("MongoDB URI check:", {
      protocol: parsedURI.protocol,
      usernamePresent: Boolean(parsedURI.username),
      passwordPresent: Boolean(parsedURI.password),
      hostPresent: Boolean(parsedURI.hostname)
    });

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
