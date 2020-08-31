const State = require("../models/state");
const mongoose = require("mongoose");
require("dotenv/config");

module.exports = {
  addstates: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;

        if (!err) {
          const states = new State({
            states: req.body.states,
          });

          states.save((err, states) => {
            if (!err) {
              result.status = status;
              result.result = states;
            } else {
              status = 500;
              result.status = status;
              result.error = "err";
            }
            res.status(status).send(result);
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },
  getstates: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          State.find({}, (err, states) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = states;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },
};
