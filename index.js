require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static('public'));

// database connection
const sequelize = new Sequelize('testDB', process.env.DBUSER, process.env.DBPASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
}) ;

(async () => {
    await sequelize.authenticate()
        .then(() => console.log("connection made!"))
        .catch((err) => console.log('some error occured', err));
})();

// define model
const User = sequelize.define('User', { 
        id: {
            type          : DataTypes.INTEGER,
            allowNull     : false,
            primaryKey    : true,
            autoIncrement : true
        },
        name: DataTypes.STRING,
        email: {
            type   : DataTypes.STRING,
            unique : true
        }
    },  
    {
        // dont want the createdAt and updatedAt in our table
        timestamps: false
});


// routes
app.get('/', (req, res) => {
    res.send("hello world");
});

// user route
app
.route('/user')
.get(async (req, res) => {

    const { allUsers, err } = await User.findAll({ attributes: ['id', 'name', 'email']})
    .then((users) => ({allUsers: users, err: null}))
    .catch((err) => ({allUsers: null, err: err}))
    
    // check if users exist
    if (allUsers) {
        res.status(200).json({
            status: 'success',
            data: allUsers,
        })
    } else {
        res.send(err);
    }  

})
.post(async (req, res) => {
    const aUser = {
        name: req.body.name,
        email: req.body.email
    };

    const { status, err } = await User.create(aUser)
    .then(() => ({ 
        status: true,
        err: false
    }))
    .catch(err => ({
        status: false,
        err: err
    }));

    if (status) {
        res.status(201).send('User added sucessfully');
    } else {
        res.send(err);
    }
})
.delete((req, res) => {
    res.status(405).send("method not allowed");
})

// handlers
const getAllUsers = async () => {
    const result = await User.findAll({ attributes: ['id', 'name', 'email']})
    .then((users) => ({allUsers: users, err: null}))
    .catch((err) => ({allUsers: null, err: err}))
    return result;
}


const addNewUser = async (userObj) => await User.create(aUser)
    .then(() => ({ 
        status: true,
        err: false
    }))
    .catch(err => ({
        status: false,
        err: err
    }));



app.listen(3000, () => console.log("Server listening"));