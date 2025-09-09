// Patient Schema
const PatientSchema = new mongoose.Schema({
  patient_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  contact: String,
  address: String,
  admitted_on: { type: Date, default: Date.now },
  discharged_on: { type: Date },
  bed_id: { type: String, ref: "Bed" },
  is_discharged: { type: Boolean, default: false },
});

hospitalDB.model("Patient", PatientSchema);
