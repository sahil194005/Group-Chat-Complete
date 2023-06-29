const User = require("../models/users");
const bcrypt = require("bcrypt");
async function signUp(req, res, next) {
	try {
		let emailRepeat = await User.findOne({ where: { email: req.body.email } });
		if (emailRepeat) {
			return res.status(500).json({ msg: "user already exists, Please login to continue" });
		} else {
			let salt =await bcrypt.genSalt(10);
			let hashedPassword =await  bcrypt.hash(req.body.password, salt);
			req.body.password = hashedPassword;
			await User.create(req.body);
			res.status(201).json({ msg:"Successfully signed up" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "user cant be created (server side fault)", err: error });
	}
}

module.exports = { signUp };
