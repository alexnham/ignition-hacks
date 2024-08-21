const Patient = require('../models/patientModel.js')
const mongoose = require('mongoose')

// GET all patients
const getPatients = async (req, res) => {
  try {
    // Newest one first
    const patients = await Patient.find({}) // to filter, put the key and the value pair inside the find (Patient.find({key: value}))
      .sort({
        preferredName: 1,       // Sort by preferredName alphabetically
        dateOfBirth: 1,          // If preferredName is the same, sort by dateOfBirth
        updatedAt: -1          // If preferredName and dateOfBirth are the same, sort by dateUpdated (most recent first)
      });
    res.status(200).json(patients)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// GET a single patient
const getPatient = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID. Get request failed!' })
  }

  try {
    const patient = await Patient.findById(id)

    if (!patient) {
      return res.status(400).json({ error: 'ID not found. Get request failed!' })
    }

    res.status(200).json(patient)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// CREATE a new patient
const createPatient = async (req, res) => {
  // console.log(req.body)
  const { healthcareID, preferredName, dateOfBirth, email, phoneNumber } = req.body;

  // Add doc to db
  try {
    const patient = await Patient.create({ healthcareID, preferredName, dateOfBirth, email, phoneNumber });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

// DELETE an existing patient
const deletePatient = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID. Delete request failed!' })
  }

  try {
    const patient = await Patient.findOneAndDelete({ _id: id })

    if (!patient) {
      return res.status(400).json({ error: 'ID not found! Delete request failed!' })
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}

// UPDATE an existing patient
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid ID. Update request failed' });
  }

  try {
    // Find the patient being updated
    const patientToUpdate = await Patient.findById(id);
    if (!patientToUpdate) {
      return res.status(404).json({ error: 'Patient not found. Update request failed!' });
    }

    // Check if healthcareID is being updated and if it already exists for another patient
    if (updateData.healthcareID && updateData.healthcareID !== patientToUpdate.healthcareID) {
      const existingPatient = await Patient.findOne({ healthcareID: updateData.healthcareID });
      if (existingPatient) {
        return res.status(400).json({ error: 'A patient with this healthcareID already exists' });
      }
    }

    // Update patient details
    const updatedPatient = await Patient.findOneAndUpdate({ _id: id }, updateData, { new: true });
    if (!updatedPatient) {
      return res.status(400).json({ error: 'Update failed!' });
    }

    res.status(200).json(updatedPatient);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPatients,
  getPatient,
  createPatient,
  deletePatient,
  updatePatient
}