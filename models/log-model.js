const mongoose = require('mongoose');

const logObj = {
    logTime:{
        type: Date,
        default: null
    },
    loggedBy:{
        type: mongoose.Types.ObjectId,
        required: true
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

var Log = mongoose.model('Log', LogSchema);

module.exports = {Log};