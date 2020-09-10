const formController = require("../controllers/forms");
const validateToken = require("../utils").validateToken;

module.exports=(router)=>{
    router.route('/my-form')
        .post(formController.addmy)
        .get(formController.getAllMyself)
    router.route('/family-form')
        .post(formController.addfam)
        .get(formController.getAllFamily)
    router.route('/corporate-form')
        .post(formController.addcorp)
        .get(formController.getAllCorp)
}