const users = require("./users");
const forms = require("./forms");
const vaccines = require("./vaccines");
const states = require("./states")
const mails = require("./mail")

module.exports = (router) => {
  users(router);
  forms(router);
  vaccines(router);
  states(router);
  mails(router)
  return router;
};
