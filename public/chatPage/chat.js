window.addEventListener('DOMContentLoaded',loadChats);
let chatDiv = document.querySelector('#chatDiv');

let sendBtn = document.querySelector('#sendBtn');

set

function showMessageDiv(text) {
    let head2 = document.createElement("h2");
    head2.innerHTML = text;
    document.querySelector("#messageDiv").appendChild(head2);
    setTimeout(() => {
        document.querySelector("#messageDiv").innerHTML = "";
    }, 3000);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

sendBtn.addEventListener('click',sendMsg);
async function sendMsg(e){
    let msg = document.querySelector('#footer input').value
    add_msg_to_db(msg);
    
}


async function loadChats (){
try {
    let token  = localStorage.getItem('token');
    let prevChats = await axios.get('http://localhost:3000/chat',{headers:{authorization:token}});
    // console.log(prevChats);
    DisplayPrevChats(prevChats.data);
} catch (error) {
    console.log(error);
    // showMessageDiv(error.response.data.msg);

}
}

async function DisplayPrevChats(chats){
    try {
        let token = localStorage.getItem('token');
        let curruser = parseJwt(token);
       
        console.log(chats);
        for(let i = 0;i<chats.length;i++){
            let newpara = document.createElement('p');
            if(chats[i].userId==curruser.userId){
              newpara.innerText = `You: ${chats[i].message}`  ;

            } 
            else{
              newpara.innerText = `${chats[i].name}: ${chats[i].message}`  ;
            };
           
            chatDiv.appendChild(newpara)
        }
        
    } catch (error) {
        console.log(error);
        showMessageDiv(error.response.data.msg);
    }
}

async function add_msg_to_db(msg){
    try {
        let token = localStorage.getItem('token');
        let response = await axios.post('http://localhost:3000/chat',{message:msg},{headers:{authorization:token}});
        
    } catch (error) {
        console.log(error);
    }
}
