const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const corpSchema = new Schema({
  fullname: {
    type: "String",
    required: true,
  },
  type:{
    type:"String",
    required: true,
    trim: true
  },

  email: {
    type: "String",
    required: true,
    trim: true,
  },

  phone: {
    type: "String",
    required: true,
    trim: true,
  },
  companyDetails:{
    type:Object,
    required:true
  },
  questions:"String",
  vaccinationStatus: 'String',
  vaccinator:{
    type: Number
  },
  startDate: "String",
  dosageNumber: {
    type: Number
  }
});

module.exports = mongoose.model("Corporate", corpSchema);
