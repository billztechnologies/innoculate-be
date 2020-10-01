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

const profileSchema = new Schema({
  firstname: String,
  lastname: String,
  gender: String,
  phone: Number,
  age: Number,
  email: String,
  vaccines: [vaccSchema],
  brandschosen: [brandSchema],
});
const famSchema = new Schema({
  place: {
    type: "String",
    // required: true,
  },
  type: {
    type: "String",
    required: true,
    trim: true,
  },
  state: "String",
  lga: "String",
  preferredhub: "String",
  address: "String",
  time: "String",
  profile: [profileSchema],
  totalprice: {
    type: Number,
  },
  vaccinationStatus: "String",
  paymentStatus: "String",
  vaccinator: "String",
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Family", famSchema);
