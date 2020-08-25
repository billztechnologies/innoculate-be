const mongoose = require("mongoose");
const User = require("../models/users");
require("dotenv/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  add: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;
        if (!err) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            const user = new User({
              name: req.body.name,
              password: hash,
            });

            user.save((err, user) => {
              if (!err) {
                result.status = status;
                result.result = user;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            });
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

  login: (req, res) => {
    const { name, password } = req.body;
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;

        if (!err) {
          User.findOne({ name }, (err, user) => {
            if (!err && user) {
              bcrypt
                .compare(password, user.password)
                .then((match) => {
                  if (match) {
                    const payload = {
                      name: user.name,
                      password: user.password,
                    };
                    const options = {
                      expiresIn: "2d",
                      issuer: "https://inocul8.com",
                    };
                    const secret = process.env.TOKEN_SECRET;
                    const token = jwt.sign(payload, secret, options);
                    result.token = token;
                    result.status = status;
                    result.result = user;
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = "Authentication error";
                  }
                  res.status(status).send(result);
                })
                .catch((err) => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  res.status(status).send(result);
                });
            } else {
              status = 404;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            }
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
  getUsers: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          const payload = req.decoded;
          console.log("PAYLOAD", payload);
          if (payload && payload.name === "admin") {
            User.find({}, (err, users) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = users;
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
            result.error = "Authentication error";
            res.status(status).send(result);
          }
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
