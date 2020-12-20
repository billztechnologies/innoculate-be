const users = require("./users");
const forms = require("./forms");
const vaccines = require("./vaccines");
const states = require("./states")
const email = require("./email")
const updates = require("./update");
const eachIndiv = require('./eachIndiv')

module.exports = (router) => {
  users(router);
  forms(router);
  vaccines(router);
  states(router);
  email(router);
  updates(router);
  eachIndiv(router);
  return router;
};
