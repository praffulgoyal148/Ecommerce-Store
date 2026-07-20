const productsModel = require('../models/products');
const seedProducts = require('../seed/products');

module.exports.addProduct = async (req,res,next)=>{
    const {
        name,
        price,
        description,
        imageUrl
    } = req.body;

    if(!name || !price)
    {
        return res.status(200).json({
            message:"Name and Price are mandatory"
        })
    }

    try {
        let product = await productsModel.create({
            name,
            price,
            description:description||"",
            imageUrl: imageUrl||"",
            rating:0,
            // adminId:req.user._id
            adminId:"6a4c2d7bee4b91e754a96e65"
        })
    
        res.status(200).json({
            message:"Product added Successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            error
        })
    }
}

module.exports.deleteProduct = async (req,res,next) => {
    const {id} = req.params;
    if(!id)
    {
        return res.status(400).json({
            message:"Please provide id to delete an item"
        })
    }

    try {
        await productsModel.deleteOne({
            _id: id
        })

        res.status(200).json({
            message:"Product deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete product right now",
            error
        })
    }
}

module.exports.updateProduct = async (req,res,next) => {
    const {name,price,description,imageUrl,id} = req.body;
    if(!id){
        return res.status(400).json({
            message:"Id is missing to update an item"
        })
    }
        try {
            let product = await productsModel.findOne({
                _id:id
            })
    
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.imageUrl = imageUrl || product.imageUrl;
    
            await product.save();
    
            res.status(200).json({
                message:"Product Updated successfully"
            })
        } catch (error) {
            return res.status(500).json({
                message:"Unable to update product right now",
                error
            })
        }
}

// module.exports.getUploadedProducts = async (req,res,next) => {
//     try {
//         console.log(req.user);
//         let products = await productsModel.find({
//             adminId:req.user._id
//         });

//         res.status(200).json({
//             products
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message:"Unable to fetch product right now",
//             error
//         })
//     }
// }

// module.exports.getProduct = async (req,res,next) => {
//     const {id} = req.params;
//     try {
//         let product = await productsModel.findOne({
//             _id:id,
//             adminId:req.user._id
//         })

//         if(!product)
//         {
//             return res.status(400).json({
//                 message:"Product doesn't exist"
//             })
//         }
//         return res.status(200).json({
//             product
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message:"Unable to fetch product right now",
//             error
//         })
//     }
// }

// module.exports.addBatchData = async (req,res,next) => {
//     let seedData = seedProducts;
//     seedData = seedData.map(item => {
//         return {
//             ...item,
//             adminId:req.user._id
//         }
//     });

//     if(seedData.length == 0){
//         return res.status(400).json({
//             message:"add data to seed"
//         })
//     } 

//     try {
//         let allProducts = await productsModel.insertMany(seedData);

//         return res.status(200).json({
//             message:"Seed Products added successfully",
//             products: allProducts
//         })
//     } catch (error) {
//         return res.status(500).status({
//             message:error.message,
//             error
//         })
//     }
// }