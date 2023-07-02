let loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", formSubmit);

function showMessageDiv(text) {
	let head2 = document.createElement("h2");
	head2.innerHTML = text;
	document.querySelector("#messageDiv").appendChild(head2);
	setTimeout(() => {
		document.querySelector("#messageDiv").innerHTML = "";
	}, 3000);
}


async function formSubmit(e) {
	try {
		e.preventDefault();
		let obj = {
			email: document.querySelector("#emailInput").value,
			password: document.querySelector("#passwordInput").value,
		};
       
		let response = await axios.post("http://localhost:3000/users/login", obj);
		if (response) {
			
			localStorage.setItem('token',response.data.token);
			if(localStorage.getItem('currentGroupId')){
				localStorage.removeItem('currentGroupId')
			}
			window.location.href = '../homepage/home.html'
		}
		
		
	} catch (error) {
		console.log(error);
		showMessageDiv(error.response.data.msg);
	}
}
