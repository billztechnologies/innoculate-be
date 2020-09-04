const mailController = require('../controllers/email');

module.exports =(router)=>{
    router.route('/email')
        .post(mailController.sendmail)
}
