const express = require("express");
const router = express.Router();
const hospitalMiddleware = require("../middlewares/hospitalMiddleware.js");

// Middleware to resolve hospital DB dynamically
router.use("/:hospitalId", hospitalMiddleware);

// POST /assignments → Assign a bed to a patient
router.post("/:hospitalId", async (req, res) => {
  try {
    const { patient_id, bed_id, nurse_id } = req.body;

    const Bed = req.Bed; 
    const BedAssignment = req.BedAssignment;

    // Check bed availability
    const bed = await Bed.findOne({ bed_id: bed_id });
    if (!bed) return res.status(404).json({ error: "Bed not found" });
    if (bed.is_occupied) return res.status(400).json({ error: "Bed already occupied" });

    // Create assignment
    const assignment = await BedAssignment.create({
      patient_id: patient_id,
      bed_id: bed._id,   // store ObjectId internally
      nurse_id: nurse_id
  });
    await assignment.save();

    // Mark bed as occupied
    bed.is_occupied = true;
    await bed.save();

    res.status(201).json({ message: "Bed assigned successfully", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /assignments/:id/discharge → Discharge patient & free bed
router.put("/:hospitalId/:id/discharge", async (req, res) => {
  try {
    const Bed = req.Bed;
    const BedAssignment = req.BedAssignment;

    const assignment = await BedAssignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    if (assignment.discharge_date) return res.status(400).json({ error: "Already discharged" });

    // Free bed
    const bed = await Bed.findById(assignment.bed_id);
    if (bed) {
      bed.is_occupied = false;
      await bed.save();
    }

    assignment.discharge_date = new Date();
    await assignment.save();

    res.json({ message: "Patient discharged, bed freed", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//These following routes will be checked after patinet and nurse module is implemented
// GET /assignments/active → List all active bed assignments
router.get("/:hospitalId/active", async (req, res) => {
  try {
    const BedAssignment = req.BedAssignment;

    const activeAssignments = await BedAssignment.find({ discharge_date: null })
      .populate("patient_id", "name age")
      .populate("bed_id", "bed_id ward")
      .populate("nurse_id", "name");

    res.json(activeAssignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /assignments/history/patient/:patientId → All past assignments for a patient
router.get("/history/patient/:patientId", async (req, res) => {
  try {
    const BedAssignment = req.BedAssignment;

    const history = await BedAssignment.find({ patient_id: req.params.patientId })
      .populate("bed_id", "bed_id ward")
      .populate("nurse_id", "name");

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
