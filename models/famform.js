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
  vaccine: {
    type: "Array",
    // required: true,
  },
  address: "String",
    time:"String",
  profile: [{}],
});

module.exports = mongoose.model("Family", famSchema);
