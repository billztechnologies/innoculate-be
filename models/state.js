const mongoose = require("mongoose");
const Schema = mongoose.Schema;

stateSchema = new Schema({
    states: []
})

module.exports = mongoose.model('States', stateSchema);