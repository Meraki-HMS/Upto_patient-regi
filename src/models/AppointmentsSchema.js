const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: Number, unique: true },

  patientId: { type: Number, required: true }, // manual patient ID
  doctorId: { type: Number, required: true },  // manual doctor ID
  receptionistId: { type: mongoose.Schema.Types.ObjectId, ref: "Receptionist" },

  appointment_type: { type: String, enum: ["Manual", "Online"], required: true },
  appointment_date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  reason: { type: String },

  status: { 
    type: String, 
    enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], 
    default: "Scheduled" 
  },

  createdAt: { type: Date, default: Date.now }
});

// Auto-increment appointment_id
appointmentSchema.pre("save", async function (next) {
  if (!this.appointment_id) {
    const last = await this.constructor.findOne().sort("-appointment_id");
    this.appointment_id = last ? last.appointment_id + 1 : 1;
  }

  // auto calculate endTime
  if (this.startTime) {
    const [hours, minutes] = this.startTime.split(":").map(Number);
    let endHour = hours;
    let endMin = minutes + 30;

    if (endMin >= 60) {
      endHour += Math.floor(endMin / 60);
      endMin = endMin % 60;
    }

    this.endTime = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
  }

  next();
});

// Prevent double booking: same doctor, date & slot
appointmentSchema.index(
  { doctorId: 1, appointment_date: 1, startTime: 1 },
  { unique: true }
);

module.exports = appointmentSchema;   // ⬅️ Export schema only
