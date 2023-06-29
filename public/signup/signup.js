let signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let obj = {
		name: document.querySelector("#nameInput").value,
		email: document.querySelector("#emailInput").value,
		phoneNo: document.querySelector("#phoneNoInput").value,
		password: document.querySelector("#passwordInput").value,
	};
    console.log(obj);
});
