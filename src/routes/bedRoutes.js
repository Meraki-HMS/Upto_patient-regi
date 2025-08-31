const express = require("express");
const router = express.Router();
const { getHospitalConnection } = require("../config/dbManager.js");
const BedSchema = require("../models/BedScehma");
const hospitalMiddleware = require("../middlewares/hospitalMiddleware.js");

// Middleware to resolve hospital DB dynamically
router.use("/:hospitalId", hospitalMiddleware);

// 1.Add a new bed
router.post("/:hospitalId", async (req, res) => {
  try {
    const { bed_id, ward } = req.body;
    const newBed = new req.Bed({ bed_id, ward });
    await newBed.save();
    res.status(201).json(newBed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. List all beds
router.get("/:hospitalId", async (req, res) => {
  try {
    const beds = await req.Bed.find();
    res.json(beds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Mark bed as occupied
router.put("/:id/occupy", async (req, res) => {
  try {
    const bed = await req.Bed.findById(req.params.id);

    if (!bed) return res.status(404).json({ error: "Bed not found" });
    if (bed.is_occupied) return res.status(400).json({ error: "Bed already occupied" });

    bed.is_occupied = true;
    await bed.save();

    res.json({ message: "Bed occupied", bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Release a bed
router.put("/:id/release", async (req, res) => {
  try {
    const bed = await req.Bed.findById(req.params.id);

    if (!bed) return res.status(404).json({ error: "Bed not found" });
    if (!bed.is_occupied) return res.status(400).json({ error: "Bed already free" });

    bed.is_occupied = false;
    await bed.save();

    res.json({ message: "Bed released", bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5 DELETE /:hospitalCode/beds/:bedId → Delete a bed
router.delete("/:hospitalId/:bedId", async (req, res) => {
  try {
    const { bedId } = req.params;

    // Bed model is already attached via middleware (req.db.Bed or req.Bed)
    const Bed = req.Bed;

    const deletedBed = await Bed.findOneAndDelete({ bed_id: bedId });

    if (!deletedBed) {
      return res.status(404).json({ error: "Bed not found" });
    }

    res.json({ message: "Bed deleted successfully", bed: deletedBed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
