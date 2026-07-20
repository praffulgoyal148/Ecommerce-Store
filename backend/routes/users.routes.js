const express = require('express');
const path = require('path');
const usersModel = require('../models/users');
const {createUser} = require('../controllers/users.controller')
const router = express.Router();

router.post('/create', createUser)
router.post('/signup',createUser);

module.exports = router;
