const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_CONFIG = {
  algorithm: 'HS256',
  expiresIn: '30d'
};
const generateToken = (payload) =>{
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, JWT_CONFIG);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [JWT_CONFIG.algorithm] });
};

const validateAuthInput = (req, res, next) => { //Middleware part
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  
  next();
};
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if(!authHeader?.startsWith('Bearer ')){
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.user.id);
    if(!user){
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch(err){
    console.error('Authentication error:', err.message);
    
    let message = 'Invalid token';
    if(err.name === 'TokenExpiredError'){message = 'Token expired'};
    if(err.name === 'JsonWebTokenError'){message = 'Malformed token'};
    
    res.status(401).json({ success: false, message });
  }
};


const registerUser = async (req, res) => {
  try {
    if(await User.exists({ username: req.body.username })){
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      role: 'user'
    });

    const token = generateToken({
      user: {
        id: user._id,
        role: user.role
      }
    });

    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch(err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user){
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if(!isMatch){
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({
      user: {
        id: user._id,
        role: user.role
      }
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch(err){
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const loginAdmin = async (req, res) => {
  try{
    if(req.body.username !== 'admin') {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }

    let admin = await User.findOne({ username: 'admin' });
    if(!admin){
      admin = await User.create({
        username: 'admin',
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'defaultAdminPass123!',
        role: 'admin'
      });
    }

    const isMatch = await admin.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken({
      user: {
        id: admin._id,
        role: admin.role
      }
    });

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Admin login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


const debugSecret = (req, res) => {
  res.json({
    success: true,
    env: {
      JWT_SECRET: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
      NODE_ENV: process.env.NODE_ENV
    },
    config: JWT_CONFIG,
    serverTime: new Date().toISOString()
  });
};
const debugVerify = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.user.id);

    res.json({
      success: true,
      tokenValid: true,
      userExists: !!user,
      decoded,
      user: user ? {
        id: user._id,
        username: user.username,
        role: user.role
      } : null
    });
  } catch (err) {
    res.json({
      success: false,
      tokenValid: false,
      error: err.message,
      errorType: err.name
    });
  }
};

module.exports = {
  validateAuthInput,
  authenticate,
  registerUser,
  loginUser,
  loginAdmin,
  debugSecret,
  debugVerify
};