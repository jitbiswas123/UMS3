const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

//to parse the json data
app.use(express.json());


//Middleware
app.use(express.static(path.join(__dirname,'public')));

//importing the variable from the .env file

const mongoURI = process.env.MONGO_URI;


//Connect to MongoDB
mongoose.connect(mongoURI)
.then(()=> console.log('Connected to MongoDB'))
.catch(err=> console.error("Error connecting to MongoDB: ",err));


//Define User Schema

const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password: String
});

const User = mongoose.model('User',userSchema);

//end points

app.get('/users',(req,res)=>{
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({message: err.message}));
});


app.post('/users',(req,res)=>{
    const user = new User({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    });

    user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).json({message: err.message}));
});


app.put('/users/:id',(req,res)=>{

    const userID = req.params.id;

    const updateData = {
        name:  req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.findByIdAndUpdate(userID, updateData, {new:true})
        .then(updateData =>{
            if(!updateData ){
                return res.status(404).json({message: "User not found"});
            }
            res.json(updateData);
        })

        .catch(err => res.status(400).json({message: err.message}));
})


app.delete('/users/:id',(req,res)=>{
    const userID = req.params.id;

    User.findByIdAndDelete(userID)
        .then(deletedUser =>{
            if(!deletedUser){
                return res.status(404).json({message: err.message});
            }
            res.json({message: "USer deleted successfully"});
        })

        .catch(err => res.status(400).json({message: err.message}));
});
app.listen(4000);