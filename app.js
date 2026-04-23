import { db, ref, push, onValue } from "./firebase.js";
import { users } from "./users.js";

let currentUser = localStorage.getItem("user");
document.getElementById("me").innerText = currentUser;

let selectedUser = null;

// Load users
let ul = document.getElementById("users");

for(let u in users){
  if(u !== currentUser){
    let li = document.createElement("li");
    li.innerText = u;
    li.onclick = () => selectUser(u);
    ul.appendChild(li);
  }
}

function selectUser(u){
  selectedUser = u;
  document.getElementById("chatWith").innerText = "Chat with " + u;
  loadMessages();
}

// Send message
window.sendMsg = function(){
  let text = msg.value.trim();
  if(!text || !selectedUser) return;

  let chatId = getChatId(currentUser, selectedUser);

  push(ref(db, "chats/" + chatId), {
    from: currentUser,
    text: text
  });

  msg.value = "";
};

// Real-time messages
function loadMessages(){
  let chatId = getChatId(currentUser, selectedUser);

  onValue(ref(db, "chats/" + chatId), snapshot => {
    let box = document.getElementById("messages");
    box.innerHTML = "";

    snapshot.forEach(child => {
      let data = child.val();

      let div = document.createElement("div");

      if(data.from === currentUser){
        div.className = "me";
      } else {
        div.className = "other";
      }

      div.innerText = data.text;
      box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
  });
}

// Unique chat ID
function getChatId(a, b){
  return [a, b].sort().join("_");
}

window.logout = function(){
  localStorage.removeItem("user");
  location = "index.html";
};
