const users = require("./users")
const forms = require("./forms")

module.exports =(router)=>{
    users(router);
    forms(router);
    return router
}