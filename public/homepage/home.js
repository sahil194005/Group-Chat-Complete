const socket = io("http://localhost:3000");

socket.on("message", (msg, userName, groupId) => {
	if (localStorage.getItem("currentGroupId")) {
		let gId = localStorage.getItem("currentGroupId");
		if (groupId == gId) {
			let newpara = document.createElement("p");
			newpara.innerText = `${userName}: ${msg}`;
			document.querySelector("#chatDiv").appendChild(newpara);
		}
	}
});

socket.on("file", (msg, userName, groupId) => {
	if (localStorage.getItem("currentGroupId")) {
		let gId = localStorage.getItem("currentGroupId");
		if (groupId == gId) {
			let newpara = document.createElement("p");

			let fileLink = document.createElement("a");
			fileLink.href = msg;
			fileLink.innerText = "Download File";

			newpara.appendChild(document.createTextNode(`${userName}: `));
			newpara.appendChild(fileLink);

			document.querySelector("#chatDiv").appendChild(newPara);
		}
	}
});

window.addEventListener("DOMContentLoaded", (e) => {
	displayGroupsLeft();
	loadChats();
});

function showMessageDiv(text) {
	let head2 = document.createElement("h2");
	head2.innerHTML = text;
	document.querySelector("#messageDiv").appendChild(head2);
	setTimeout(() => {
		document.querySelector("#messageDiv").innerHTML = "";
	}, 3000);
}

document.querySelector("#createGroupButton").addEventListener("click", async (e) => {
	e.preventDefault();

	createNewGroup();
});

