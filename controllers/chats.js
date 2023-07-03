const Chat = require("../models/chats");
const AWS = require("aws-sdk");
const fs = require("fs");

async function addMsg(req, res, next) {
	try {
		let obj = {
			message: req.body.message,
			name: req.body.userName,
			userId: req.body.userId,
			groupId: req.body.groupId,
			type:'text'
		};
		await Chat.create(obj);
		res.status(200).json({ msg: "message sent", data: req.body.userName });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "message not sent", err: error });
	}
}

async function getPrevChat(req, res, next) {
	try {
		const { groupId } = req.params;
		let chats = await Chat.findAll({ where: { groupId: groupId } });
		res.status(201).json(chats);
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "unable to load chats at this moment. Please try refreshing page", err: error });
	}
}

async function uploadFile(req, res, next) {
	try {
		const { groupId } = req.params;
		const { userId, userName } = req.body;

		const filename = "File" + userId + "/" + Date.now() + req.file.originalname;
		const fileURL = await uploadToS3(req.file, filename);
		await Chat.create({
			groupId: groupId,
			userId: userId,
			message: fileURL,
			name: userName,
			type:'file'
		});

		res.status(200).send({ data: fileURL, username: userName });
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "error uploading file", err: error });
	}
}

async function uploadToS3(data, filename) {
	try {
		const fileStream = await fs.createReadStream(data.path);

		const BUCKET_NAME = process.env.BUCKET_NAME;
		const IAM_USER_KEY = process.env.IAM_USER_KEY;
		const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
		let s3bucket = new AWS.S3({
			accessKeyId: IAM_USER_KEY,
			secretAccessKey: IAM_USER_SECRET,
		});
		var params = {
			Bucket: BUCKET_NAME,
			Key: filename,
			Body: fileStream,
			ACL: "public-read",
		};
		const response = await s3bucket.upload(params).promise();
		await fs.unlinkSync(data.path);

		return response.Location;
	} catch (err) {
		console.log(err);
		return err;
	}
}

module.exports = { addMsg, getPrevChat, uploadFile };
