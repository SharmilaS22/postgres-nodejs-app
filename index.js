require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(express.json());
// app.set("view engine", "ejs");
// app.use(express.static('public'));

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

/*
Route /user
GET     - Get all users
POST    - Add a new user
DELETE  - Delete all users
*/
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
.delete(async (req, res) => {
    
    await User.destroy({
        truncate: true
    });

    res.send('Deleted all records');
});


/*
Route /user/:userid

GET      - Get user details with given userid
DELETE   - Delete the user with given userid
PUT      - Updates the user with given userid (updates all the fields)
PATCH    - Updates the user with given userid 
*/

app.route('/user/:userid')
.get( async (req, res) => {

    const { userDetails, err } = await User.findOne({ 
        where: { id: req.params.userid },
        attributes: ['id', 'name', 'email']
    })
    .then((user) => ({userDetails: user, err: null}))
    .catch((err) => ({userDetails: null, err: err}))
    
    // check if users exist
    if (userDetails) {
        res.status(200).json({
            status: 'success',
            data: userDetails,
        })
    } else {
        res.send(err);
    }  
 
})
.delete(async (req, res) => {
    const result = await User.destroy({
        where: { id: req.params.userid }
    }).then(result => result)
    .catch(err => console.log(err))

    if(result != 0) {
        res.send("Deleted successfully");
    } else {
        res.send("No such entry found");
    }
})
.put( async (req, res) => {

    await User.update(
        // { name: req.body.name, email: req.body.email }, 
        req.body,       
        { where: {id: req.params.userid } }
    ).then(result => {
        if (result[0] == 0) {
            res.send("No entry modified");
        } else {
            res.send("Updated successfully");
        }
    })
    .catch(err => res.send(err));

})
.patch( async (req, res) => {

    await User.update(
        req.body,       
        { where: {id: req.params.userid } }
    ).then(result => {
        if (result[0] == 0) {
            res.send("No entry modified");
        } else {
            res.send("Updated successfully");
        }
    })
    .catch(err => res.send(err));

});

app.listen(3000, () => console.log("Server listening"));