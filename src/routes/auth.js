const express = require('express');
const {check} = require('express-validator');

const Auth = require('../controllers/auth');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');
const Data = require('../controllers/data');
const User = require('../controllers/user');
require('dotenv').config();
const authenticate = require('../middlewares/authenticate');


let Secure = process.env.APP_ID



const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: "You are in the Auth Endpoint. Register or Login to test Authentication."});
});

router.get(`/?app_id=${Secure}/findone/:address`,authenticate, Data.findOne);

router.get(`/?app_id=${Secure}/findoneuser/:address`,authenticate, User.findOne);

router.get(`/owner/:address`, User.ownerFind);



// router.get(`/?app_id=${Secure}/findOneuserhistory/:id`,authenticate, Data.findOnedata);

// router.get(`/?app_id=${Secure}/findoneuser/:address`, User.findOne);
router.get(`/?app_id=${Secure}/findTopfive/:address`,authenticate, Data.findTopfive);

router.put(`/?app_id=${Secure}/ownertoken/:address`,[
    check('address'),
    check('inGametoken'),
], Auth.ownertokenupdate);

router.put(`/?app_id=${Secure}/update/:address`,[
    check('address'),
    check('inGametoken'),
],authenticate, Auth.update);
router.put(`/?app_id=${Secure}/updateNft/:address`,[
    check('address'),
    check('isNft'),
],authenticate, Auth.updateNft);

router.put(`/?app_id=${Secure}/updatehistory/:address`,[
    check('address'),
    check('result'),
    check('totalIngametoken'),
    check('rewardToken'),
],authenticate, Auth.updatehistory);

router.put(`/?app_id=${Secure}/updatelogin/:address`,[
    check('address'),
    check('isLogin'),
],authenticate, Auth.updateLogin);

router.post(`/?app_id=${Secure}/data`, [
    // check('score'),
    // check('reserved'),
    check('totalIngametoken'),
    check('result'),
    check('challengeprice'),
    check('rewardToken'),
    check('gameId'),
    
], authenticate, Auth.data);

router.post('/register', [
    check('email').isEmail().withMessage('invalid-email'),
    check('password'),
    // check('firstName').not().isEmpty().withMessage('You first name is required'),
    // check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, Auth.register);


router.post("/login", [
    check('email'),
    check('password').not().isEmpty(),
], validate, Auth.login);
// 





//EMAIL Verification
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

//Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('invalid-email'),
], validate, Password.recover);

//Password RESET game

router.post('/changepassword', [
    check('email').isEmail().withMessage('invalid-email'),
], validate, Password.gamerecover);


router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 6}).withMessage('too-short-password'),
    check('confirmPassword', 'missmatch-password').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);

router.delete('/:id', User.destroy);

router.get('/allUsers', User.findAll);

router.get('/count', Data.countBet);

router.get('/countHours', Data.countHours);


router.get('/getUser/:gameId', Auth.findOnebygameid);




module.exports = router;