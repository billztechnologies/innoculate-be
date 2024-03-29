const jwt = require('jsonwebtoken');
const userController = require("./controllers/users");

module.exports ={
    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        let result;
        if(authHeader){
            const token = req.headers.authorization.split(' ')[1];
            const options = {
                expiresIn: '2h',
                issuer: 'https://www.inocul8.com.ng'
            };
            try{
                result = jwt.verify(token, process.env.TOKEN_SECRET);
                console.log(result)
                next()
            } catch(err) {
                res.status(400).json({message: "session expired, try logging in again"})
                throw new Error(err)
                
            }
        } else{
            result ={
                error:"Authentication error, token required",
                status:401
            }
            res.status(401).send(result)
        }
    }
}