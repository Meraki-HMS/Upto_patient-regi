const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctor_id: { type: Number, unique: true, index: true },
  name: { type: String, required: true, maxlength: 100 },
  specialization: { type: String, required: true, maxlength: 100 },
  contact: { type: String, maxlength: 15 },
  email: { type: String, maxlength: 100, unique: true },

  workingHours: {
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true }    // "17:00"
  },
  slotSize: { type: Number, default: 30 }, 
  breaks: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  ],
  holidays: [{ type: Date }],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-increment doctor_id
doctorSchema.pre("save", async function (next) {
  if (!this.doctor_id) {
    const last = await this.constructor.findOne().sort("-doctor_id");
    this.doctor_id = last ? last.doctor_id + 1 : 1;
  }
  next();
});

module.exports = doctorSchema;   // 👈 export only schema
