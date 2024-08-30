const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^.+@.+\..+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Static signup method
userSchema.statics.signup = async function (fullName, email, password) {

  // Validation
  if (!fullName || !email || !password) {
    throw Error('All fields must be filled');
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid!");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough")
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ fullName, email, password: hash });

  return user;
};

module.exports = mongoose.model('User', userSchema);
