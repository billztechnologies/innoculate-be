const stateController = require('../controllers/states')

module.exports = (router) => {
    router
      .route("/states")
      .post(stateController.addstates)
      .get(stateController.getstates);
  };