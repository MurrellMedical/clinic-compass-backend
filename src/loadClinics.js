const mongoose = require("mongoose");
require("dotenv").config();
const csv = require("csvtojson");
const Clinic = require("./Clinic");
const path = require("path");

const csvFilePath = path.join(__dirname, "../clinics.csv").replace(/\\/g, "/");




mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
console.log("🧭 Looking for file at:", csvFilePath);

   const jsonArray = await csv().fromFile(csvFilePath);

// Normalize keys to lowercase
const normalizedArray = jsonArray.map(obj => {
  const clean = {};
  for (const key in obj) {
    clean[key.toLowerCase()] = obj[key];
  }
  return clean;
});


    const clinics = normalizedArray

  .filter(c => c.name && c.zip) // 🚨 This removes rows missing required fields
  .map(clinic => ({

      name: clinic.name,
      address: clinic["street address"] || clinic.address,
      city: clinic.city,
      state: clinic.state,
      zip: clinic.zip,
      phone: clinic.phone,
      website: clinic["web address"] || "",    // Optional field
      services: clinic.service && clinic.service.length > 0
  ? clinic.service.split(",").map(s => s.trim())
  : ["Primary Care"],


      type: clinic.type
    }));

    await Clinic.insertMany(clinics);
    console.log(`✅ ${clinics.length} clinics inserted`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Failed to insert clinics:", err.message);
  });

