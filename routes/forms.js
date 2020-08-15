const formController = require("../controllers/forms");
const validateToken = require("../utils").validateToken;

module.exports=(router)=>{
    router.route('/my-form')
        .post(formController.addmy)
    router.route('/family-form')
        .post(formController.addfam)
    router.route('/corporate-form')
        .post(formController.addcorp)
}