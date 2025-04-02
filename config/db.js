const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  if (!process.env.MONGODB_URI) {
    console.error("🚨 ERROR: MONGODB_URI is not defined! Check your environment variables.");
    process.exit(1);
  }

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.error(`❌ MongoDB Connection Attempt ${i + 1} Failed: ${err.message}`);
      if (i < retries - 1) {
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error("❌ All retry attempts failed. Exiting.");
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
