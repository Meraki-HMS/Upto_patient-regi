const mongoose = require("mongoose");

const BedAssignmentSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  bed_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", required: true },
  nurse_id: { type: String },

  assigned_date: { type: Date, default: Date.now },
  discharge_date: { type: Date, default: null },
});

module.exports = BedAssignmentSchema;
