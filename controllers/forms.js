const Myself = require("../models/myform");
const Family = require("../models/famform");
const Corporate = require("../models/corpform");
const mongoose = require("mongoose");
require("dotenv/config");
const jwt = require("jsonwebtoken");
const EmailService = require('../services/emailServices')


module.exports = {
  addmy: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;

        if (!err) {
          const myself = new Myself({
            place: req.body.radioservice,
            state: req.body.state,
            lga: req.body.lga,
            hub: req.body.preferredhub,
            vaccine: req.body.vaccines,
            paymentStatus: req.body.paymentStatus,
            totalprice: req.body.totalprice,
            brandschosen: req.body.brandschosen,
            profile:{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            time: req.body.time,
            age: req.body.age,
            address: {
              address: req.body.address,
              zipcode: req.body.zipcode
            }
            }
          });
          myself.save((err, myself) => {
            if (!err) {
              result.status = status;
              result.result = myself;
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
          result.error = "err";
          res.status(status).send(result);
        }
      }
    );
  },
  addfam: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;

        if (!err) {
          const family = new Family({
            place: req.body.radioservice,
            state: req.body.statefam,
            lga: req.body.lgafam,
            hub: req.body.preferredhubfam,
            vaccine: req.body.vaccinefam,
            time: req.body.timefam,
            address: req.body.addressfam,
            profile: req.body.profile,
          });

          family.save((err, family) => {
            if (!err) {
              result.status = status;
              result.result = family;
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
  addcorp: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          const corporate = new Corporate({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            questions: req.body.questions,
            companyDetails: req.body.companydetails,
          });

          corporate.save((err, corporate) => {
            if (!err) {
              result.status = status;
              result.result = corporate;
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
