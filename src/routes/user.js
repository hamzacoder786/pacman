const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const User = require('../controllers/user');
const Data = require('../controllers/data');
const validate = require('../middlewares/validate');

const router = express.Router();

const upload = multer().single('profileImage');

//INDEX
router.get('/', User.index);

//STORE

router.get('/findone/:address', Data.findOne);
// router.get('/findoneuser/:address', User.findOne);


router.put('/update/:address', User.update);

router.put('/updatelogin/:address', User.updateLogin);



router.post('/data', [
    check('score'),
    check('reserved'),
    check('totalIngametoken'),
    check('result'),
    check('challengeprice'),
    // check('firstName').not().isEmpty().withMessage('You first name is required'),
    // check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, Data.store);


router.post('/', [
    check('address').isEmail().withMessage('invalid-address'),
    check('password').not().isEmpty().withMessage('password-required'),
    // check('firstName').not().isEmpty().withMessage('You first name is required'),
    // check('lastName').not().isEmpty().withMessage('You last name is required')
], validate, User.store);

//SHOW
router.get('/:id',  User.show);

//UPDATE
router.put('/:id', upload, User.update);

//DELETE
router.delete('/:id', User.destroy);

module.exports = router;