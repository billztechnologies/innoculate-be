const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const famSchema = new Schema({
  place: {
    type: "String",
    // required: true,
  },
  type:{
    type:"String",
    required: true,
    trim: true
  },
  state: "String",
  lga: "String",
  preferredhub: "String",
  address: "String",
  time:"String",
  profile: [{}],
  totalprice: {
    type: Number
  },
  paymentStatus: 'String',
  vaccinationStatus: 'String',
  vaccinator:'String',
  startDate: "String",
  dosageNumber: {
    type: Number
  }
});

module.exports = mongoose.model("Family", famSchema);
