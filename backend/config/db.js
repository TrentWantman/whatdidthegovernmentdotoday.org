const mongoose = require('mongoose');

const getMongoURI = () => {
  return `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;
};

const connectDB = async () => {
  try {
    const uri = getMongoURI();
    console.log(`🟡 Connecting to MongoDB at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      family: 4, // Force IPv4
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;