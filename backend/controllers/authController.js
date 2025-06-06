const User = require('../models/User');
const jwt  = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

exports.registerUser = async (req,res) =>{
  const{username, email, password} = req.body;
  try{
    const userExists  = await User.findOne({email});
    if(userExists){
      return res.status(400).json({message: 'User already exists'});
    }
    const user = await User.create({username, email, password});
    if(user){
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }else{
      res.status(400).json({message: 'Invalid user data'});
    }
  }catch (error){
    res.status(500).json({message: error.message});
  }
};

exports.loginUser = async (req,res)=>{
  const {email, password} = req.body;
  try{
    const user  = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }else{
      res.status(401).json({message: 'Invalid email or password'});
    }
  }catch(error){
    res.status(500).json({message: error.message});
  }
};

exports.getUserProfile = async(req,res)=>{
  // req.user is set by the protect middleware
  if(req.user){
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  }else{
    res.status(404).json({message: 'User not found'});
  }
};
