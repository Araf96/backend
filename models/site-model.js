const validator = require('validator');
const mongoose = require('mongoose');

const SiteObj = {
    name:{
        type: String,
        required: [true, "NAME is required"],
        default: null
    },
    region:{
        type: String,
        required: [true, "REGION is required"],
        default: null
    },
    description: {
        type: String,
        required: [true, "DESCRIPTION is reuquired"]
    },
    coordinates:{
        type:{
            lat: {type:Number, required: true},
            lng: {type:Number, required: true}
        },
        required:[true, "LOCATION is required"]
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        required: [true, "Invalid userid"],
        ref:'User'
    }
}

var SiteSchema = mongoose.Schema(SiteObj);

var Site = mongoose.model('Site', SiteSchema);

module.exports = {Site};