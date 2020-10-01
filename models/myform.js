const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doseSchema = new Schema({
  vaccbatchno: String,
  vaccstage: Number,
  vaccexp: Date,
  dategiven: Date,
  vaccinator: String,
});
const vaccSchema = new Schema({
  _id: String,
  name: String,
  eachdose: [doseSchema],
});
const brandSchema = new Schema({
  name: String,
  price: Number,
});
const mySchema = new Schema({
  place: {
    type: "String",
    required: true,
  },
  type: {
    type: "String",
    required: true,
    trim: true,
  },
  state: "String",
  lga: "String",
  hub: "String",
  vaccine: [vaccSchema],
  profile: {
    firstname: {
      type: "String",
      required: true,
      trim: true,
    },
    lastname: {
      type: "String",
      required: true,
      trim: true,
    },
    email: {
      type: "String",
      required: true,
      trim: true,
    },
    gender: {
      type: "String",
      required: true,
      trim: true,
    },
    phone: {
      type: "String",
      required: true,
      trim: true,
    },
    time: Date,
    age: Number,
    address: {
      address: "String",
      zipcode: "String",
    },
  },
  brandschosen: [brandSchema],
  totalprice: "Number",
  paymentStatus: "String",
  vaccinationStatus: "String",

  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Myself", mySchema);
