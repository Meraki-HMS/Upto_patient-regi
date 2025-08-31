const express = require("express");
const router = express.Router();
const { getHospitalConnection } = require("../config/dbManager.js");
const BedSchema = require("../models/BedScehma");

async function hospitalMiddleware(req, res, next) {
  try {
    const { hospitalId } = req.params;
    const conn = await getHospitalConnection(hospitalId);

    // Attach Bed model for this hospital DB
    req.Bed = conn.model("Bed", BedSchema);
    req.hospitalId = hospitalId;

    next();
  } catch (err) {
    res.status(500).json({ error: "DB Connection error: " + err.message });
  }
}

module.exports = hospitalMiddleware;