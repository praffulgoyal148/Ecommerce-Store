const { createToken } = require('../auth/jwt');
const usersModel = require('../models/users');
const bcrypt = require('bcrypt');

module.exports.loginUser = async (req, res, next) => {
    // const rawCredential = req.body.username ?? req.body.userName ?? req.body.email ?? '';
    // const password = req.body.password ?? req.body.pass ?? '';

    // console.log('[loginUser] request body:', req.body);
    // console.log('[loginUser] password present:', typeof req.body.password !== 'undefined' || typeof req.body.pass !== 'undefined');
    // console.log('[loginUser] raw password length:', String(password).length);

    // const credential = String(rawCredential).trim();
    // const trimmedPassword = String(password).trim();

    // if (!credential || !trimmedPassword) {
    //     return res.status(400).json({
    //         message: "Username/email or password missing for login"
    //     })
    // }

    let {username,password} = req.body;
    username = username.trim();
    password = password.trim();

    if(!username || !password)
    {
        return res.status(400).json({
            message:"Username or password missing for login"
        })
    }
    console.log(username,password);

    try {
        // let user = await usersModel.findOne({
        //     $or: [
        //         { username: credential },
        //         { email: credential }
        //     ]
        // })

        let user = await usersModel.findOne({
            username
        })

        if (!user) {
            return res.status(400).json({
                message: "Please enter correct username or email"
            })
        }

        let passwordMatched = bcrypt.compareSync(password, user.password);
        console.log(passwordMatched);

        if (!passwordMatched) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        }

        //If user has entered correct username and password
        //provide jwt to the user

        let token = createToken({
            username: user.username,
            email: user.email
        })

        res.status(200).json({
            message: "Login success",
            token,
            user: {
                username: user.username,
                email: user.email,
                cart: user.cart
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

module.exports.resetPassword = async (req, res, next) => {
    const rawCredential = req.body.username ?? req.body.userName ?? req.body.email ?? '';
    const newPassword = req.body.newPassword ?? req.body.password ?? '';

    const credential = String(rawCredential).trim();
    const trimmedPassword = String(newPassword).trim();

    if (!credential || !trimmedPassword) {
        return res.status(400).json({
            message: "Username/email and new password are required"
        })
    }

    try {
        const user = await usersModel.findOne({
            $or: [
                { username: credential },
                { email: credential }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found for the given username/email"
            });
        }

        user.password = trimmedPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}

module.exports.createUser = async (req, res, next) => {
    const {
        username,
        password,
        email,
        profileImage,
        address
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username or password is missing"
        })
    }

    try {
        let user = await usersModel.create({
            username,
            password,
            profileImage: profileImage || "",
            email: email || "",
            address: address || ""
        })
        res.status(200).json({
            message: "User created successfully",
            status: 200,
            user: {
                username,
                profileImage,
                email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error
        })
    }
}