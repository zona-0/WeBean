const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sensorRoutes = require('./routes/sensor');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sensor', sensorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WEBEANS API running' });
});

app.use((req, res) => {
  console.log('[HTTP] 404:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.log('[ERROR]', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('-----------------------------------');
  console.log(' WEBEANS');
  console.log(` Running  : http://localhost:${PORT}`);
  console.log(` API      : http://localhost:${PORT}/api`);
  console.log('-----------------------------------');
});