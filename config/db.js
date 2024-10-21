const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    console.log("first");
    process.exit(1);
  }
};

module.exports = connectDB;


