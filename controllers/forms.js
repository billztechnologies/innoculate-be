const Myself = require("../models/myform");
const Family = require("../models/famform");
const Corporate = require("../models/corpform");
const mongoose = require("mongoose");
require("dotenv/config");
const jwt = require("jsonwebtoken");
const EmailService = require("../services/emailServices");

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
            type: "individual",
            place: req.body.radioservice,
            state: req.body.state,
            lga: req.body.lga,
            hub: req.body.preferredhub,
            vaccine: req.body.vaccines,
            paymentStatus: req.body.paymentStatus,
            vaccinationStatus: "unassigned",
            totalprice: req.body.totalprice,
            brandschosen: req.body.brandschosen,
            timestamp: new Date().toISOString(),
            profile: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              gender: req.body.gender,
              email: req.body.email,
              phone: req.body.phone,
              time: req.body.time,
              age: req.body.age,
              address: {
                address: req.body.address,
                zipcode: req.body.zipcode,
              },
            },
          });
          myself.save((err, myself) => {
            if (!err) {
              result.status = 201;
              result.result = myself;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            return res.status(status).send(result);
          });
        } else {
          status = 500;
          result.status = status;
          result.error = "err";
         return res.status(status).send(result);
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
            type: "family",
            place: req.body.radioservicefam,
            state: req.body.statefam,
            lga: req.body.lgafam,
            hub: req.body.preferredhubfam,
            time: req.body.timefam,
            address: req.body.addressfam,
            profile: req.body.profile,
            totalprice: req.body.totalprice,
            paymentStatus: req.body.paymentStatus,
            vaccinationStatus: "unassigned",
            timestamp: new Date().toISOString(),
            startDate: req.body.date,
          });

          family.save((err, family) => {
            if (!err) {
              result.status = 200;
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
  addcorp: async (req, res) => {
    const corporate = new Corporate({
      type: "corporate",
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      questions: req.body.questions,
      companyDetails: req.body.companydetails,
      vaccinationStatus: "unassigned",
      timestamp: new Date().toISOString(),
      vaccinator: req.body.vaccinator,
      startDate: req.body.date,
      dosageNumber: req.body.dosageNumber,
    });
    let result = {}
        try{
          const corpuser = await corporate.save();
          result.result = corpuser
          res.status(200).send(result)
        } catch(err){
          res.status(400).send("corporate booking not saved")
        }
  },
  // get all individual bookings and dort according to date of creation

  getAllMyself: async (req, res) => {
    let result = {}
        try {
          Myself.find({}, null, { sort: { timestamp: -1 } }, (err, myself) => {
            if (!err) {
              result.status = 200;
              result.result = myself;
              res.status(200).send(result)
            } else {
              result.status = 500;
              result.error = err;
              res.status(500).send(result.error);
            }
           
          });
        } catch(err){
          status = 401;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
  },
  getAllFamily: (req, res) => {
    let result ={}
        try {
          Family.find({}, null, { sort: { timestamp: -1 } }, (err, family) => {
            if (!err) {
              result.status = 200;
              result.error = err;
              result.result = family;
            } else {
              result.status = 500;
              result.error = err;
            }
            res.status(result.status).send(result);
          });
        } catch(err) {
          result.status = 401;
          result.error = err;
          res.status(result.status).send(result);
        }
  },
  getAllCorp: (req, res) => {
    let result = {}
       try {
          Corporate.find(
            {},
            null,
            { sort: { timestamp: -1 } },
            (err, corporate) => {
              if (!err) {
                result.status = 200;
                result.error = err;
                result.result = corporate;
              } else {
                result.status = 500;
                result.error = err;
              }
              res.status(result.status).send(result);
            }
          );
        } catch(err) {
          status = 401;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
  },
  getAllStarted: async (req, res) => {
    let individual = []
    let fam =[]
    let corp = []

    let result = {}
        try {
          await Myself.find(
            {
              vaccinationStatus: "started"
            },
            (err, indivStarted) => {
              let result ={}
             
              if (!err) {
               individual = indivStarted
              } else {
                console.log("bad")
                individual = []
              };
            })
              await Family.find(
                {
                  vaccinationStatus: "started"
                },
                (err, started) => {
                  let result ={}
                  if (!err) {
                    fam = started
                  } else {
                    fam = []
                  };
                })
                 await Corporate.find(
                    {
                      vaccinationStatus: "started" 
                    },
                    (err, started) => {
                      let result ={}
                      if (!err) {
                        corp = started
                      } else {
                        corp = []
                      };
              
            }
          );
          let all = individual.concat(fam).concat(corp)
          result.bookingStarted = all.length
          res.status(200).json({result})
        } catch(err) {
          res.status(404).send("vaccination bookings that have been started were not found");
        }
  },
  // get all finished bookings
  getAllFinished: async (req, res) => {
    let individual = []
    let fam =[]
    let corp = []

    let result = {}
        try {
          await Myself.find(
            {
              vaccinationStatus: "finished"
            },
            (err, indiv) => {
              let result ={}
             
              if (!err) {
               individual = indiv
              } else {
                console.log("bad")
                individual = []
              };
            })
              await Family.find(
                {
                  vaccinationStatus: "finished"
                },
                (err, famFinished) => {
                  let result ={}
                  if (!err) {
                    fam = famFinished
                  } else {
                    fam = []
                  };
                })
                 await Corporate.find(
                    {
                      vaccinationStatus: "finished" 
                    },
                    (err, corpFinished) => {
                      let result ={}
                      if (!err) {
                        corp = corpFinished
                      } else {
                        corp = []
                      };
              
            }
          );
          let all = individual.concat(fam).concat(corp)
          result.bookingFinished = all.length
          res.status(200).json({result})
        } catch(err) {
          res.status(404).send("vaccination bookings that have been finished were not found");
        }
  },
  // Amount of income made overtime

  getIncome: async (req, res) => {
    myprices = [];
    famprices = [];
        try{
          let mytotal = await Myself.find(
            { paymentStatus: "paid" },
            (err, myself) => {
              myself.forEach((booking) => {
                myprices.push(booking.totalprice);
              });
            }
          );
          let famtotal = await Family.find(
            { paymentStatus: "paid" },
            (err, family) => {
              family.forEach((booking) => {
                famprices.push(booking.totalprice);
              });
            }
          );
          let result = {}
          total = myprices.concat(famprices);
          result.result = total
          res.status(200).send(result);
        } catch(err) {
         res.status(400).send("total income not found")
        }
    },
  // total  number of shots/dosages that have been given
  getShots: async (req, res) => {
        let total = null;
        try {
          myshots = [];
          famshots = [];
          let Myshots = await Myself.find({}, (err, myself) => {
            myself.forEach((booking) => {
              booking.vaccine.forEach((vacc) => {
                myshots.push(vacc.eachdose.length);
              });
            });
          });
          let famtotal = await Family.find(
            { paymentStatus: "paid" },
            (err, family) => {
              family.forEach((booking) => {
                booking.profile.forEach((prof) => {
                  prof.vaccines.forEach((dose) => {
                    famshots.push(dose.eachdose.length);
                  });
                });
              });
            }
          );
          total = myshots.concat(famshots);
          let result = {}
          result.result = total;
          res.status(200).send(result);
        } catch(err) {
          res.status(404).send('No shots found');
        }
  },
};
