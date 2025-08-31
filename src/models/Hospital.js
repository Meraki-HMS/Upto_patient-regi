const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, unique: true }, 
  name: { type: String, required: true },
  address: { type: String, required: true },
  totalRooms: { type: Number, required: true },
  totalBeds: { type: Number, required: true },

  // Room details (embedded documents)
  rooms: [
    {
      roomNumber: { type: String, required: true },
      type: {
        type: String,
        enum: ["Deluxe", "Semi-Deluxe", "General", "ICU"],
        required: true,
      },
      totalBeds: { type: Number, required: true },
      availableBeds: { type: Number, default: 0 },
    },
  ],
});

HospitalSchema.pre("save", async function (next) {
  if (!this.hospitalId) {
    const lastHospital = await mongoose.model("Hospital").findOne().sort({ hospitalId: -1 });
    let newId = "HOSP001";
    if (lastHospital) {
      const lastIdNum = parseInt(lastHospital.hospitalId.replace("HOSP", ""));
      newId = "HOSP" + String(lastIdNum + 1).padStart(3, "0");
    }
    this.hospitalId = newId;
  }
  next();
});

module.exports = mongoose.model("Hospital", HospitalSchema);
