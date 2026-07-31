const express = require('express');
const path = require('path');
const usersModel = require('../models/users');
const {createUser, loginUser, resetPassword} = require('../controllers/users.controller')
const router = express.Router();

router.post('/create', createUser);
router.post('/signup',createUser);

router.post('/login',loginUser);
router.post('/reset-password', resetPassword);

module.exports = router;
