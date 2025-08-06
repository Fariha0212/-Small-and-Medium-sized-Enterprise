const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://Farihayasmin:mim123456@cluster0.dapdkp9.mongodb.net/inventory?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('SME Inventory BD Backend is running');
});

app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
