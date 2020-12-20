const eachIndivController = require('../controllers/eachIndiv');

module.exports = (router) =>{
    router.route('/addeachperson').post(eachIndivController.addIndiv);
    router.route('/updateperson').put(eachIndivController.updateIndiv);
    router.route('/checkperson').post(eachIndivController.checkIndiv);
    router.route('/searchpatient').get(eachIndivController.searchPatients);
}