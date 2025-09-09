const express = require("express");
const router = express.Router();
const appointmentsMiddleware = require("../middlewares/appointmentMiddleware.js");
const appointmentController = require("../controllers/appointmentController.js");

// apply middleware
router.use("/:hospitalId", appointmentsMiddleware);

// Create appointment
// 📌 Book an appointment
router.post("/:hospitalId/book", appointmentController.bookAppointment);

// 📌 Get available slots for a doctor
router.get("/:hospitalId/slots", appointmentController.getAvailableSlots);


// Get appointment by ID
router.get("/:hospitalId/appointments/:id", async (req, res) => {
  try {
    const appt = await req.Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment
router.put("/:hospitalId/appointments/:id", async (req, res) => {
  try {
    const appt = await req.Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel appointment
router.delete("/:hospitalId/appointments/:id", async (req, res) => {
  try {
    const appt = await req.Appointment.findByIdAndDelete(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
