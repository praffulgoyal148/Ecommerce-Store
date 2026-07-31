const productsModel = require("../models/products");

module.exports.addToCart = async (req,res,next) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({
            message:"id missing to find product"
        })
    }

    try {
        let product = await productsModel.findOne({
            _id:id
        })

        /*Cart Schema:
            name: {
               type:String,
               required:true
            },
            quantity:{
               type:Number,
               default:1
            },
            productId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"Products"
            },
            imageUrl: {
             tyep:String
            }
        */
         let indx = req.user.cart.findIndex(item => item.productId == id);
         if(indx != -1){
            req.user.cart[indx].quantity++;
         }
         else
         {
            req.user.cart.push({
                name:product.name,
                quantity: 1,
                imageUrl: product.imageUrl,
                productId:product._id
            })
         }

         await req.user.save();

         res.status(200).send({
            message:"Cart updated successfully",
            cart: req.user.cart
         })
    } catch (error) {
        return res.status(500).send({
            message:error.message,
            error
        })
    }
}

module.exports.getCart = async (req,res,next) => {
    try {
        /*
          name: {
                  type: String,
                  required: true
              },
              quantity: {
                  type: Number,
                  default: 1
              },
              //price: Number,
              productId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Products"
              },
              imageUrl: {
                  type:String
              }
        */
        // Populate product details for each cart item's productId
        let userData = await req.user.populate('cart.productId');
        let cart = userData.cart || [];

        // Calculate total price safely (handle missing product.price)
        let totalCartPrice = cart.reduce((acc, item) => {
            const price = item.productId && item.productId.price ? item.productId.price : 0;
            return acc + price * (item.quantity || 0);
        }, 0);

        res.status(200).send({
            message: "Cart fetched successfully",
            cart: cart,
            totalCartPrice: totalCartPrice
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error
        })
    }
}

module.exports.getProductById = async (req,res,next) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({
            message:"id missing to find product"
        })
    }

    try {
        let product = await productsModel.findOne({
            _id:id
        })
    
        res.status(200).send({
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        return res.status(500).send({
            message:error.message,
            error
        })
    }
}

module.exports.getUserDetails = async (req,res,next) => {
    const {username, email, address, cart, purchaseHistory} = req.user;

    res.status(200).json({
        message:"User fetched successfully",
        user: {
            username,
            email,
            address,
            cart,
            purchaseHistory
        }
    })
}

let myAllProducts = [];
module.exports.getProducts = async function(req,res,next) {
    try {
        if(myAllProducts.length == 0) {
            console.log("Fetching data from DB");
            let allProducts = await productsModel.find({});
            myAllProducts = allProducts;
        }

        res.status(200).send({
            message:"Products fetched successfully",
            products:myAllProducts
        })
    } catch (error) {
        return res.status(500).send({
            message:error.message,
            error
        })
    }
}

module.exports.getCategoryProducts = async function(req,res,next) {
    const {category} = req.params;
    if(!category) {
        return res.status(400).json({
            message:"Category missing to search products"
        })
    }

    try {
        let allProducts = await productsModel.find({
            category
        })
    
        res.status(200).send({
            message:"Products fetched successfully",
            products:allProducts
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            error
        })
    }
}