const express = require('express');
const Hospital = require("../models/Hospital.js");
const Bed = require("../models/BedScehma.js");
const { getHospitalConnection } = require("../config/dbManager.js");

const router = express.Router();


// 1. Create new hospital and generate beds
router.post("/", async (req, res) => {
  try {
    const { name, address, totalRooms, totalBeds, facilities, rooms } = req.body;

    // Step 1: Create hospital
    const newHospital = new Hospital({
      name,
      address,
      totalRooms,
      totalBeds,
      facilities,
      rooms,
      availableBeds: totalBeds, // initially all beds available
    });

    const savedHospital = await newHospital.save();
    const conn = await getHospitalConnection(savedHospital.hospitalCode);

    // Step 2: Generate beds for each room
    let bedDocs = [];
    rooms.forEach(room => {
      for (let i = 1; i <= room.totalBeds; i++) {
        bedDocs.push({
          bed_id: `${savedHospital.hospitalId}-${room.type}-${i}`,
          ward: room.type, 
          hospitalId: savedHospital.hospitalId,
          is_occupied: false
        });
      }
    });
    // console.log("Rooms received:", rooms);
    // console.log("Beds to insert:", bedDocs);

    // Step 3: Insert all beds in Bed collection
    if (bedDocs.length > 0) {
      await Bed.insertMany(bedDocs);
    }

    res.status(201).json({ hospital: savedHospital, bedsCreated: bedDocs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 2. Get hospital details by ID
router.get("/:hospitalId", async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ hospitalId: req.params.hospitalId });
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get available beds in a hospital
router.get("/:hospitalId/available-beds", async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ hospitalId: req.params.hospitalId });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Calculate total available beds across all rooms
    const totalAvailableBeds = hospital.rooms.reduce(
      (sum, room) => sum + (room.availableBeds || 0),
      0
    );

    res.json({
      hospital: hospital.name,
      availableBeds: totalAvailableBeds,
      roomWise: hospital.rooms.map(r => ({
        roomNumber: r.roomNumber,
        type: r.type,
        availableBeds: r.availableBeds
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
