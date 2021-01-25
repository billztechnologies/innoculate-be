const Vaccine = require("../models/vaccines");
const mongoose = require("mongoose");
const Myself = require('../models/myform')
const Family = require('../models/famform')
const Corporate = require('../models/corpform')
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
  getvacc:async (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      async (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          await Vaccine.find({}, (err, vaccines) => {
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
  // get one vaccine
  getOneVacc: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      async (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          await Vaccine.findById(req.body.id, (err, vaccine) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = vaccine;
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
  // find nurse bookings in bookings database
  myselfVacc: (req, res)=>{
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      async (err) => {
        let result = {};
        let status = 200;
        let arr =[]
        let filter = ()=>{ req.body.bookings.forEach((book)=>{
          arr.push(book.id)
          return book.id
        })
      }
      filter()
        if (!err) {
         await Myself.find({'_id':arr}, (err, vaccines) => {
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
  },
  famVacc: (req, res)=>{
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      async (err) => {
        let result = {};
        let status = 200;
        let arr =[]
        let filter = ()=>{ req.body.bookings.forEach((book)=>{
          arr.push(book.id)
          return book.id
        })
      }
      filter()
        if (!err) {
          await Family.find({'_id':arr}, (err, vaccines) => {
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
  },
  corpVacc: (req, res)=>{
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      async (err) => {
        let result = {};
        let status = 200;
        let arr =[]
        let filter = ()=>{ req.body.bookings.forEach((book)=>{
          arr.push(book.id)
          return book.id
        })
      }
      filter()
        if (!err) {
          await Corporate.find({'_id':arr}, (err, vaccines) => {
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
