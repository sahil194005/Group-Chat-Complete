const express = require('express');
const router  = express.Router();
const {signUp,login} = require('../controllers/users')


router.route('/users/signup').post(signUp);
router.route('/users/login').post(login)
module.exports = router;