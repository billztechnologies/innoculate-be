const Myself = require("../models/myform");
const mongoose = require("mongoose");
const Family = require("../models/famform");
const Corporate = require("../models/corpform");
const Vaccine = require("../models/vaccines");
const User = require("../models/users");

module.exports = {
  updateMy: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = {
            _id: req.body._id,
          };
          let other = {};
          console.log(filter);
          let update = { paymentStatus: req.body.paymentStatus };
          if (!err) {
            let doc = await Myself.findOneAndUpdate(filter, update, {
              new: true,
            });
            doc.save();

            console.log(doc);
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  updateMyAdmin: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = {
            _id: req.body._id,
          };
          let other = {};
          console.log(filter);
          let update = { paymentStatus: req.body.paymentStatus };
          if (!err) {
            let doc = await Myself.findOneAndUpdate(filter, update, {
              new: true,
            });

            doc.save();

            console.log(doc);
            res.status(status).send(result);
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },

  updateFam: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;

          let filter = {
            _id: req.body._id,
          };
          console.log(filter);
          let update = { paymentStatus: req.body.paymentStatus };
          if (!err) {
            let doc = await Family.findOneAndUpdate(filter, update, {
              new: true,
            });

            doc.save();

            console.log(doc);
            res.status(status).send(result);
          } else {
            let status = 500;
            result.status = status;
            result.result = err;
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  updateNurseBooking: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = {
            name: req.body.name,
            email: req.body.email,
            state: req.body.state,
            localgovt: req.body.localgovt,
          };
          let newassigned_id = req.body.newassigned_id;
          console.log(filter);

          if (!err) {
            let assigned = await Myself.findByIdAndUpdate(
              newassigned_id,
              { vaccinationStatus: "assigned" },
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
            console.log(assigned);
            let nurse = await User.findOneAndUpdate(
              filter,
              {
                $push: {
                  bookings: { id: newassigned_id, type: assigned.type },
                },
                done: false,
              },
              {
                new: true,
              }
            );

            if (nurse !== null) {
              nurse.save();
            } else {
              console.log(null);
            }

            console.log(nurse);
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  // update family nurse object
  updateNurseFamBooking: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = {
            name: req.body.name,
            email: req.body.email,
            state: req.body.state,
            localgovt: req.body.localgovt,
          };
          let newassigned_id = req.body.newassigned_id;
          console.log(filter);

          if (!err) {
            let assigned = await Family.findByIdAndUpdate(
              newassigned_id,
              { vaccinationStatus: "assigned" },
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
            console.log(assigned);
            let nurse = await User.findOneAndUpdate(
              filter,
              {
                $push: {
                  bookings: { id: newassigned_id, type: assigned.type },
                },
                done: false,
              },
              {
                new: true,
              }
            );

            if (nurse !== null) {
              nurse.save();
            } else {
              console.log(null);
            }

            console.log(nurse);
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  // update corporate nurse booking with id and type
  updateNurseCorpBooking: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = {
            name: req.body.name,
            email: req.body.email,
            state: req.body.state,
            localgovt: req.body.localgovt,
          };
          let newassigned_id = req.body.newassigned_id;
          console.log(filter);

          if (!err) {
            let assigned = await Corporate.findByIdAndUpdate(
              newassigned_id,
              { vaccinationStatus: "assigned" },
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
            console.log(assigned);
            let nurse = await User.findOneAndUpdate(
              filter,
              {
                $push: {
                  bookings: { id: newassigned_id, type: assigned.type },
                },
                done: false,
              },
              {
                new: true,
              }
            );

            if (nurse !== null) {
              nurse.save();
            } else {
              console.log(null);
            }

            console.log(nurse);
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  updateMyself: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = { _id: req.body._id };
          let newassigned_id = req.body.newassigned_id;
          console.log(filter);

          if (!err) {
            let assigned = await Myself.findByIdAndUpdate(
              filter,
              req.body,
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  updateFamEdit: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = { _id: req.body._id };
          let newassigned_id = req.body.newassigned_id;
          console.log(filter);

          if (!err) {
            let assigned = await Family.findByIdAndUpdate(
              filter,
              req.body,
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  updateVacc: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = { _id: req.body._id };
          console.log(filter);

          if (!err) {
            let assigned = await Vaccine.findByIdAndUpdate(
              filter,
              req.body,
              {
                new: true,
              },
              function (err, booking) {
                return booking;
              }
            );
            assigned.save();
          } else {
            let status = 500;
            result.status = status;
            result.result = "done";
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  // delete a specific vaccine
  deleteVacc: (req, res) => {
    mongoose
      .connect(
        process.env.DB_CONNECTION,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        },
        async (err) => {
          let result = {};
          let status = 200;
          let filter = { _id: req.params.id };
          console.log(filter);

          if (!err) {
            Vaccine.findOneAndRemove(filter, function (err, vaccine) {
              return vaccine;
            });
          } else {
            let status = 500;
            result.status = status;
            result.result = err;
          }
          res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
};
