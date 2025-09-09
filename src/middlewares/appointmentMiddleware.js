const express = require("express");
const router = express.Router();
const { getHospitalConnection } = require("../config/dbManager.js");
const AppoinmentsSchema = require("../models/AppointmentsSchema.js");

async function hospitalMiddleware(req, res, next) {
  try {
    const { hospitalId } = req.params;
    const conn = await getHospitalConnection(hospitalId);

    // Attach Bed model for this hospital DB
    req.hospitalId = hospitalId;
    req.AppoinmentsSchema = conn.models.Appoinments || conn.model("Appoinments", AppoinmentsSchema);

    next();
  } catch (err) {
    res.status(500).json({ error: "DB Connection error: " + err.message });
  }
}

module.exports = hospitalMiddleware;