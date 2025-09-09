const { getHospitalDb } = require("../config/dbManager");
const PatientSchema = require("../models/Patient");

exports.registerPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, hospitals } = req.body;

    // generate same patient_id for all hospitals (simple example)
    const patientId = "PAT" + Date.now();

    for (const hospitalCode of hospitals) {
      const conn = await getHospitalDb(hospitalCode);
      const Patient = conn.model("Patient", PatientSchema);

      await Patient.create({
        patient_id: patientId,
        name,
        age,
        gender,
        contact,
        address
      });
    }

    res.status(201).json({
      message: "Patient registered in all selected hospitals",
      patient_id: patientId,
      hospitals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
