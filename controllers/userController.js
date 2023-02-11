const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const User = require('../models/user')
const UserSettings = require('../models/user_settings')
const Order = require('../models/order')
const firebaseadmin = require('../config/firebase')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create Setttings record 
  const usersetting = await UserSettings.create({})

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    settings: usersetting
  })
  

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      setting: user.settings
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email }).populate('settings')

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      settings: user.settings,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
}

const checkFreePlan = asyncHandler(async (req, res) => {
  const { uid } = req.body

  const planid = '63e25f9fc2886301860c8ebf'
  const order = await Order.findOne({ 'uid': uid})
   
  if(!order)
  {     
    await Order.create({
        planid: mongoose.Types.ObjectId(planid),
        remarks: 'Free Plan',
        amount: 0,
        frequency: 365,            
        uid: uid,
        status: 'ACTIVE'
    })

    res.status(201).json({status:'success',message:'Check Done'}) 
  }

  res.status(201).json({status:'error',message:'Check Failed'}) 
})

const getAllUsers = asyncHandler(async (req, res) => {
  firebaseadmin.auth().listUsers(1000).then((listUsersResult) => { 
      let users = []
      listUsersResult.users.forEach(user => {        
        users.push({
          'id': user.uid,
          'email': user.email,
          'displayName': user.displayName,
          'creationTime' : user.metadata.creationTime,
          'lastSignInTime': user.metadata.lastSignInTime,
          //'providerId' : user.providerData[0].UserInfo.providerId
        })
      });      
      res.status(201).json(users) 
  })
  .catch(function (error) {
      console.log('Oh no! Firebase listUsers Error:', error);
  });
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  checkFreePlan,
  getAllUsers
}