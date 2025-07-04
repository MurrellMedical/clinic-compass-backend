const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Clinic = require("./Clinic");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Clinic Compass backend is running.");
});

// ZIP code endpoint
app.post('/api/lookup', async (req, res) => {
  const zip = req.body.zip?.trim();

  try {
    const clinics = await Clinic.find({ zip });

    if (clinics.length === 0) {
      return res.status(404).json({ message: 'No clinics found.' });
    }

    res.status(200).json(clinics);
  } catch (err) {
    console.error('Error fetching clinics:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




  try {
    const clinics = await Clinic.find({ zip });

    if (clinics.length === 0) {
      return res.status(404).json({ message: `No clinics found in ZIP ${zip}` });
    }

    res.json(clinics);
  } catch (err) {
    console.error("Error fetching clinics:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {

  console.log("✅ MongoDB connected successfully");

  const testClinic = new Clinic({
    name: "Oakland Free Clinic",
    address: "123 Main St",
    city: "Oakland",
    state: "CA",
    zip: "94601",
    phone: "(510) 555-1234",
    services: ["Primary Care", "OMM"],
    type: "Free"
  });

  testClinic.save()
  const clinic2 = new Clinic({
  name: "Richmond Sliding Scale Center",
  address: "456 Market Ave",
  city: "Richmond",
  state: "CA",
  zip: "94801",
  phone: "(510) 555-4567",
  services: ["Primary Care", "Acupuncture"],
  type: "Sliding Scale"
});

const clinic3 = new Clinic({
  name: "Berkeley OMM Clinic",
  address: "789 University Blvd",
  city: "Berkeley",
  state: "CA",
  zip: "94704",
  phone: "(510) 555-7890",
  services: ["OMM"],
  type: "Cash-Based"
});

await clinic2.save();
await clinic3.save();
console.log("✅ Additional clinics saved to MongoDB");

})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
