const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Please add a name']
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please add a password']
    },
    role:{
        type:String,
        enum:['PARTICIPANT','ADMIN','HEAD'],
        default:'PARTICIPANT'
    },
    isBlocked: { type: Boolean, default: false },
    department: { type: String } // Optional: specific to heads
},{timestamps:true});//AUTOMATICALLY ADDS CREATED AT AND UPDATED AT FIELDS
module.exports = mongoose.model('User',UserSchema);