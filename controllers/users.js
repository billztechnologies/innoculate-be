const mongoose = require("mongoose");
const User = require("../models/users");
require("dotenv/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// refreshTokens array
let refreshTokens = [];
module.exports = {
  auth: (req, res, next) => {
    let token = req.headers["authorization"];
    token = token.split(" ")[1]; //take the Access token

    //verify token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (!err) {
        req.user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  },
  renewAuth: (req, res) => {
    const refreshToken = req.body.token;
    // console.log(req.body.token);
    if (!refreshToken) {
      res.status(403).json({ message: "User not authenticated, try again" });
    }

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, (err, user) => {
      if (!err) {
        const accessToken = jwt.sign(
          {
            email: user.email,
            id: user._id,
            role: user.role,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "40s",
          }
        );
        return res.status(200).json({
          accessToken,
        });
      } else {
        return res.status(403).json({
          message: "User not authenticated, not verified",
        });
      }
    });
  },
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
              role: req.body.role,
              email: req.body.email,
              state: req.body.state,
              localgovt: req.body.localgovt,
              newassigned_id: req.body.newassigned_id,
              done: true,
              timestamp: new Date().toISOString(),
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
  loginLocal: (req, res) => {
    const payload = req.body;
    console.log(payload);

    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        const { id, email, role } = payload;
        console.log(id, email);
        if (!err) {
          User.findOne({ _id: id }, (err, user) => {
            console.log(user);
            if (!err && user) {
              result.message = "Auth success";
              result.status = 200;
              result.result = user;
              res.status(status).send(result);
            } else {
              status = 401;
              result.status = status;
              result.error = "Authentication error";
              res.status(status).send(result);
            }
          }).catch((err) => {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(err);
          });
        } else {
          status = 404;
          result.status = status;
          result.error = err;
          res.status(status).send(err);
        }
      }
    );
  },

  // login function for users
  login: (req, res) => {
    const { email, password } = req.body;
    let result = {};
    let status = 200;

    try {
      User.findOne({ email }, (err, user) => {
        if (!err && user) {
          bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              let payload = {
                email: user.email,
                id: user._id,
                role: user.role,
              };
              let accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: "40s",
                issuer: "https://www.inocul8.com.ng",
              });
              let refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: "20s",
                issuer: "https://www.inocul8.com.ng",
              });
              refreshTokens.push(refreshToken);
              result = {
                accessToken,
                refreshToken,
                user,
              };
              return res.status(200).json({
                result,
              });
            } else {
              status = 401;
              result.status = status;
              result.error = "password is incorrect, pls try again";
            }
            return res.status(status).send(result);
          });
        } else {
          status = 404;
          result.status = status;
          result.error = "user not found";
          return res.status(status).send(result);
        }
      });
    } catch (err) {
      status = 500;
      result.status = status;
      result.error = "cannot handle bad request, check request information";
      return res.status(status).send(result);
    }
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
          if (payload && payload.role === "admin") {
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
  getNurse: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          User.find({ role: "nurse", done: true }, (err, users) => {
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
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },
  getAllNurse: (req, res) => {
    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          User.find({ role: "nurse" }, (err, users) => {
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
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },
};
