const mongoose = require('mongoose');

const getMongoUri = () => {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    process.env.RAILWAY_MONGODB_URI ||
    ''
  );
};

const connectDB = async () => {
  try {
    const mongoURI = getMongoUri();

    if (!mongoURI) {
      console.log('No MongoDB env var configured; skipping MongoDB connection and using DEMO MODE');
      return false;
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

module.exports = connectDB;
