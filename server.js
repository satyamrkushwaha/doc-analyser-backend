require('dotenv').config({
  path: process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'uat'
    ? '.env.uat'
    : '.env.dev'
});
const express = require('express');
const cors = require('cors');

const app = express();
// app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Backend!');
});


const uploadRouter = require('./src/routes/upload');
app.use('/api/upload', uploadRouter);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Backend running on ${process.env.PORT || 5000}`)
);
