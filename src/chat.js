var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var chatTab = document.getElementById('chatTab');
var userTab = document.getElementById('userTab');
var userList = document.getElementById('user-list');
var userListPanel = document.getElementById('user-list-panel');

socket.on('addToChat', function (data) {
    //detect if the user is at the end of the scroll
    var auto = false;
    if (Math.abs(chatText.scrollTop - (chatText.scrollHeight - chatText.offsetHeight)) < 1)
        auto = true;

    // add string into the chatbox
    chatText.innerHTML += '<div>' + data + '</div>';

    // auto scrolling to the most recent
    if (auto)
        chatText.scrollTop = chatText.scrollHeight - chatText.offsetHeight;
});

socket.on('refreshUserList', function (data) {
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }

    if (data[0] === undefined)
        return;

    if (data[0].name) {
        for (var i in data) {
            userList.innerHTML += '<li class="list-group-item">' + data[i].name + ' <span class="badge">' + data[i].score + '</span></li>';
        }

    } else {
        for (var j in data) {
            userList.innerHTML += '<li class="list-group-item">' + data[j] + '</li>';
        }
    }
});


socket.on('connectRoom', function (data) {
    //two ways of adding a child into div
    //console.log(data);
    clearChatUser();

    for (var i in data.chatTextList) {
        chatText.innerHTML += '<div><strong>' + data.chatTextList[i].userName + "</strong>: " + data.chatTextList[i].message + '</div>';
    }
    // auto scrolling to the most recent
    chatText.scrollTop = chatText.scrollHeight - chatText.offsetHeight;
})


socket.on('evalAnswer', function (data) {
    console.log(data);
});

chatForm.onsubmit = function (e) {
    e.preventDefault();
    if (chatInput.value[0] === '/')
        socket.emit('evalServer', chatInput.value.slice(1));
    else
        socket.emit('sendMsgToServer', chatInput.value);
    chatInput.value = '';
}

function clearChatUser() {
    while (chatText.firstChild) {
        chatText.removeChild(chatText.firstChild);
    }
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }
}

$(document).ready(function () {
    chatText.style.width = chatDiv.style.width;
    userListPanel.style.width = chatDiv.style.width;
})
userTab.onclick = function () {
    chatTab.setAttribute("class", "");
    userTab.setAttribute("class", "active");
    chatText.setAttribute("style", "display:none;");
    userListPanel.setAttribute("style", "display:flex;");
}
chatTab.onclick = function () {
    userTab.setAttribute("class", "");
    chatTab.setAttribute("class", "active");
    chatText.setAttribute("style", "display:inline;");
    userListPanel.setAttribute("style", "display:none;");
}