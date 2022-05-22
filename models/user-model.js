const validator = require('validator');
const mongoose = require('mongoose');

const UserObj = {
    firstName:{
        type: String,
        required: [true, "Field FIRST NAME is required"],
        default: null
    },
    lastName:{
        type: String,
        required: [true, "Field LAST NAME is required"],
        default: null
    },
    email: {
        type: String,
        unique: [true,"This EMAIL ADDRESS is already in use"],
        required: [true, "Email id is reuquired"],
        validate: [validator.isEmail, "Invalid email id"]
    },
    password:{
        type:String,
        minLength:[5,'Given PASSWORD is shorter than minimum length (5)'],
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    profileImage: {
        type: String,
        default: null
    },
    signupDate:{
        type: Date,
        default: null
    },
    activationDate:{
        type: Date,
        default: null
    }
}

var UserSchema = mongoose.Schema(UserObj);

var User = mongoose.model('User', UserSchema);

module.exports = {User};