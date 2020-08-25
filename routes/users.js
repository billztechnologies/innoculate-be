const userController = require("../controllers/users");
const validateToken = require("../utils").validateToken;

module.exports = (router) => {
  router
    .route("/user")
    .post(userController.add)
    .get(validateToken, userController.getUsers);

  router.route("/login").post(userController.login);
};
