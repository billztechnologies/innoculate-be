const Vaccine = require("../models/vaccines");
const mongoose = require("mongoose");
const Myself = require('../models/myform')
require("dotenv/config");

module.exports = {
  addvacc: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;

        if (!err) {
          const vaccine = new Vaccine({
            name: req.body.vaccname,
            description: req.body.vaccdes,
          });

          vaccine.save((err, vaccine) => {
            if (!err) {
              result.status = status;
              result.result = vaccine;
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
  getvacc: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          Vaccine.find({}, (err, vaccines) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = vaccines;
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
  myselfVacc: (req, res)=>{
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          Myself.find({'_id':{$in: req.body.bookings}}, (err, vaccines) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = vaccines
              console.log(vaccines)
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
  }
};
