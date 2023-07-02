const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function signUp(req, res, next) {
	try {
		let emailRepeat = await User.findOne({ where: { email: req.body.email } });
		if (emailRepeat) {
			return res.status(500).json({ msg: "user already exists, Please login to continue" });
		} else {
			let salt = await bcrypt.genSalt(10);
			let hashedPassword = await bcrypt.hash(req.body.password, salt);
			req.body.password = hashedPassword;
			await User.create(req.body);
			res.status(201).json({ msg: "Successfully signed up" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "user cant be created (server side fault)", err: error });
	}
}
function generateAccessToken(obj) {
	return jwt.sign(obj, process.env.JWT_SECRET);
}

async function login(req, res, next) {
	try {
		let user = await User.findOne({ where: { email: req.body.email } });
		if (user) {
			let comp = await bcrypt.compare(req.body.password, user.password);
			if (comp) {
				let token = generateAccessToken({ userId: user.id, userName: user.name });
				res.status(200).json({ msg: "user logged in successfully", token: token });
			} else {
				return res.status(401).json({ msg: "Unauthorised User" });
			}
		} else {
			return res.status(404).json({ msg: "User not found" });
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: "unable to login", err: error });
	}
}

async function getAllUsers(req, res, next) {
	try {
		let response = await User.findAll();

		res.status(201).json(response);
	} catch (error) {
		console.log(error);
		res.json({ msg: "cannot find users", err: error });
	}
}
module.exports = { signUp, login, getAllUsers };
