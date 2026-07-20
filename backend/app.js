const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = 5555;

const userRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());//we use this because we want to send json data from the frontend to the backend

app.use('/users', userRoutes);
app.use('/admin',adminRoutes);



mongoose.connect('mongodb://localhost:27017/ecommerce_project')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://localhost:` + PORT);
        });
    })
    .catch(err => {
        console.log(err);
    })