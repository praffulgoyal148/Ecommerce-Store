const {default: mongoose} = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    rating: {
        type: Number
    },
    adminId:{
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    category: {
        type: String,
        lowercase: true
    }

})

module.exports = mongoose.model("Products", productSchema);