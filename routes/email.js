const emailController = require('../controllers/email')

module.exports =(router)=>{
    router.route('/email')
        .post(emailController.email)
    router.route('/emailfam')
        .post(emailController.emailFam)
    router.route('/emailcorp')
        .post(emailController.emailCorp)
}