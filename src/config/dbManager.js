// src/config/dbFactory.js
const mongoose = require('mongoose');
const BedSchema = require('../models/BedScehma');

const connections = {}; // { HOSP001: Connection }

const dbUris = {
  HOSP001: process.env.DB_HOSP001 || 'mongodb://127.0.0.1:27017/hospital_HOSP001',
  HOSP002: process.env.DB_HOSP002 || 'mongodb://127.0.0.1:27017/hospital_HOSP002',
  HOSP003: process.env.DB_HOSP003 || 'mongodb://127.0.0.1:27017/hospital_HOSP003',
};

async function getHospitalConnection(hospitalCode) {
  if (!hospitalCode) throw new Error('hospitalCode required');

  if (connections[hospitalCode]) return connections[hospitalCode];

  const uri = dbUris[hospitalCode];
  if (!uri) throw new Error(`No DB URI configured for ${hospitalCode}`);

  // createConnection returns a connection specific to that database
  const conn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // register models only once per connection
  if (!conn.models || !conn.models.Bed) {
    conn.model('Bed', BedSchema);
  }

  connections[hospitalCode] = conn;
  // console.log(`Connected to DB for ${hospitalCode}: ${uri}`);
  return conn;
}

module.exports = { getHospitalConnection, dbUris };
