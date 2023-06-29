const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/users");
const sequelize = require("./db/connect");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
	cors({
		origin:process.env.ORIGIN_IP,
	})
);
app.use(userRoute);

(async () => {
	try {
		await sequelize.sync();

		app.listen(process.env.PORT, () => {
			console.log(`server listening on port ${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
})();
