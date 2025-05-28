require('dotenv').config();
const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connection is successful');
  } catch (err) {
    console.error('Connection error:', err);
  }
};

connect();
