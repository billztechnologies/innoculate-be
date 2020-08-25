const vaccineController = require("../controllers/vaccines");

module.exports = (router) => {
  router
    .route("/vaccines")
    .post(vaccineController.addvacc)
    .get(vaccineController.getvacc);
};
