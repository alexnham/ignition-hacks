const Patient = require('../models/patientModel.js')
const mongoose = require('mongoose')

// GET all patients
const getPatients = async (req, res) => {
  const patients = await Patient.find({}).sort({ createdAt: -1 }) // to filter, put the key and the value pair inside the find (Patient.find({key: value}))

  res.status(200).json(patients)
}


// GET a single patient
const getPatient = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such patient'})
  }

  const patient = await Patient.findById(id)

  if (!patient) {
    return res.status(404).json({error: 'No such patient'})
  }

  res.status(200).json(patient)
}


// CREATE a new patient
const createPatient = async (req, res) => {
  // console.log(req.body)
  const { healthcareID, preferredName, email, phoneNumber } = req.body;

  // Add doc to db
  try {
    const patient = await Patient.create({ healthcareID, preferredName, email, phoneNumber });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

// DELETE an existing patient


// UPDATE an existing patient


module.exports = {
  getPatients,
  getPatient,
  createPatient,
}