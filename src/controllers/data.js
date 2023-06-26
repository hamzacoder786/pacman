const { Collection } = require('mongoose');
const Data = require('../models/data');
const {uploader, sendEmail} = require('../utils/index');


exports.index = async function (req, res) {
    const users = await Data.find({});
    res.status(200).json({users});
};

exports.countBet = async (req, res) => {
    const users = await Data.count()
    .then(users => {
        res.send({"numberOfBets":users});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong."
        });
    });
    
};

exports.countHours =  (req, res) => {
    const users =  Data.count()
    .then(users => { 

        perGame =users * 5
        console.log("testing",perGame)
        var totalMinutes = perGame;

        var hours = Math.floor(totalMinutes / 60);          
        var minutes = totalMinutes % 60;
        res.send({"TotalHours" : hours});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong."
        });
    });
    
};


exports.findTopfive =async (req, res) => {

    const mysort = { score : -1 }
    const score =  await Data.find().sort(mysort).limit(5).exec()

	// Category.findById(req.params.categoryId)
    
        if(score) {
            res.send(score);
            // return res.status(404).send({
            //     message: "Category does not exist"
            // });            
        }else{
            res.status(404).send({
                    message: "Address does not exist"
                });    
        }
        // res.send(address);
};


exports.findOnedata =async (req, res) => {

    const address =  await Data.findById({ address: req.params.address }).exec()

	// Category.findById(req.params.categoryId)
    
        if(id) {
            res.send(address);
            // return res.status(404).send({
            //     message: "Category does not exist"
            // });            
        }else{
            res.status(404).send({
                    message: "Address does not exist"
                });    
        }
        // res.send(address);
};




exports.findOne =async (req, res) => {

    const address =  await Data.find({ address: req.params.address }).exec()

	// Category.findById(req.params.categoryId)
    
        if(address) {
            res.send(address);
            // return res.status(404).send({
            //     message: "Category does not exist"
            // });            
        }else{
            res.status(404).send({
                    message: "Address does not exist"
                });    
        }
        // res.send(address);
};


exports.store = async (req, res) => {
    try {
        const {email} = req.body;

        // Make sure this account doesn't already exist
        
        const newUser = new User({...req.body, challengeprice});

        const user_ = await newUser.save();

        // Save the updated user object
        await user_.save();

        res.status(200).json({message:"data-inserted"});

        
        

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

