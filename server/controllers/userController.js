const User = require('../models/userModel');


// Signup user
const signupUser = async (req, res) => {
  const {fullName, email, password} = req.body

  try {
    const user = await User.signup(fullName, email, password);

    res.status(200).json({fullName, email, user});
  } catch (error) {
    res.status(400).json({error: error.message});
  }

}

// Login user
const loginUser = async (req, res) => {
  res.json({ msgs: 'login user' })
}



module.exports = { signupUser, loginUser }