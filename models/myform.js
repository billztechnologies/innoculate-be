const mongoose = require('mongoose');
const Schema = mongoose.Schema

const mySchema = new Schema({
  place: {
    type: "String",
    required: true,
  },
  state: "String",
  lga: "String",
  hub: "String",
  vaccine:[],
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
    time: "String",
    age: "Number",
    address: {
      address: "String",
      zipcode: "String",
    },
  },
  paymentStatus: 'String'
});

module.exports = mongoose.model("Myself", mySchema);