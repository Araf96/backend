const jwt = require('jsonwebtoken');

const { User } = require('../models/user-model');
const EM = require('../Util/texts');
const CustomError = require("../templates/ErrorTemplate");
 
const authenticateUser = async(req, res, next) => {

    let token = req.header('x-auth');

    try{
        let decoded = jwt.verify(token, EM.JWT_KEY);
        let user = await User.findOne({
            "_id": decoded._id,
            "tokens.token": token
        });

        req.body.user = user;
        
        if(!user){
            // return res.status(401).json({
            //     type: EM.ERROR,
            //     message: EM.AUTH_ERR
            // });
            return next(new CustomError(EM.AUTH_ERR, 401));
        }
    }catch(e){
        // return res.status(401).json({
        //     type: EM.ERROR,
        //     message: EM.AUTH_ERR
        // });
        return next(new CustomError(EM.AUTH_ERR, 401));
    }
    next();
}

module.exports = {authenticateUser};