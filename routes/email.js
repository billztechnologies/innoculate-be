const emailController = require('../controllers/email')

module.exports =(router)=>{
    router.route('/email')
        .post(emailController.email)
}