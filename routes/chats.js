const express = require('express');
const router = express.Router();
const {addMsg,getPrevChat} = require('../controllers/chats')
const authorization = require('../middlewares/auth');

router.route('/chat').post(authorization,addMsg)
router.route('/chat/:groupId').get(authorization,getPrevChat);

module.exports = router;