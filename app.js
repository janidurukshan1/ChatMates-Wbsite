import { db, ref, push, onValue, auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;
let selectedUser = null;

// Email → Display Name map
const nameMap = {
  "janidu@gmail.com": "Janidu Rukshan",
  "saditha@gmail.com": "Saditha",
  "sasmitha@gmail.com": "Sasmitha",
  "dulina@gmail.com": "Dulina",
  "inura@gmail.com": "Inura",
  "vinupa@gmail.com": "Vinupa",
  "thamidu@gmail.com": "Thamidu",
  "chamidu@gmail.com": "Chamidu",
  "hashan@gmail.com": "Hashan Devinda"
};

// 🔐 Check login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location = "index.html";
  } else {
    currentUser = user.email;
    document.getElementById("me").innerText = nameMap[currentUser] || currentUser;
    loadUsers();
  }
});

// 👥 Load users list
function loadUsers(){
  let ul = document.getElementById("users");
  ul.innerHTML = "";

  for(let email in nameMap){
    if(email !== currentUser){
      let li = document.createElement("li");
      li.innerText = nameMap[email];
      li.onclick = () => selectUser(email);
      ul.appendChild(li);
    }
  }
}

// 📥 Select user
function selectUser(email){
  selectedUser = email;
  document.getElementById("chatWith").innerText = "Chat with " + nameMap[email];
  loadMessages();
}

// 📤 Send message
window.sendMsg = function(){
  let text = document.getElementById("msg").value.trim();
  if(!text || !selectedUser) return;

  let chatId = getChatId(currentUser, selectedUser);

  push(ref(db, "chats/" + chatId), {
    from: currentUser,
    text: text
  });

  document.getElementById("msg").value = "";
};

// 🔄 Real-time messages
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

// 🔑 Unique chat ID
function getChatId(a, b){
  return [a, b].sort().join("_");
}

// 🚪 Logout
window.logout = function(){
  signOut(auth);
};
