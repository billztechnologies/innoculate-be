const vaccineController = require("../controllers/vaccines");
const { myselfVacc } = require("../controllers/vaccines");

module.exports = (router) => {
  router
    .route("/vaccines")
    .post(vaccineController.addvacc)
    .get(vaccineController.getvacc);
  router
    .route('/getvacc')
    .post(vaccineController.myselfVacc)
};
