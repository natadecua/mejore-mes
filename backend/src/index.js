// backend/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const bomRoutes = require('./routes/bom');
const orderRoutes = require('./routes/orders');
const qboRoutes = require('./routes/qbo');

app.use('/api/bom', bomRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/qbo', qboRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Mejore MES Backend PoC is running!',
    endpoints: [
      '/api/bom/imports',
      '/api/orders',
      '/api/qbo/invoice/:id'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
