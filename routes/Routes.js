const express = require('express');
const bcrypts = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//Register route
router.post('/register' , async (req,res) => {try{ 
    const {name,email,password } =
    req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message: 'User already exists'});
    }
    const hashedpassword = await 
bcrypts.hash(password ,10);
const newUser = await User.create({name, email,password: hashedpassword,});
res.status(201).json({message: 'User created successfully', UseerId: newUser ._id });
} catch (err) {
    res.status(500).json({message: 'Server error', error: err.message});
}
});
//login route
router.post('/login' , async (req, res) => {try{ 
    const {email,password } =
    req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const isMatch = await 
bcrypts.compare(password , user.password);
if (!isMatch) { return res.status(400).json({message:'Invalid email or password'});
}
const token = jwt.sign({id: user ._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
res.status(200).json({message: 'Login successful', token, user: {userId: user ._id, name: user.name, email: user.email,}, });
} catch (err) {
    res.status(500).json({message: 'Server error', error: err.message});
}
});

module.exports = router;