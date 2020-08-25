const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vaccSchema = new Schema({
  name: {
    type: "String",
    trim: true,
  },
  description: {
    type: "Object",
  },
});

module.exports = mongoose.model("Vaccines", vaccSchema);
