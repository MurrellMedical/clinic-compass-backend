const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  state: String,
  zip: {
    type: String,
    required: true
  },
  phone: String,
  services: [String], // e.g. ['Primary Care', 'OMM', 'Acupuncture']
  type: {
    type: String, // e.g. 'Free', 'Sliding Scale', 'Cash-Based'
    enum: ['Free', 'Sliding Scale', 'Cash-Based']
  }
});

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;
