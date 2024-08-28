const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid function

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  patientID: {
    type: String,
    default: uuidv4, // Automatically generate a UUID for internal use
    unique: true // Ensure patientId is unique
  },
  healthcareID: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure healthcareId is unique
    uppercase: true,
    match: [/^[A-Za-z0-9\s-]+$/, 'Please enter a valid healthcare ID'] // Customize regex to fit specific format
  },
  // firstName: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  // lastName: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  preferredName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date, // YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DD
    required: true // You can adjust this based on your needs
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/^.+@.+\..+$/, 'Please enter a valid email address']
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
    match: [/^\+?[0-9]*$/, 'Please enter a valid phone number with optional international code. Use the format: +1234567890 or 1234567890.'],
  },
  phoneNumberExtension: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    // trim: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
})

module.exports = mongoose.model('Patient', patientSchema);
