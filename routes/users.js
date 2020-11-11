const userController = require("../controllers/users");
const validateToken = require("../utils").validateToken;

module.exports = (router) => {
  router
    .route("/user")
    .post(userController.add)
    .get(validateToken, userController.getUsers);
  router.route( "/nurses").get(validateToken, userController.getNurse);
  router
    .route("/allnurses")
    .get(validateToken, userController.getAllNurse);
  router.route("/login").post(userController.login);
  router.route("/login-local").post(validateToken, userController.loginLocal);
  router.route("/renew-token").post(userController.renewAuth)
  router.route("/deletenurse/:id").delete(()=>{
    userController.deleteNurseAcct
  });
}