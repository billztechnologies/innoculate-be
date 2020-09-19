const vaccineController = require("../controllers/vaccines");

module.exports = (router) => {
  router
    .route("/vaccines")
    .post(vaccineController.addvacc)
    .get(vaccineController.getvacc);
  router.route("/getvacc").post(vaccineController.myselfVacc);
  router.route("/getfamvacc").post(vaccineController.famVacc);
  router.route("/getcorpvacc").post(vaccineController.corpVacc);
};
