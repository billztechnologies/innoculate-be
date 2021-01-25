const mongoose = require("mongoose");
const User = require("../models/users");
require("dotenv/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailServices");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");


let reset_pass = "/reset/";
// refreshTokens array
let refreshTokens = [];
const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "..", "templates", "/resetTemplate.hbs"),
  "utf8"
);
const template = handlebars.compile(emailTemplateSource);
module.exports = {
  auth: async (req, res, next) => {
    re;
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
            expiresIn: "30000",
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
              phone: req.body.phone_no,
              role: req.body.role,
              email: req.body.email,
              state: req.body.state,
              localgovt: req.body.localgovt,
              newassigned_id: req.body.newassigned_id,
              done: true,
              // timestamp: new Date().toISOString(),
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
    const decoded = jwt.decode(req.body.token, {
      complete: true,
    });
    console.log(decoded.payload);

    mongoose.connect(
      process.env.DB_CONNECTION,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        const { id, email, role } = decoded.payload;
        console.log(id, email);
        if (!err) {
          User.findOne({ email: email }, (err, user) => {
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
              res.status(status).json({
                result,
              });
            }
          }).catch((err) => {
            status = 400;
            result.status = status;
            result.error = "bad request, no user request id sent";
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
    let status;

    try {
      User.findOne({ email }, (err, user) => {
        if (!err && user) {
          bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
              status = 401;
              result.status = status;
              result.error = "password is incorrect, pls try again";
              res.status(status).json({result});
            } else{
            let payload = {
              email: user.email,
              id: user._id,
              role: user.role,
            };
            let accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
              expiresIn: "30000",
              issuer: "https://www.inocul8.com.ng",
            });
            let refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
              expiresIn: "7d",
              issuer: "https://www.inocul8.com.ng",
            });
            refreshTokens.push(refreshToken);
            rtoken = refreshToken;
            result = {
              accessToken,
              refreshToken,
              user,
            };
            return res.status(200).json({result});
          }
          })
          .catch(err=>{
            console.log(err);
          });
        } else {
          status = 404;
          result.status = status;
          result.error = "user not found";
           res.status(status).json({message:result.error});
        }
      });
    } catch (err) {
      status = 400;
      result.status = status;
      result.error = "cannot handle bad request, check request information";
       res.status(status).send(result);
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
      async (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          await User.find({ role: "nurse", done: true }, (err, users) => {
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
      async (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          await User.find({ role: "nurse" }, (err, users) => {
            if (!err) {
              result.status = status;
              result.error = err;
              result.result = users;
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
          result.error = err;
          return res.status(status).send(result);
        }
      }
    );
  },
  deleteNurseAcct: (req, res) => {
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
          let filter = { _id: req.params.id, role: "nurse" };
          console.log(filter);

          if (!err) {
            result.result = "nurse deleted";
            User.findOneAndRemove(filter, function (err, user) {
              return user;
            });
          } else {
            let status = 500;
            result.status = status;
            result.result = err;
          }
          return res.status(status).send(result);
        }
      )
      .catch((err) => {
        console.log("Error", err);
      });
  },
  // forgot password implementation
  passwordRecoverMail: (req, res) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user)
          return res.status(401).json({
            message:
              "The email address " +
              req.body.email +
              " is not associated with any account. Double-check your email address and try again.",
          });

        //Generate and set password reset token
        user.generatePasswordReset();

        // Save the updated user object
        user
          .save()
          .then((user) => {
            // send email
            let link = `${req.headers.origin}${reset_pass}${user.resetPasswordToken}`;

            const htmlToSend = template({
              message: `Hi ${user.name}`,
              reset: `Please click on the following link, ${link}, to reset your password.`,
              Note: `Note: this link will be null in the next 5 minutes and will not have the authorization to allow password change`,
              noreq: `If you did not request this, please ignore this email and your password will remain unchanged.`,
            });

            const mailOptions = {
              to: user.email,
              subject: "Password change request",
              html: htmlToSend,
            };

            emailService
              .sendText(mailOptions.to, mailOptions.subject, mailOptions.html)
              .then(() => {
                res.status(200).json({ message: "reset password link sent" });
              })
              .catch((err) => {
                res.status(500).json({ message: "Internal Error" });
                console.log(err);
              });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  },
  reset: (req, res) => {
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    })
      .then((user) => {
        if (!user)
          return res.status(401).json({
            message: "Password reset token is invalid or has expired.",
          });

        //Redirect user to form with the email address
        // res.render("reset", { user });
        return res.status(200).json({
          message: "valid token",
        });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  },
  passwordReset: (req, res) => {
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Set the new password
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          throw err;
        }
        console.log(req.body.password, hash)
        user.password = hash;
        console.log(user.password, user._id)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
  
          // send email
          const htmlToSend = template({
            message: `Hi ${user.name}`,
            reset: `Your password has been successfully updated, please login with your newly confirmed password`,
            noreq: `If you did not request this, please contact us`,
          });
  
          const mailOptions = {
            to: user.email,
            subject: "Password changed",
            html: htmlToSend,
          };
  
          emailService
            .sendText(mailOptions.to, mailOptions.subject, mailOptions.html)
            .then(() => {
              res.status(200).json({ message: "password changed successfully" });
            })
            .catch((err) => {
              res.status(500).json({ message: "Internal Error" });
              console.log(err);
            });
        });
      });
      console.log(user);
      // Save
      
    })
    .catch(err=>{
      console.log(err)
    })
  },
};
