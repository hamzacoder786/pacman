const User = require('../models/user');
const Token = require('../models/token');
const Data = require('../models/data');
var requestIp = require('request-ip');
// const UserAgent = require('user-agents'); 
useragent = require('express-useragent');

const {sendEmail} = require('../utils/index');

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async (req, res) => {
    try {
        const { email } = req.body;

        const { address } = req.body;

        // Make sure this account doesn't already exist
        const user = await User.findOne({ email });

        const detail = await User.findOne({ address });

        if (user) return res.status(401).json({message: 'duplicate-email'});

        if (detail) return res.status(401).json({message: 'duplicate-address'});

        const newUser = new User({ ...req.body, role: "basic" });

        const user_ = await newUser.save();

        await sendVerificationEmail(user_, req, res);

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};
exports.data = async (req, res) => {
  try {

    const { UserWallet } = req.body;


        // Make sure this account doesn't already exist
        const user = await Data.findOne({ UserWallet });


        if (user) return res.status(401).json({message: 'duplicate-UserWallet'});

        const newData = new Data({ ...req.body, role: "basic" });

        const user_ = await newData.save();
        res.status(200).json({message:"data-inserted",newData});
   
  } catch (error) {
      res.status(500).json({success: false, message: error.message})
  }
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
exports.findOnebygameid =async (req, res) => {

  const gameId =  await Data.find({ gameId: req.params.gameId }).exec()

// Category.findById(req.params.categoryId)
  
      if(gameId) {
          res.send(gameId);
          // return res.status(404).send({
          //     message: "Category does not exist"
          // });            
      }else{
          res.status(404).send({
                  message: "Game id does not exist"
              });    
      }
      // res.send(address);
};

exports.update =async (req, res) => {
	if(!req.body.address||!req.body.inGametoken ) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
        const address =  await User.findOne({ address: req.params.address }).exec()
     // Find category and update it with the request body
    User.findByIdAndUpdate(req.params.address, {
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


exports.ownertokenupdate =async (req, res) => {
	if(!req.body.address||!req.body.inGametoken ) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
   let  data = '63e0d1c6bbc31da82fce1e8e';
        const Getdata =  await User.findById({ _id: data }).exec()
        let getToken = Getdata.inGametoken;
        console.log('fuck',getToken)
     // Find category and update it with the request body
    User.findByIdAndUpdate(req.params.address, {
        address: req.body.address,
        inGametoken: parseFloat(getToken) + parseFloat(req.body.inGametoken),
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


exports.updateNft =async (req, res) => {
	if(!req.body.address||!req.body.isNft ) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
        const address =  await User.findOne({ address: req.params.address }).exec()
     // Find category and update it with the request body
    User.findByIdAndUpdate(req.params.address, {
        address: req.body.address,
        isNft: req.body.isNft,
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

exports.updatehistory =async (req, res) => {
	// if(!req.body.address||!req.body.inGametoken ) {
  //       return res.status(400).send({
  //           message: "Fields can not be empty"
  //       });
  //   }
        const UserWallet =  await Data.findOne({ UserWallet: req.params.UserWallet }).exec()
     // Find category and update it with the request body
     Data.findByIdAndUpdate(req.params.UserWallet, {
      UserWallet: req.body.UserWallet,
      score: req.body.score,
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
	if(!req.body.address||!req.body.isLogin ) {
        return res.status(400).send({
            message: "Fields can not be empty"
        });
    }
        const address =  await User.findOne({ address: req.params.address }).exec()
     // Find category and update it with the request body
    User.findByIdAndUpdate(req.params.address, {
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



// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async (req, res) => {
    try {
        const { email,address, password } = req.body;

        const user = await User.findOne({ $or: [{'email':email} , {'address':address }]});

        // const user1 = await User.findOne({ address });


        if (!user) return res.status(401).json({message: 'email-0r-wallet-address-not-found'});

        // if (!user1) return res.status(401).json({message: 'address-not-found'});

        //validate password
        if (!user.comparePassword(password)) return res.status(401).json({message: 'Invalid-email-wallet-address-or-password'});

        // Make sure the user has been verified
        if (!user.isVerified) return res.status(401).json({ type: 'not-verified', message: 'not-verified.' });

        var clientIp = requestIp.getClientIp(req);
        console.log(clientIp);
        // var data = req.useragent;
        // console.log(data);
        var source = req.headers['user-agent'],
           ua = useragent.parse(source);
        console.log(ua);


        // Login successful, write token, and send back user
        res.status(200).json({token: user.generateJWT(), user: user,clientIp,ua});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};


// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
exports.verify = async (req, res) => {
    if(!req.params.token) return res.status(400).json({message: "invalid-token"});

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token){
          return res.status(400).json({ message: 'token-not-found-or-token-expired' });
          res.redirect('https://metasnooker.io/others/?d=token-not-found-or-token-expired');

        }

        // If we found a token, find a matching user
        User.findOne({ _id: token.userId }, (err, user) => {
            if (!user){ 
              return res.status(400).json({ message: 'invalid-token' });
              res.redirect('https://metasnooker.io/others/?d=invalid-token');
            }

            if (user.isVerified){ 
              return res.status(400).json({ message: 'already-verified' });
              res.redirect('https://metasnooker.io/others/?d=already-verified');
            }

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(500).json({message:err.message});

                res.redirect('https://metasnooker.io/login');

                // res.status(200).send("The account has been verified. Please log in.");

            });
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'email-not-exist.'});

        if (user.isVerified) return res.status(400).json({ message: 'account-verified-Please-login.'});

        await sendVerificationEmail1(user, req, res);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

async function sendVerificationEmail(user_, req, res){
    try{
        const token = user_.generateVerificationToken();

        // Save the verification token
        await token.save();

        let subject = "Account Verification Token";
        let to = user_.email;
        let d=token.token;
        // let id=_id.id;
        let from = "metasnooker@gmail.com";
        let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
        let html = `<style type="text/css">
        /*Basics*/
        body {margin:0px !important; padding:0px !important; display:block !important; min-width:100% !important; width:100% !important; -webkit-text-size-adjust:none;}
        table {border-spacing:0; mso-table-lspace:0pt; mso-table-rspace:0pt;}
        table td {border-collapse: collapse;mso-line-height-rule:exactly;}
        td img {-ms-interpolation-mode:bicubic; width:auto; max-width:auto; height:auto; margin:auto; display:block!important; border:0px;}
        td p {margin:0; padding:0;}
        td div {margin:0; padding:0;}
        td a {text-decoration:none; color: inherit;}
        /*Outlook*/
        .ExternalClass {width: 100%;}
        .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height:inherit;}
        .ReadMsgBody {width:100%; background-color: #ffffff;}
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} 
        /*Gmail blue links*/
        u + #body a {color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
        /*Buttons fix*/
        .undoreset a, .undoreset a:hover {text-decoration:none !important;}
        .yshortcuts a {border-bottom:none !important;}
        .ios-footer a {color:#aaaaaa !important;text-decoration:none;}
        /* data-outer-table="800 - 600" */
        .outer-table {width:640px!important;max-width:640px!important;}
        /* data-inner-table="780 - 540" */
        .inner-table {width:580px!important;max-width:580px!important;}
        /*Responsive-Tablet*/
        @media only screen and (max-width: 799px) and (min-width: 601px) {
          .outer-table.row {width:640px!important;max-width:640px!important;}
          .inner-table.row {width:580px!important;max-width:580px!important;}
        }
        /*Responsive-Mobile*/
        @media only screen and (max-width: 600px) and (min-width: 320px) {
          table.row {width: 100%!important;max-width: 100%!important;}
          td.row {width: 100%!important;max-width: 100%!important;}
          .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
          .center-float {float: none!important;margin:auto!important;}
          .center-text{text-align: center!important;}
          .container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
          .container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
          .hide-mobile {display: none!important;}
          .menu-container {text-align: center !important;}
          .autoheight {height: auto!important;}
          .m-padding-10 {margin: 10px 0!important;}
          .m-padding-15 {margin: 15px 0!important;}
          .m-padding-20 {margin: 20px 0!important;}
          .m-padding-30 {margin: 30px 0!important;}
          .m-padding-40 {margin: 40px 0!important;}
          .m-padding-50 {margin: 50px 0!important;}
          .m-padding-60 {margin: 60px 0!important;}
          .m-padding-top10 {margin: 30px 0 0 0!important;}
          .m-padding-top15 {margin: 15px 0 0 0!important;}
          .m-padding-top20 {margin: 20px 0 0 0!important;}
          .m-padding-top30 {margin: 30px 0 0 0!important;}
          .m-padding-top40 {margin: 40px 0 0 0!important;}
          .m-padding-top50 {margin: 50px 0 0 0!important;}
          .m-padding-top60 {margin: 60px 0 0 0!important;}
          .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
          .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
          .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
          .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
          .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
          .radius6 {border-radius: 6px!important;}
          .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
          .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
          .center-on-mobile {text-align: center!important;}
          .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        }
        </style>
        <style type="text/css" class="export-delete"> 
          .composer--mobile table.row {width: 100%!important;max-width: 100%!important;}
          .composer--mobile td.row {width: 100%!important;max-width: 100%!important;}
          .composer--mobile .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
          .composer--mobile .center-float {float: none!important;margin:auto!important;}
          .composer--mobile .center-text{text-align: center!important;}
          #composer table.container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
          #composer table.container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
          .composer--mobile .hide-mobile {display: none!important;}
          .composer--mobile .menu-container {text-align: center !important;}
          .composer--mobile .autoheight {height: auto!important;}
          .composer--mobile .m-padding-10 {margin: 10px 0!important;}
          .composer--mobile .m-padding-15 {margin: 15px 0!important;}
          .composer--mobile .m-padding-20 {margin: 20px 0!important;}
          .composer--mobile .m-padding-30 {margin: 30px 0!important;}
          .composer--mobile .m-padding-40 {margin: 40px 0!important;}
          .composer--mobile .m-padding-50 {margin: 50px 0!important;}
          .composer--mobile .m-padding-60 {margin: 60px 0!important;}
          .composer--mobile .m-padding-top10 {margin: 30px 0 0 0!important;}
          .composer--mobile .m-padding-top15 {margin: 15px 0 0 0!important;}
          .composer--mobile .m-padding-top20 {margin: 20px 0 0 0!important;}
          .composer--mobile .m-padding-top30 {margin: 30px 0 0 0!important;}
          .composer--mobile .m-padding-top40 {margin: 40px 0 0 0!important;}
          .composer--mobile .m-padding-top50 {margin: 50px 0 0 0!important;}
          .composer--mobile .m-padding-top60 {margin: 60px 0 0 0!important;}
          .composer--mobile .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
          .composer--mobile .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
          .composer--mobile .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
          .composer--mobile .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
          .composer--mobile .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
          .composer--mobile .radius6 {border-radius: 6px!important;}
          .composer--mobile .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
          .composer--mobile .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
          .composer--mobile .center-on-mobile {text-align: center!important;}
          .composer--mobile .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        </style>
        </head>
        
        <body data-bgcolor="Body" style="margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#160C1E">
        
        <span class="preheader-text" data-preheader-text style="color: transparent; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0; display: none; mso-hide: all;"></span>
        
        <!-- Preheader white space hack -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        
        <div data-primary-font="Poppins" data-secondary-font="Roboto" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"></div>
        
        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
          <tr><!-- Outer Table -->
            <td align="center" data-bgcolor="Body" bgcolor="#160C1E" data-composer>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-preheader-1">
          <!-- colibri-preheader-1 -->
          <tr>
            <td align="center" bgcolor="#160C1E" data-bgcolor="BgColor">
        
        <!-- Content -->
        <table data-inner-table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="inner-table row" width="580" style="width:580px;max-width:580px;">
          <tr>
            <td height="20" style="font-size:20px;line-height:20px;" data-height="Spacing top">&nbsp;</td>
          </tr>
          <tr>
            <td align="center">
              
        <!-- rwd-col -->
        <table border="0" cellpadding="0" cellspacing="0" align="center" class="container-padding" width="100%" style="width:100%;max-width:100%;">
          <tr>
            <td class="rwd-col" align="center" width="46.66%" style="width:46.66%;max-width:46.66%;">
        
        <!-- column -->
        <table border="0" align="center" cellpadding="0" cellspacing="0"  role="presentation" width="100%" style="width:100%;max-width:100%;">
          <tr data-element="colibri-preheader-1-title" data-label="Titles">
            <td class="center-text" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:15px;line-height:12px;font-style:normal;font-weight:700;color:#FB38FF;text-decoration:none;letter-spacing:0px;">
              <webversion href="https://metasnooker.io/" data-mergetag="Web version" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:15px;line-height:12px;font-style:normal;font-weight:700;color:#34BFFE;text-decoration:underline;letter-spacing:0px;">Metasnooker</webversion>
            </td>
          </tr>
        </table>
        <!-- column -->
        
        </td>
        <td class="rwd-col" align="center" width="6.66%" height="20" style="width:6.66%;max-width:6.66%;height:20px;">&nbsp;</td>
        <td class="rwd-col" align="center" width="46.66%" style="width:46.66%;max-width:46.66%;">
        
        <!-- column -->
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
          <tr data-element="colibri-preheader-1-webview" data-label="Webview">
            <td class="center-text" align="right">
              <webversion href="https://metasnooker.io/dashboard" data-mergetag="Web version" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:9px;line-height:12px;font-style:normal;font-weight:700;color:#34BFFE;text-decoration:underline;letter-spacing:0px;">DASHBOARD</webversion>
            </td>
          </tr>
        </table>
        <!-- column -->
        
            </td>
          </tr>
        </table>
        <!-- rwd-col -->
        
            </td>
          </tr>
          <tr data-element="colibri-preheader-1-logo" data-label="Logo">
            <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing above logo">&nbsp;</td>
          </tr>
          <tr data-element="colibri-preheader-1-logo" data-label="Logo">
            <td align="center" class="center-text">
              <img style="width:220px;border:0px;display: inline!important;" src="https://metasnooker.io/social/dashboardlogo.png" width="120" border="0" editable="true" data-icon data-image-edit data-url data-label="Logo" data-image-width alt="logo">
            </td>
          </tr>
          <tr>
            <td height="20" style="font-size:20px;line-height:20px;" data-height="Spacing bottom">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-preheader-1 -->
        </table>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-header-1">
          <!-- colibri-header-1 -->
          <tr>
            <td align="center" data-fallback-color="Fallback Color" bgcolor="#160C1E">
        
        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0.5" position="0.5, 0.5" src="images/header-1-back.png" type="tile" size="1,1" aspect="atleast"></v:fill>
        <v:textbox style="mso-fit-shape-to-text:true;" inset="0,0,0,0">
        
        
        </v:textbox></v:rect>
        
            </td>
          </tr>
          <!-- colibri-header-1 -->
        </table>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-basic-message-1">
          <!-- colibri-basic-message-1 -->
          <tr>
            <td align="center" bgcolor="#160C1E" data-bgcolor="BgColor">
        
        <!-- Content -->
        <table data-inner-table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="inner-table row" width="580" style="width:580px;max-width:580px;">
          <tr>
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing top">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-headline" data-label="Headlines">
            <td class="center-text" data-text-style="Headlines" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:38px;line-height:48px;font-weight:800;font-style:normal;color:#ffffff;text-decoration:none;letter-spacing:0px;">
                <singleline>
                  <div mc:edit data-text-edit>
                    We are so happy to see you!
                  </div>
                </singleline>
            </td>
          </tr>
          <tr data-element="colibri-bm-headline" data-label="Headlines">
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing under headline">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-paragraph" data-label="Paragraphs">
            <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#ffffff;text-decoration:none;letter-spacing:0px;">
                <singleline>
                  <div mc:edit data-text-edit>
                  <p style="color:#FB38FF">Hi ${user_.email}<p><br><p>To reset  your password, click on the button given below.</p> 
                  <br>
                  </div>
                </singleline>
            </td>
          </tr>
          <tr data-element="colibri-bm-paragraph" data-label="Paragraphs">
            <td height="25" style="font-size:25px;line-height:25px;" data-height="Spacing under paragraph">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-button" data-label="Buttons">
            <td align="center">
              <!-- Button -->
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="center-float">
                <tr>
                  <td align="center" data-border-radius-default="0,6,36" data-border-radius-custom="Buttons" data-bgcolor="Buttons" bgcolor="#FB38FF" style="border-radius: 36px;">
              <!--[if (gte mso 9)|(IE)]>
                <table border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td align="center" width="35"></td>
                    <td align="center" height="50" style="height:50px;">
                    <![endif]-->
                      <singleline>
                        <a href="${link}" mc:edit data-button data-text-style="Buttons" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;padding: 15px 35px 15px 35px;display: inline-block;"><span>Click here to verify</span></a>
                      </singleline>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    <td align="center" width="35"></td>
                  </tr>
                </table>
              <![endif]-->
                  </td>
                </tr>
              </table>
              <!-- Buttons -->
            </td>
          </tr>
          <tr>
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing bottom">&nbsp;</td>
          </tr>
          <tr data-element="colibri-footer-buttons" data-label="Buttons">
            <td height="40" style="font-size:40px;line-height:40px;" data-height="Spacing under buttons">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-basic-message-1 -->
        </table>
        
        
        
        
        
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;" data-module="colibri-footer">
          <!-- colibri-footer -->
          <tr>
            <td align="center">
              
        <!-- Content -->
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row container-padding" width="520" style="width:520px;max-width:520px;">
          <tr>
            <td height="40" style="font-size:60px;line-height:60px;" data-height="Footer spacing top">&nbsp;</td>
          </tr>
          <tr data-element="colibri-footer-social-icons" data-label="Social Icons">
            <td align="center">
              <!-- Social Icons -->
              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                <tr>
                  <td align="center">
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td data-element="colibri-footer-facebook" data-label="Facebook" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://t.me/MetaSnooker" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/telegram.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Telegram" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-instagram" data-label="Instagram" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://metasnooker.medium.com/" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/medium.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Medium" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-twitter" data-label="Twitter" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                                <a href="https://twitter.com/Snooker_Meta" target="_blank" >
                                  <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/twitter.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Twitter" data-image-width alt="icon">
                              </a>
                              </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-pinterest" data-label="Pinterest" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://www.instagram.com/meta.snooker/" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/insta.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Instagram" data-image-width alt="icon">
                              
                              </a>
                              </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-pinterest" data-label="Pinterest" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://discord.com/invite/8dPAQC3s" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/discord.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Discord" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Social Icons -->
            </td>
          </tr>
        
          
          <tr data-element="colibri-footer-divider" data-label="Dividers">
            <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing under divider">&nbsp;</td>
          </tr>
         
          <tr>
            <td height="60" style="font-size:60px;line-height:60px;" data-height="Footer spacing bottom">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-footer -->
        </table>
        
            </td>
          </tr><!-- Outer-Table -->
        </table>
        
        </body>`;
        // let html = `<p>Hi ${user_.email}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
        //           <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({to, from, subject, html});

        res.status(200).json({message: 'Email-Send',id: user_.id });
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}

async function sendVerificationEmail1(user, req, res){
    try{
        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        let subject = "Account Verification Token";
        let to = user.email;
        let from = "metasnooker@gmail.com";
        let link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
        let html = `<style type="text/css">
        /*Basics*/
        body {margin:0px !important; padding:0px !important; display:block !important; min-width:100% !important; width:100% !important; -webkit-text-size-adjust:none;}
        table {border-spacing:0; mso-table-lspace:0pt; mso-table-rspace:0pt;}
        table td {border-collapse: collapse;mso-line-height-rule:exactly;}
        td img {-ms-interpolation-mode:bicubic; width:auto; max-width:auto; height:auto; margin:auto; display:block!important; border:0px;}
        td p {margin:0; padding:0;}
        td div {margin:0; padding:0;}
        td a {text-decoration:none; color: inherit;}
        /*Outlook*/
        .ExternalClass {width: 100%;}
        .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height:inherit;}
        .ReadMsgBody {width:100%; background-color: #ffffff;}
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;} 
        /*Gmail blue links*/
        u + #body a {color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
        /*Buttons fix*/
        .undoreset a, .undoreset a:hover {text-decoration:none !important;}
        .yshortcuts a {border-bottom:none !important;}
        .ios-footer a {color:#aaaaaa !important;text-decoration:none;}
        /* data-outer-table="800 - 600" */
        .outer-table {width:640px!important;max-width:640px!important;}
        /* data-inner-table="780 - 540" */
        .inner-table {width:580px!important;max-width:580px!important;}
        /*Responsive-Tablet*/
        @media only screen and (max-width: 799px) and (min-width: 601px) {
          .outer-table.row {width:640px!important;max-width:640px!important;}
          .inner-table.row {width:580px!important;max-width:580px!important;}
        }
        /*Responsive-Mobile*/
        @media only screen and (max-width: 600px) and (min-width: 320px) {
          table.row {width: 100%!important;max-width: 100%!important;}
          td.row {width: 100%!important;max-width: 100%!important;}
          .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
          .center-float {float: none!important;margin:auto!important;}
          .center-text{text-align: center!important;}
          .container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
          .container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
          .hide-mobile {display: none!important;}
          .menu-container {text-align: center !important;}
          .autoheight {height: auto!important;}
          .m-padding-10 {margin: 10px 0!important;}
          .m-padding-15 {margin: 15px 0!important;}
          .m-padding-20 {margin: 20px 0!important;}
          .m-padding-30 {margin: 30px 0!important;}
          .m-padding-40 {margin: 40px 0!important;}
          .m-padding-50 {margin: 50px 0!important;}
          .m-padding-60 {margin: 60px 0!important;}
          .m-padding-top10 {margin: 30px 0 0 0!important;}
          .m-padding-top15 {margin: 15px 0 0 0!important;}
          .m-padding-top20 {margin: 20px 0 0 0!important;}
          .m-padding-top30 {margin: 30px 0 0 0!important;}
          .m-padding-top40 {margin: 40px 0 0 0!important;}
          .m-padding-top50 {margin: 50px 0 0 0!important;}
          .m-padding-top60 {margin: 60px 0 0 0!important;}
          .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
          .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
          .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
          .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
          .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
          .radius6 {border-radius: 6px!important;}
          .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
          .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
          .center-on-mobile {text-align: center!important;}
          .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        }
        </style>
        <style type="text/css" class="export-delete"> 
          .composer--mobile table.row {width: 100%!important;max-width: 100%!important;}
          .composer--mobile td.row {width: 100%!important;max-width: 100%!important;}
          .composer--mobile .img-responsive img {width:100%!important;max-width: 100%!important;height: auto!important;margin: auto;}
          .composer--mobile .center-float {float: none!important;margin:auto!important;}
          .composer--mobile .center-text{text-align: center!important;}
          #composer table.container-padding {width: 100%!important;padding-left: 15px!important;padding-right: 15px!important;}
          #composer table.container-padding10 {width: 100%!important;padding-left: 10px!important;padding-right: 10px!important;}
          .composer--mobile .hide-mobile {display: none!important;}
          .composer--mobile .menu-container {text-align: center !important;}
          .composer--mobile .autoheight {height: auto!important;}
          .composer--mobile .m-padding-10 {margin: 10px 0!important;}
          .composer--mobile .m-padding-15 {margin: 15px 0!important;}
          .composer--mobile .m-padding-20 {margin: 20px 0!important;}
          .composer--mobile .m-padding-30 {margin: 30px 0!important;}
          .composer--mobile .m-padding-40 {margin: 40px 0!important;}
          .composer--mobile .m-padding-50 {margin: 50px 0!important;}
          .composer--mobile .m-padding-60 {margin: 60px 0!important;}
          .composer--mobile .m-padding-top10 {margin: 30px 0 0 0!important;}
          .composer--mobile .m-padding-top15 {margin: 15px 0 0 0!important;}
          .composer--mobile .m-padding-top20 {margin: 20px 0 0 0!important;}
          .composer--mobile .m-padding-top30 {margin: 30px 0 0 0!important;}
          .composer--mobile .m-padding-top40 {margin: 40px 0 0 0!important;}
          .composer--mobile .m-padding-top50 {margin: 50px 0 0 0!important;}
          .composer--mobile .m-padding-top60 {margin: 60px 0 0 0!important;}
          .composer--mobile .m-height10 {font-size:10px!important;line-height:10px!important;height:10px!important;}
          .composer--mobile .m-height15 {font-size:15px!important;line-height:15px!important;height:15px!important;}
          .composer--mobile .m-height20 {font-size:20px!important;line-height:20px!important;height:20px!important;}
          .composer--mobile .m-height25 {font-size:25px!important;line-height:25px!important;height:25px!important;}
          .composer--mobile .m-height30 {font-size:30px!important;line-height:30px!important;height:30px!important;}
          .composer--mobile .radius6 {border-radius: 6px!important;}
          .composer--mobile .fade-white {background-color: rgba(255, 255, 255, 0.8)!important;}
          .composer--mobile .rwd-on-mobile {display: inline-block!important;padding: 5px!important;}
          .composer--mobile .center-on-mobile {text-align: center!important;}
          .composer--mobile .rwd-col {width:100%!important;max-width:100%!important;display:inline-block!important;}
        </style>
        </head>
        
        <body data-bgcolor="Body" style="margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" bgcolor="#160C1E">
        
        <span class="preheader-text" data-preheader-text style="color: transparent; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0; display: none; mso-hide: all;"></span>
        
        <!-- Preheader white space hack -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        </div>
        
        <div data-primary-font="Poppins" data-secondary-font="Roboto" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"></div>
        
        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%;">
          <tr><!-- Outer Table -->
            <td align="center" data-bgcolor="Body" bgcolor="#160C1E" data-composer>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-preheader-1">
          <!-- colibri-preheader-1 -->
          <tr>
            <td align="center" bgcolor="#160C1E" data-bgcolor="BgColor">
        
        <!-- Content -->
        <table data-inner-table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="inner-table row" width="580" style="width:580px;max-width:580px;">
          <tr>
            <td height="20" style="font-size:20px;line-height:20px;" data-height="Spacing top">&nbsp;</td>
          </tr>
          <tr>
            <td align="center">
              
        <!-- rwd-col -->
        <table border="0" cellpadding="0" cellspacing="0" align="center" class="container-padding" width="100%" style="width:100%;max-width:100%;">
          <tr>
            <td class="rwd-col" align="center" width="46.66%" style="width:46.66%;max-width:46.66%;">
        
        <!-- column -->
        <table border="0" align="center" cellpadding="0" cellspacing="0"  role="presentation" width="100%" style="width:100%;max-width:100%;">
          <tr data-element="colibri-preheader-1-title" data-label="Titles">
            <td class="center-text" align="left" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:15px;line-height:12px;font-style:normal;font-weight:700;color:#FB38FF;text-decoration:none;letter-spacing:0px;">
              <webversion href="https://metasnooker.io/" data-mergetag="Web version" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:15px;line-height:12px;font-style:normal;font-weight:700;color:#34BFFE;text-decoration:underline;letter-spacing:0px;">Metasnooker</webversion>
            </td>
          </tr>
        </table>
        <!-- column -->
        
        </td>
        <td class="rwd-col" align="center" width="6.66%" height="20" style="width:6.66%;max-width:6.66%;height:20px;">&nbsp;</td>
        <td class="rwd-col" align="center" width="46.66%" style="width:46.66%;max-width:46.66%;">
        
        <!-- column -->
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
          <tr data-element="colibri-preheader-1-webview" data-label="Webview">
            <td class="center-text" align="right">
              <webversion href="https://metasnooker.io/dashboard" data-mergetag="Web version" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:9px;line-height:12px;font-style:normal;font-weight:700;color:#34BFFE;text-decoration:underline;letter-spacing:0px;">DASHBOARD</webversion>
            </td>
          </tr>
        </table>
        <!-- column -->
        
            </td>
          </tr>
        </table>
        <!-- rwd-col -->
        
            </td>
          </tr>
          <tr data-element="colibri-preheader-1-logo" data-label="Logo">
            <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing above logo">&nbsp;</td>
          </tr>
          <tr data-element="colibri-preheader-1-logo" data-label="Logo">
            <td align="center" class="center-text">
              <img style="width:220px;border:0px;display: inline!important;" src="https://metasnooker.io/social/dashboardlogo.png" width="120" border="0" editable="true" data-icon data-image-edit data-url data-label="Logo" data-image-width alt="logo">
            </td>
          </tr>
          <tr>
            <td height="20" style="font-size:20px;line-height:20px;" data-height="Spacing bottom">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-preheader-1 -->
        </table>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-header-1">
          <!-- colibri-header-1 -->
          <tr>
            <td align="center" data-fallback-color="Fallback Color" bgcolor="#160C1E">
        
        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;">
        <v:fill origin="0.5, 0.5" position="0.5, 0.5" src="images/header-1-back.png" type="tile" size="1,1" aspect="atleast"></v:fill>
        <v:textbox style="mso-fit-shape-to-text:true;" inset="0,0,0,0">
        
        
        </v:textbox></v:rect>
        
            </td>
          </tr>
          <!-- colibri-header-1 -->
        </table>
        
        <table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="640" style="width:640px;max-width:640px;" data-module="colibri-basic-message-1">
          <!-- colibri-basic-message-1 -->
          <tr>
            <td align="center" bgcolor="#160C1E" data-bgcolor="BgColor">
        
        <!-- Content -->
        <table data-inner-table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="inner-table row" width="580" style="width:580px;max-width:580px;">
          <tr>
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing top">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-headline" data-label="Headlines">
            <td class="center-text" data-text-style="Headlines" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:38px;line-height:48px;font-weight:800;font-style:normal;color:#ffffff;text-decoration:none;letter-spacing:0px;">
                <singleline>
                  <div mc:edit data-text-edit>
                    We are so happy to see you!
                  </div>
                </singleline>
            </td>
          </tr>
          <tr data-element="colibri-bm-headline" data-label="Headlines">
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing under headline">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-paragraph" data-label="Paragraphs">
            <td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#ffffff;text-decoration:none;letter-spacing:0px;">
                <singleline>
                  <div mc:edit data-text-edit>
                  <p style="color:#FB38FF">Hi ${user_.email}<p><br><p>To reset  your password, click on the button given below.</p> 
                  <br>
                  </div>
                </singleline>
            </td>
          </tr>
          <tr data-element="colibri-bm-paragraph" data-label="Paragraphs">
            <td height="25" style="font-size:25px;line-height:25px;" data-height="Spacing under paragraph">&nbsp;</td>
          </tr>
          <tr data-element="colibri-bm-button" data-label="Buttons">
            <td align="center">
              <!-- Button -->
              <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="center-float">
                <tr>
                  <td align="center" data-border-radius-default="0,6,36" data-border-radius-custom="Buttons" data-bgcolor="Buttons" bgcolor="#FB38FF" style="border-radius: 36px;">
              <!--[if (gte mso 9)|(IE)]>
                <table border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td align="center" width="35"></td>
                    <td align="center" height="50" style="height:50px;">
                    <![endif]-->
                      <singleline>
                        <a href="${link}" mc:edit data-button data-text-style="Buttons" style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;padding: 15px 35px 15px 35px;display: inline-block;"><span>Click here to verify</span></a>
                      </singleline>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    <td align="center" width="35"></td>
                  </tr>
                </table>
              <![endif]-->
                  </td>
                </tr>
              </table>
              <!-- Buttons -->
            </td>
          </tr>
          <tr>
            <td height="15" style="font-size:15px;line-height:15px;" data-height="Spacing bottom">&nbsp;</td>
          </tr>
          <tr data-element="colibri-footer-buttons" data-label="Buttons">
            <td height="40" style="font-size:40px;line-height:40px;" data-height="Spacing under buttons">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-basic-message-1 -->
        </table>
        
        
        
        
        
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;" data-module="colibri-footer">
          <!-- colibri-footer -->
          <tr>
            <td align="center">
              
        <!-- Content -->
        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row container-padding" width="520" style="width:520px;max-width:520px;">
          <tr>
            <td height="40" style="font-size:60px;line-height:60px;" data-height="Footer spacing top">&nbsp;</td>
          </tr>
          <tr data-element="colibri-footer-social-icons" data-label="Social Icons">
            <td align="center">
              <!-- Social Icons -->
              <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%;">
                <tr>
                  <td align="center">
                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td data-element="colibri-footer-facebook" data-label="Facebook" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://t.me/MetaSnooker" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/telegram.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Telegram" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-instagram" data-label="Instagram" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://metasnooker.medium.com/" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/medium.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Medium" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-twitter" data-label="Twitter" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                                <a href="https://twitter.com/Snooker_Meta" target="_blank" >
                                  <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/twitter.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Twitter" data-image-width alt="icon">
                              </a>
                              </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-pinterest" data-label="Pinterest" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://www.instagram.com/meta.snooker/" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/insta.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Instagram" data-image-width alt="icon">
                              
                              </a>
                              </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                        <td data-element="colibri-footer-pinterest" data-label="Pinterest" class="rwd-on-mobile" align="center" valign="middle" height="36" style="height: 36px;">
                          <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td width="10"></td>
                              <td align="center">
                              <a href="https://discord.com/invite/8dPAQC3s" target="_blank" >
                                <img style="width:36px;border:0px;display: inline!important;" src="https://metasnooker.io/social/discord.png" width="36" border="0" editable="true" data-icon data-image-edit data-url data-label="Discord" data-image-width alt="icon">
                              </a>
                                </td>
                              <td width="10"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Social Icons -->
            </td>
          </tr>
        
          
          <tr data-element="colibri-footer-divider" data-label="Dividers">
            <td height="30" style="font-size:30px;line-height:30px;" data-height="Spacing under divider">&nbsp;</td>
          </tr>
         
          <tr>
            <td height="60" style="font-size:60px;line-height:60px;" data-height="Footer spacing bottom">&nbsp;</td>
          </tr>
        </table>
        <!-- Content -->
        
            </td>
          </tr>
          <!-- colibri-footer -->
        </table>
        
            </td>
          </tr><!-- Outer-Table -->
        </table>
        
        </body>`;

        await sendEmail({to, from, subject, html});

        res.status(200).json({message: 'email-send'});
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}
