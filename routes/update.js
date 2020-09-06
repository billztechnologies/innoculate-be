const updateController = require('../controllers/updates')

module.exports = (router)=>{
    router.route('/updatemy')
        .patch(updateController.updateMy)
}