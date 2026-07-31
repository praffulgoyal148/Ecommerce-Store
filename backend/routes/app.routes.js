const path = require('path');
const express = require('express');

const {addToCart,getCart,getProductById,getUserDetails,getProducts,getCategoryProducts} = require("../controllers/app.controller");
const router = express.Router();

router.get('/add-to-cart/:id',addToCart);
router.get('/get-cart',getCart);
//router.get('/get-categories', getCategories);
// router.get('/buy-cart')
router.get('/get-product/:id', getProductById);
router.get('/get-products/:category', getCategoryProducts);
router.get('/get-products', getProducts);
router.get('/get-user-details', getUserDetails);
// router.get('/order-history',);

module.exports = router;
