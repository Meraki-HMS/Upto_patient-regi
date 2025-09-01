const express = require("express");
const router = express.Router();
const { getHospitalConnection } = require("../config/dbManager.js");
const BedSchema = require("../models/BedScehma");
const BedAssignmentSchema = require("../models/BedAssignment.js");

async function hospitalMiddleware(req, res, next) {
  try {
    const { hospitalId } = req.params;
    const conn = await getHospitalConnection(hospitalId);

    // Attach Bed model for this hospital DB
    req.Bed = conn.models.Bed || conn.model("Bed", BedSchema);
    req.BedAssignment = conn.models.BedAssignment || conn.model("BedAssignment", BedAssignmentSchema);
    req.hospitalId = hospitalId;

    next();
  } catch (err) {
    res.status(500).json({ error: "DB Connection error: " + err.message });
  }
}

module.exports = hospitalMiddleware;