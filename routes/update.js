const updateController = require('../controllers/updates')

module.exports = (router)=>{
    router.route('/updatemy')
        .put(updateController.updateMy)
    router.route('/updatefam')
        .put(updateController.updateFam)
}