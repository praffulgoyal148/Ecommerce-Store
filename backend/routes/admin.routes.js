const express = require('express');
const path = require('path');
const usersModel = require('../models/users');
const productsModel = require('../models/products');
const {addProduct,deleteProduct,updateProduct} = require('../controllers/admin.controller')
const router = express.Router();

router.post('/add-product', addProduct);
router.get('/delete-product/:id',deleteProduct);
router.post('/update-product',updateProduct);
// router.get('/get-products',getUploadedProducts);
// router.get('/get-product/:id',getProduct);
// router.post('/add-seed-data',addBatchData);

module.exports = router;