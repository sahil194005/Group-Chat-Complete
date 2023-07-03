const express = require('express');
const router = express.Router();
const {addMsg,getPrevChat,uploadFile} = require('../controllers/chats')
const authorization = require('../middlewares/auth');
const fileupload = require('../middlewares/fileupload')

router.route('/chat').post(authorization,addMsg)
router.route('/chat/:groupId').get(authorization,getPrevChat);
router.route('/upload/:groupId').post(fileupload,authorization,uploadFile);

module.exports = router;