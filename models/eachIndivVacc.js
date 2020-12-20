const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vaccstg = new Schema({
    vaccine_id:{
        type: String,
        required: true
    },
    currstage:{
        type: String,
        required: true
    },
    vaccbatchno: {
        type: String
    },
    dategiven: {
        type: Date,
        required: true
    },
    vaccexp:{
        type: Date,
        required: true
    },
    vaccinator: {
        type: String,
        required: true
    }
}, {strict: true})

const eachIndivSchema = new Schema({
    patientFirstName: {
        type: String,
        required: true,
        trim: true
    },
    patientLastName:{
        type: String,
        required: true,
        trim: true
    },
    firstVaccPhoneNo:{
        type: String,
        required: true,
        trim: true
    },
    patientPhone_no:{
        type: String,
        required: true,
        trim: true
    },
    patientAge:{
        type:Number,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    paymentStatus:{
        type: String,
        required:true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    serviceType:{
        type: String,
        required: true,
        trim: true
    },
    booking_id: {
        type: String,
        trim: true
    },
    next_stage: {
        type: String,
        required: true,
        trim: true
    },
    nextVaccDate: {
        type: Date,
        trim: true
    },
    is_completed: {
        type: Boolean
    },
   vaccstages:[vaccstg]
})

module.exports = mongoose.model("IndivVacc", eachIndivSchema)