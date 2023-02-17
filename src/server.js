require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");

// Setting up port
// const connUri = 'mongodb+srv://hitler:Scooter786@cluster0.8iqde.mongodb.net/test';
let PORT = process.env.PORT || 5000;

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

// app.use(cors());

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }));
//form-urlencoded

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//=== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect("mongodb+srv://hitler:Scooter786@cluster0.razjzzx.mongodb.net/test");
// mongodb+srv://hitler:Scooter786@cluster0.8iqde.mongodb.net/test");

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

//=== 3 - INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize());
require("./middlewares/jwt")(passport);


//=== 4 - CONFIGURE ROUTES
//Configure Route
require('./routes/index')(app);


//=== 5 - START SERVER

app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT+'/')); 


// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   }); 