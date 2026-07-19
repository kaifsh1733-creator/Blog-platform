const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    name: {type: String, required: true,},
    email: {type: String,required: true, unique: true,},
    password: {type: String, required: true,},
    profileImage: {type: String,default: "",},
}, { timestamps: true});
module.exports = mongoose.model('User', userschema);