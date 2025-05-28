require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/mongodb');
const authRouter = require('./routes/authRoutes');
const { userRoter } = require('./routes/userRoute');

const app = express();

Middleware (order matters!)
app.use(cors({
   origin: 'https://authentication-user-mern.onrender.com',
  credentials: true,
}));


// const allowedOrigins = [
//   'http://localhost:5173', // for local dev
//   'https://authentication-user-mern.onrender.com' // for production
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // if you're using cookies or tokens
// }));

app.use(cookieParser());

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRoter);

app.get('/', (req, res) => {
  res.send('API is working');
});



// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
