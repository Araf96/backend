const validator = require('validator');
const mongoose = require('mongoose');

const logObj = {
    logTime:{
        type: Date,
        default: null
    },
    loggedBy:{
        type: String,
        default: null
    },
    logType:{
        type:String,
        default: null
    },
    logDescription: {
        type: String,
        default: null
    }
}

var LogSchema = mongoose.Schema(logObj);

var Logs = mongoose.model('Logs', LogSchema);

module.exports = {Logs};