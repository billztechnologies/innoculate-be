const updateController = require('../controllers/updates')

module.exports = (router)=>{
    router.route('/updatemy')
        .put(updateController.updateMy)
    router.route('/updatemyadmin')
        .put(updateController.updateMyAdmin)
    router.route('/updatenursebooking')
        .put(updateController.updateNurseBooking)
    router.route('/updatefam')
        .put(updateController.updateFam)
    router.route('/updatenursemyself')
        .put(updateController.updateMyself)
}