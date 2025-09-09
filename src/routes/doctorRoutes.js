const express = require("express");
const router = express.Router();
const hospitalDbMiddleware = require("../middlewares/hospitalMiddleware.js");

// Apply hospital middleware
router.use("/:hospitalId", hospitalDbMiddleware);

// Add doctor
router.post("/:hospitalId", async (req, res) => {
  try {
    const doctor = new req.Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List doctors
router.get("/:hospitalId/doctors", async (req, res) => {
  try {
    const doctors = await req.Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get doctor by ID
router.get("/:hospitalId/doctors/:id", async (req, res) => {
  try {
    const doctor = await req.Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update doctor
router.put("/:hospitalId/doctors/:id", async (req, res) => {
  try {
    const doctor = await req.Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete doctor
router.delete("/:hospitalId/doctors/:id", async (req, res) => {
  try {
    const doctor = await req.Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
