const users = require("./users");
const forms = require("./forms");
const vaccines = require("./vaccines");
const states = require("./states")

module.exports = (router) => {
  users(router);
  forms(router);
  vaccines(router);
  states(router);
  return router;
};