function parseJwt(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

async function createNewGroup(e) {
	try {
		const groupName = prompt("Enter the name of group:");

		if (groupName) {
			let token = localStorage.getItem("token");
			let response = await axios.post("http://localhost:3000/groups", { groupName }, { headers: { authorization: token } });
			showMessageDiv(response.data.msg);
			displayGroupsLeft();
		} else {
			console.log("no member");
		}
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}

async function getAllGroups() {
	try {
		let token = localStorage.getItem("token");
		let response = await axios.get("http://localhost:3000/groups", { headers: { authorization: token } });
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

async function displayGroupsLeft() {
	try {
		let userId = parseJwt(localStorage.getItem("token")).userId;
		let groups = await getAllGroups();
		let ul = document.createElement("ul");
		for (let i = 0; i < groups.length; i++) {
			let li = document.createElement("li");

			li.setAttribute("groupId", groups[i].id);
			li.setAttribute("createdBy", groups[i].createdBy);
			li.textContent = groups[i].groupName;
			if (groups[i].createdBy == userId) {
				let addbutton = document.createElement("button");
				addbutton.textContent = "Add Members";
				addbutton.addEventListener("click", addMembers);

				let delbutton = document.createElement("button");
				delbutton.textContent = "Kick members";
				delbutton.addEventListener("click", kickMembers);

				let promotebutton = document.createElement("button");
				promotebutton.textContent = "change Admin";
				promotebutton.addEventListener("click", changeAdmin);

				let delGroupbutton = document.createElement("button");
				delGroupbutton.textContent = "delete group";
				delGroupbutton.addEventListener("click", deleteGroup);

				li.appendChild(addbutton);
				li.appendChild(delbutton);
				li.appendChild(promotebutton);
				li.appendChild(delGroupbutton);
			}
			let openChatbutton = document.createElement("button");
			openChatbutton.textContent = "open chat";
			openChatbutton.addEventListener("click", groupChatPage);
			li.appendChild(openChatbutton);
			ul.appendChild(li);
		}

		document.querySelector("#groupsListContainer").innerHTML = "";
		document.querySelector("#groupsListContainer").appendChild(ul);
	} catch (error) {
		console.log(error);
	}
}

async function kickMembers(e) {
	try {
		e.preventDefault();
		let groupid = e.target.parentElement.getAttribute("groupId");
		const memberEmail = prompt("Enter mail of person you want to kick out:");

		if (memberEmail) {
			let token = localStorage.getItem("token");
			let res = await axios.post("http://localhost:3000/groups/kickmembers", { memberEmail, groupid }, { headers: { authorization: token } });
			showMessageDiv(res.data.msg);
		} else {
			console.log("no member");
		}
	} catch (error) {
		console.log(error);
		showMessageDiv(error.res.data.msg);
	}
}

async function deleteGroup(e) {
	try {
		e.preventDefault();
		let groupid = e.target.parentElement.getAttribute("groupId");
		let token = localStorage.getItem("token");

		let res = await axios.delete(`http://localhost:3000/groups/deleteGroup/${groupid}`, { headers: { authorization: token } });
		showMessageDiv(res.data.msg);
		displayGroupsLeft();
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}

async function changeAdmin(e) {
	try {
		e.preventDefault();
		let groupid = e.target.parentElement.getAttribute("groupId");
		const memberEmail = prompt("Enter mail of person who you want to promote as admin");
		if (memberEmail) {
			let token = localStorage.getItem("token");
			let res = await axios.patch("http://localhost:3000/groups/promoteAdmin", { memberEmail, groupid }, { headers: { authorization: token } });
			showMessageDiv(res.data.msg);
			displayGroupsLeft();
		} else {
			console.log("no member");
		}
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}

async function addMembers(e) {
	try {
		e.preventDefault();
		let groupid = e.target.parentElement.getAttribute("groupId");
		const memberEmail = prompt("Enter member email:");
		if (memberEmail) {
			let token = localStorage.getItem("token");
			let res = await axios.post("http://localhost:3000/groups/addmembers", { memberEmail, groupid }, { headers: { authorization: token } });

			showMessageDiv(res.data.msg);
		} else {
			console.log("no member");
		}
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}

// *********************************************Chat Side

async function groupChatPage(e) {
	e.preventDefault();
	let groupId = e.target.parentElement.getAttribute("groupId");
	document.querySelector("#footer").style.visibility = "visible";
	document.querySelector("#chatDiv").style.visibility = "visible";
	localStorage.setItem("currentGroupId", groupId);
	loadChats();
}

document.querySelector("#sendBtn").addEventListener("click", sendMsg);

async function sendMsg(e) {
	try {
		e.preventDefault();

		if (document.querySelector("#uploadBtn").files[0]) {
			let token = localStorage.getItem("token");
			let groupId = localStorage.getItem("currentGroupId");
			let file = document.querySelector("#uploadBtn").files[0];
			let formData = new FormData();
			formData.append("file", file);
			console.log('before')



			let response = await axios.post(`http://localhost:3000/upload/${groupId}`, formData, { headers: { authorization: token }, "Content-Type": "multipart/form-data" });
			
			
			
			console.log('after');
			// socket.emit("file", response.data.data, response.data.username, groupId);
		} else {
			let msg = document.querySelector("#inputText").value;
			document.querySelector("#inputText").value = "";
			let token = localStorage.getItem("token");
			let groupId = localStorage.getItem("currentGroupId");
			let response = await axios.post("http://localhost:3000/chat", { message: msg, groupId: groupId }, { headers: { authorization: token } });
			socket.emit("message", msg, response.data.data, groupId);
		}
	} catch (error) {
		console.log(error);
	}
}

async function loadChats() {
	try {
		let token = localStorage.getItem("token");
		let groupId = localStorage.getItem("currentGroupId");
		let prevChats = await axios.get(`http://localhost:3000/chat/${groupId}`, { headers: { authorization: token } });
		DisplayPrevChats(prevChats.data);
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}

async function DisplayPrevChats(chats) {
	try {
		let token = localStorage.getItem("token");
		let curruser = parseJwt(token);
		let chatDiv = document.querySelector("#chatDiv");
		chatDiv.innerHTML = "";
		for (let i = 0; i < chats.length; i++) {
			let newpara = document.createElement("p");
			if (chats[i].type == "text") {
				if (chats[i].userId == curruser.userId) {
					newpara.innerText = `You: ${chats[i].message}`;
				} else {
					newpara.innerText = `${chats[i].name}: ${chats[i].message}`;
				}
			} else {
				let fileLink = document.createElement("a");
				fileLink.href = chats[i].message;
				fileLink.innerText = "click to See";

				newpara.appendChild(document.createTextNode(`${chats[i].name}: `));
				newpara.appendChild(fileLink);
			}

			chatDiv.appendChild(newpara);
		}
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}
