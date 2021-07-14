const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username'), room = urlParams.get('room');

// ELEMENTS
const messageBoard = document.getElementById("message-board");
const messageBox = document.getElementById("message-box");
const messageForm = document.getElementById("message-form");
const userList = document.getElementById("user-list");
const leaveButton = document.getElementById("leave-button");

// SETTING FOCUS BY DEFAULT
messageBox.focus();

// SETTING USERNAME IN UI
document.getElementById("username").innerHTML = username;

//  EVENTS
socket.emit('join', {username, room});

// LISTENERS
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    let msg = messageBox.value;
    if (msg.length > 0) {
        socket.emit('userSendMessage', msg);
        messageBox.value = "";
        messageBox.focus();
    }
});

leaveButton.addEventListener('click', e => {
    window.location = '../';
});

socket.on('userRecieveMessage', data => {
    let msgDiv = document.createElement("div");
    let msgClass = username == data.username ? 'sent-message' : 'recieved-message';
    msgDiv.innerHTML = `<p class="sender">${data.username}</p><p class"content">${data.message}`;
    msgDiv.classList.add("message",  msgClass);    
    messageBoard.appendChild(msgDiv);
    messageBoard.scrollTop = messageBoard.scrollHeight - messageBoard.clientHeight;
});

socket.on('userJoin', data => {
    displayConnectedUsers(data);
});

socket.on('userLeave', data => {
    displayConnectedUsers(data);
});

function displayConnectedUsers(data) {
    let htmlStr = '';
    for (user of data) {
        htmlStr += `<li>${user}</li>`;
    }
    userList.innerHTML = htmlStr;
}