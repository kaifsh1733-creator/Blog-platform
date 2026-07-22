const express = require('express');
const bcrypts = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const upload = require("../middleware/upload");

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
res.status(200).json({message: 'Login successful', token,
  user: {
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
} });
} catch (err) {
    res.status(500).json({message: 'Server error', error: err.message});
}
});

//User profile

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}); 

// Public User Profile

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Update Profile

router.put("/profile", protect, async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//profile image

router.put(
  "/profile/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.profileImage = req.file.path;

      await user.save();

      res.status(200).json({
        message: "Profile image uploaded",
        profileImage: user.profileImage,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

//remove profile image

router.delete("/profile/image", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.profileImage = "";

    await user.save();

    res.status(200).json({
      message: "Profile image removed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}); 

module.exports = router;