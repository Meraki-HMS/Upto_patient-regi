const BedAssignment = require("../models/BedAssignment");

router.put("/:id/occupy", async (req, res) => {
  try {
    const { patient_id, nurse_id } = req.body; // take from request
    const bed = await Bed.findById(req.params.id);

    if (!bed) return res.status(404).json({ error: "Bed not found" });
    if (bed.is_occupied) return res.status(400).json({ error: "Bed already occupied" });

    bed.is_occupied = true;
    await bed.save();

    // Create assignment record
    const assignment = new BedAssignment({
      patient_id,
      bed_id: bed._id,
      nurse_id,
    });
    await assignment.save();

    res.json({ message: "Bed occupied & assigned", bed, assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id/release", async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);

    if (!bed) return res.status(404).json({ error: "Bed not found" });
    if (!bed.is_occupied) return res.status(400).json({ error: "Bed already free" });

    bed.is_occupied = false;
    await bed.save();

    // Update assignment (set discharge date)
    const assignment = await BedAssignment.findOne({ bed_id: bed._id, discharge_date: null });
    if (assignment) {
      assignment.discharge_date = new Date();
      await assignment.save();
    }

    res.json({ message: "Bed released & assignment closed", bed, assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
