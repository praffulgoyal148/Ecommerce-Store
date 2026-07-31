const {getTokenThroughAuthenticationHeader} = require("../auth/jwt");
const jwt = require('jsonwebtoken');
const usersModel = require("../models/users");

const isLoggedInAsAdmin = async (req,res,next) => {
    let token = getTokenThroughAuthenticationHeader(req,res);

    var decoded = jwt.verify(token,process.env.JWT_SECRET);

    const {username,email} = decoded;
    if(!username || !email) {
        return res.status(400).json({
            message:"Username or email missing, incorrect JWT"
        })
    }

    try {
        let user = await usersModel.findOne({
            username
        })
        
        if(!user){
            return res.status(400).json({
                message:"User not found, JWT error"
            })
        }
        if(user.role !== 'admin')
        {
            return res.status(403).json({
                message:"You are not authorized to access this content"
            })
        }
        req.user = user;
        console.log("You Logged In As Admin")
        next();
    } catch (error) {
        return res.status(500).json({
            message:"Contact admin, db not available to access users",
            error
        })
    }
}

module.exports = isLoggedInAsAdmin;