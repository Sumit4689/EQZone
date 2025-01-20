const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const userValidationSchema = require('../validation/userValidationSchema')

const SignupPage = asyncHandler(async (req, res) => {
  res.render('loginPage', {
    name: req.body.name || '',
    email: req.body.email || '',
    password: req.body.password || '',
    rightPanelActive: true,
});
});

const registerUser = asyncHandler(async (req, res) => {
  const validation = userValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors[0].message });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user' });
  }
});

module.exports = {registerUser,SignupPage} 
