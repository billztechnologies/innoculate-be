const users = require("./users");
const forms = require("./forms");
const vaccines = require("./vaccines");

module.exports = (router) => {
  users(router);
  forms(router);
  vaccines(router);
  return router;
};
