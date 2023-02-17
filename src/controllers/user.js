const User = require('../models/user');
const {uploader, sendEmail} = require('../utils/index');

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index = async function (req, res) {
    const users = await User.find({});
    res.status(200).json({users});
};

exports.findAll = (req, res) => {
	User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong."
        });
    });
};


exports.ownerFind =async (req, res) => {

    const address =  await User.find({ address: req.params.address }).exec()

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

exports.findOne =async (req, res) => {

    const address =  await User.find({ address: req.params.address }).exec()

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


// @route POST api/user
// @desc Add a new user
// @access Public
exports.store = async (req, res) => {
    try {
        const {email} = req.body;

        // Make sure this account doesn't already exist
        const user = await User.findOne({email});

        if (user) return res.status(401).json({message: 'duplicate-email.'});

        const password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
        const newUser = new User({...req.body, password});

        const user_ = await newUser.save();

        //Generate and set password reset token
        user_.generatePasswordReset();

        // Save the updated user object
        await user_.save();

        //Get mail options
        let domain = "http://" + req.headers.host;
        let subject = "New Account Created";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link = "http://" + req.headers.host + "/api/auth/reset/" + user.resetPasswordToken;
        let html = `<p>Hi ${user.address}<p><br><p>A new account has been created for you on ${domain}. Please click on the following <a href="${link}">link</a> to set your password and login.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`

        await sendEmail({to, from, subject, html});

        res.status(200).json({message: 'email-send'});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};


exports.update =async (req, res) => {
	if(!req.body.address) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
        const address =  await User.findOne({ address: req.params.address }).exec()
        
     // Find category and update it with the request body
    User.findOneAndUpdate(req.params.address, {
        address: req.body.address,
        inGametoken: req.body.inGametoken,
    }, {new: true})
    .then(User => {
        if(!User) {
            return res.status(404).send({
                message: "Address does not exist"
            });
        }
        res.send(User);
    }).catch(err => {        
        return res.status(500).send({
            message: "Something went wrong"
        });
    });
// }
};


exports.updateLogin =async (req, res) => {
	if(!req.body.address) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
        const address =  await User.findOne({ address: req.params.address }).exec()
     // Find category and update it with the request body
    User.findOneAndUpdate(req.params.address, {
        address: req.body.address,
        isLogin: req.body.isLogin,
    }, {new: true})
    .then(User => {
        if(!User) {
            return res.status(404).send({
                message: "Address does not exist"
            });
        }
        res.send(User);
    }).catch(err => {        
        return res.status(500).send({
            message: "Something went wrong"
        });
    });
// }
};




// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) return res.status(401).json({message: 'User does not exist'});

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        //Make sure the passed id is that of the logged in user
        if (userId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const user = await User.findByIdAndUpdate(id, {$set: update}, {new: true});

        //if there is no image, return success message
        if (!req.file) return res.status(200).json({user, message: 'User has been updated'});

        //Attemptusername_1 to upload to cloudinary
        const result = await uploader(req);
        const user_ = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        if (!req.file) return res.status(200).json({user: user_, message: 'User has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
// exports.destroy = async function (req, res) {
    
//     try {
//         const id = req.params.id;
//         const user_id = req.user._id;

//         //Make sure the passed id is that of the logged in user
//         if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

//         await User.findByIdAndDelete(id);
//         res.status(200).json({message: 'User has been deleted'});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

exports.destroy = (req, res) => {
    User.findByIdAndRemove(req.params.id)
   .then(User => {
       if(!User) {
           return res.status(404).send({
               message: "User does not exist"
           });
       }
       res.send({message: "User deleted successfully!"});
   }).catch(err => {      
       return res.status(500).send({
           message: "Something went wrong"
       });
   });
};