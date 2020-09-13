const userController = require("../controllers/users");
const validateToken = require("../utils").validateToken;

module.exports = (router) => {
  router
    .route("/user")
    .post(userController.add)
    .get(validateToken, userController.getUsers);
  router.route('/nurses')
    .get(userController.getNurse)
  router.route("/login").post(userController.login);
};
