const users = require("./users");
const forms = require("./forms");
const vaccines = require("./vaccines");
const states = require("./states")
const email = require("./email")

module.exports = (router) => {
  users(router);
  forms(router);
  vaccines(router);
  states(router);
  email(router)
  return router;
};
