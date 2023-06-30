const Chat = require("../models/chats");
async function addMsg(req, res, next) {
	try {
		let obj = {
			message: req.body.message,
			name: req.body.userName,
			userId: req.body.userId,
		};
		await Chat.create(obj);
		res.status(200).json({ msg: "message sent" });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "message not sent", err: error });
	}
}

async function getPrevChat(req, res, next) {
	try {
		let chats = await Chat.findAll();
		res.status(201).json(chats);
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "unable to load chats at this moment. Please try refreshing page", err: error });
	}
}

module.exports = { addMsg, getPrevChat };
