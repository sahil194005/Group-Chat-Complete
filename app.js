require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	socket.on("message", (msg, userName, groupId) => {
		io.emit("message", msg, userName, groupId);
	});
});

const userRoute = require("./routes/users");
const chatsRoute = require("./routes/chats");
const groupRoute = require("./routes/groups");
const path = require("path");

const sequelize = require("./db/connect");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/users");
const chats = require("./models/chats");
const Group = require("./models/group");

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN_IP }));

User.hasMany(chats);
chats.belongsTo(User);

Group.belongsToMany(User, { through: "UserGroups" });
User.belongsToMany(Group, { through: "UserGroups" });

chats.belongsTo(Group);
Group.hasMany(chats);

app.use(userRoute);
app.use(chatsRoute);
app.use(groupRoute);

(async () => {
	try {
		await sequelize.sync();

		http.listen(process.env.PORT, () => {
			console.log(`server listening on port ${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
})();
