const express = require('express');
const router  = express.Router();
const {signUp,login,getAllUsers} = require('../controllers/users')


router.route('/users/signup').post(signUp);
router.route('/users/login').post(login)
router.route('/users/getAllUsers').get(getAllUsers);
module.exports = router;