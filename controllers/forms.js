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
            type: 'individual',
            place: req.body.radioservice,
            state: req.body.state,
            lga: req.body.lga,
            hub: req.body.preferredhub,
            vaccine: req.body.vaccines,
            vaccinator:req.body.vaccinator,
            startDate: req.body.date,
            dosageNumber: req.body.dosageNumber,
            paymentStatus: req.body.paymentStatus,
            vaccinationStatus: 'unassigned',
            totalprice: req.body.totalprice,
            brandschosen: req.body.brandschosen,
            timestamp: new Date().toISOString(),
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
            type: 'family',
            place: req.body.radioservicefam,
            state: req.body.statefam,
            lga: req.body.lgafam,
            hub: req.body.preferredhubfam,
            time: req.body.timefam,
            address: req.body.addressfam,
            profile: req.body.profile,
            totalprice: req.body.totalprice,
            paymentStatus: req.body.paymentStatus,
            vaccinationStatus: 'unassigned',
            timestamp: new Date().toISOString(),
            vaccinator:req.body.vaccinator,
            startDate: req.body.date,
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
            type: 'corporate',
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            questions: req.body.questions,
            companyDetails: req.body.companydetails,
            vaccinationStatus: 'unassigned',
            timestamp: new Date().toISOString(),
            vaccinator:req.body.vaccinator,
            startDate: req.body.date,
            dosageNumber: req.body.dosageNumber,
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
  getAllMyself: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
            Myself.find({}, (err, myself) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = myself;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            });
          } else {
            status = 401;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
      })
    },
    getAllFamily: (req, res) => {
      mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err) => {
          let result = {};
          let status = 200;
          if (!err) {
              Family.find({}, (err, family) => {
                if (!err) {
                  result.status = status;
                  result.error = err;
                  result.result = family;
                } else {
                  status = 500;
                  result.status = status;
                  result.error = err;
                }
                res.status(status).send(result);
              });
            } else {
              status = 401;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            }
        })
      },
      getAllCorp: (req, res) => {
        mongoose.connect(
          process.env.DB_CONNECTION,
          { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
          (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                Corporate.find({}, (err, corporate) => {
                  if (!err) {
                    result.status = status;
                    result.error = err;
                    result.result = corporate;
                  } else {
                    status = 500;
                    result.status = status;
                    result.error = err;
                  }
                  res.status(status).send(result);
                });
              } else {
                status = 401;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
              }
          })
        },
        getAllStarted: (req, res) => {
          mongoose.connect(
            process.env.DB_CONNECTION,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            (err) => {
              let result = {};
              let status = 200;
              if (!err) {
                  Myself.find({
                    $text: {
                      $search: "started"
                  }
                  }, (err, started) => {
                    if (!err) {
                      result.status = status;
                      result.error = err;
                      result.result = started;
                    } else {
                      status = 500;
                      result.status = status;
                      result.error = err;
                    }
                    res.status(status).send(result);
                  });
                } else {
                  status = 401;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                }
            })
          }
};
