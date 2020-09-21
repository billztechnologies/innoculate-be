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
  vaccinationStatus: 'String',
  paymentStatus: 'String',
  vaccinator:'String',
});

module.exports = mongoose.model("Family", famSchema);
