const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Clinic = require('./Clinic'); // adjust if your schema file has a different name

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// 🔥 THIS is your working ZIP endpoint
app.post('/api/lookup', async (req, res) => {
  const zip = req.body.zip?.trim();

  try {
    const clinics = await Clinic.find({ zip });

    if (clinics.length === 0) {
      return res.status(404).json({ message: 'No clinics found' });
    }

    res.status(200).json(clinics);
  } catch (err) {
    console.error('Error fetching clinics:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

