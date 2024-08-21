const express = require('express');
const Patient = require('../models/patientModel.js')
const {
  getPatients,
  getPatient,
  createPatient,
  deletePatient,
  updatePatient,
} = require('../controllers/patientController.js')

const router = express.Router()

// GET all the patients
router.get('/', getPatients);

// GET a single patient
router.get('/:id', getPatient);

// POST a new patient
router.post('/', createPatient)

// GET a patient by healthcare ID
// router.get("/healthcare/:healthcareID", getPatientByHealthcareID)

// DELETE an existing patient
router.delete('/:id', deletePatient)

// UPDATE an existing patient
router.patch('/:id', updatePatient)


module.exports = router;