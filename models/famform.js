const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const famSchema = new Schema({
  place: {
    type: "String",
    // required: true,
  },
  state: "String",
  lga: "String",
  preferredhub: "String",
  address: "String",
  time:"String",
  profile: [{}],
  totalprice: 'Number',
  paymentStatus: 'String'
});

module.exports = mongoose.model("Family", famSchema);
