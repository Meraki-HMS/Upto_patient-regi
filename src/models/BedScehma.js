const mongoose = require("mongoose");


const BedSchema = new mongoose.Schema({
  bed_id: { type: String, required: true, unique: true },
  ward: { type: String, required: true }, // e.g., ICU, General, etc.
  // hospitalId: { type: String, ref: "Hospital", required: true },
  is_occupied: { type: Boolean, default: false },
});

// module.exports = mongoose.model("Bed", BedSchema);
module.exports = BedSchema;