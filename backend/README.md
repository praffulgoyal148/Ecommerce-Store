for backend Setup

STEP 1 -> npm init -y
STEP 2 -> Install Packages
  - npm i express mongoose bcrypt jsonwebtoken
STEP 3 -> Now create the basic template inside `app.js'


 const path = require('path');
const express = require('express');
const app = express();
const PORT = 4444;

app.use(express.urlencoded({extended:true}));


app.listen(PORT,()=>{
    console.log(`http://localhost:`+PORT);
});

STEP 4 -> Now create the folders that we need
  models: To create database schema and models
routes: Redirection for requests
controllers: Business logic
lib: To create specific library like axios
middlewares
data : for mongodb
mkdir routes controllers lib middlewares models data -> It makes folder

STEP 5 -> Now think of what all functionalities do we want in our e-commerce
  - CRUD product
      POST:  /product
      GET:  /product?id=""
      PUT:  /product
      DELETE: /product

 To do the product work We need a model first 'product schema'
  - Create /models/product.js
    -  const { default: mongoose } = require("mongoose");

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    rating:{
        type: Number,
    },
    adminId:{
        type: mongoose.Types.ObjectId,
        ref: "Users" // This can only be added by a user
    }
})

module.exports = new mongoose.model("Products", productsSchema);

Create User /models/users.js
  -  const { default: mongoose } = require("mongoose");
const { randomUUID } = require('crypto');
const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: Number,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }
});

const purchasedItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    date: { type: Date },
    quantity: Number,
    orderId: {
        type: mongoose.Schema.Types.UUID,
        default: () => randomUUID()
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: String,
    role: {
        type: String,
        default: "user"
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    purchaseHistory: {
        type: [purchasedItemSchema]
    },
    cart: [cartSchema]
})

//for encrypting password we use bcrypt

userSchema.pre('save',function(){
    const hash = bcrypt.hashSync(this.password, saltRounds);
    this.password = hash;
})

module.exports = new mongoose.model('Users', userSchema);


STEP 6 - Now let's work on routes
  -  /routes/admin.routes.js /routes/users.routes.js

app.js -> const usersRoutes = require('./routes/users.routes.js'); 
          app.use('/users', usersRoutes)


STEP 7 - /routes/users.routes.js

const path = require('path');
const express = require('express');
const usersModel = require('../models/users');
const router = express.Router();

// This will create new user
router.post('/create', async (req, res, next) => {
    const {
        username,
        password,
        profileImage,
        email,
        address,
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username or password missing"
        })
    }

    try {
        let user = await usersModel.create({
            username,
            password,
            profileImage: profileImage || "",
            email: email || "",
            address: address || "",
        })
        res.status(200).json({
            message: "User created successfully",
            status: 200,
            user:{
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

});



module.exports = router;

Step 8 : Connect with database
 - mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://localhost:` + PORT);
        });
    }).catch(err => {
        console.log(err);
    })
    Command -> one terminal : mongod -dbpath=data
            -> second terminal: mongosh
            -> nodemon app.js

STEP 9: We create admin.routes.js to add product & also move "user.routes.js" code to inside controllers folder "users.controller.js"
""
now for getting req.user_id -> we need to set jwt or if we use passport then we don't need to
set


What work I need to do
i>json token ke through user login kr ske
ii>authentication header ke through token ko set kaise krte hai
iii>in Auth -> Bearer token.  -> Token set
iv>phir user ki id dedo then we will see kon kon se product add kr di

-------------------------------------------------------------------------------------------------
STEP 10 - For authenticaation we make auth folder
      -  jwt.js
      - .env -> jwt secret
      - To install env package -> npm i dotenv
Let's talk about user login
   /login par post request bhejni padegi
     - body{username and password}
  -Check karo user valid hai and uska password match hota hai
  -JWT token banao and user ko send kardo
  -Dobara request jab aaegi toh check karo token ke through user valid h
  -if user is valid usse req.user mei add kardo so that user is available through out our application via req.user 

  As admin
  -phele token ko verify krogae nikalne ke baad -> If wil


  STEP 11 -> We extract user in user.controller.js
  
  STEP 12 -> We build app.routes.js

  Step 13 ->Then we build app.controller.js

  note -> req.user -> give user details and req.user.cart -> give cartSchema