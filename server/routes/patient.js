const express = require('express');
const Patient = require('../models/patientModel.js')
const {
  getPatients,
  getPatient,
  createPatient,
} = require('../controllers/patientController.js')

const router = express.Router()

// GET all the patients
router.get('/', getPatients);

// GET a single patient
router.get('/:id', getPatient);

// POST a new patient
router.post('/', createPatient)

// DELETE an existing patient
router.delete('/:id', (req, res) => {
  res.json({ msgs: 'DELETE an existing patient' })
})

// UPDATE an existing patient
router.patch('/:id', (req, res) => {
  res.json({ msgs: 'UPDATE an existing patient' })
})


module.exports = router;