const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://chatmates-e2c70-default-rtdb.firebaseio.com/",
  projectId: "chatmates-e2c70"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let selectedUser = null;

// 👥 USERS WITH NAMES
const users = {
  "janidurukshan300@gmail.com": "Janidu Rukshan",
  "sadithapabasara94@gmail.com": "Saditha",
  "sasmithadinadith335@gmail.com": "Sasmitha",
  "dulinasadith1127@gmail.com": "Dulina",
  "inura@gmail.com": "Inura",
  "vinupa@gmail.com": "Vinupa",
  "thamiduranmina4@gmail.com": "Thamidu",
  "janoghachamindu@gmail.com": "Chamidu",
  "hashandev20030723@gmail.com": "Hashan Devinda"
};

// 🔐 LOGIN CHECK
auth.onAuthStateChanged(user=>{
  if(!user) location="index.html";
  currentUser = user.email;
  loadUsers();
  loadGroups();
});

// 👥 LOAD USERS
function loadUsers(){
  userList.innerHTML = "";

  Object.keys(users).forEach(email=>{
    if(email !== currentUser){
      let li = document.createElement("li");

      li.innerHTML = `
        <div class="user-item">
          <div class="avatar">${users[email][0]}</div>
          <div>${users[email]}</div>
        </div>
      `;

      li.onclick = ()=> selectChat(email,false);
      userList.appendChild(li);
    }
  });
}

// 👥 LOAD GROUPS
function loadGroups(){
  db.ref("groups").on("value", snap=>{
    snap.forEach(g=>{
      let group = g.val();
      let id = g.key;

      let li = document.createElement("li");
      li.innerHTML = `👥 ${group.name}`;
      li.onclick = ()=> selectChat(id,true);

      userList.appendChild(li);
    });
  });
}

// 🔑 CHAT ID
function getChatId(a,b){
  return [a,b].sort().join("_");
}

// 📥 SELECT CHAT
function selectChat(id,isGroup){
  selectedUser = {id,isGroup};

  if(isGroup){
    chatName.innerText = "Group Chat";
    loadGroupMessages(id);
  } else {
    chatName.innerText = users[id];
    loadMessages(id);
  }
}

// 📤 SEND MESSAGE
function sendMsg(){
  let text = msg.value.trim();
  if(!text || !selectedUser) return;

  if(selectedUser.isGroup){
    db.ref("groups/"+selectedUser.id+"/messages").push({
      from: currentUser,
      text: text
    });
  } else {
    let chatId = getChatId(currentUser, selectedUser.id);

    db.ref("chats/"+chatId).push({
      from: currentUser,
      text: text
    });
  }

  msg.value="";
}

// 🔄 PRIVATE CHAT
function loadMessages(user){
  let chatId = getChatId(currentUser,user);

  db.ref("chats/"+chatId).on("value", snap=>{
    messages.innerHTML="";

    snap.forEach(c=>{
      let d = c.val();
      let div = document.createElement("div");

      div.className = d.from === currentUser ? "me" : "other";
      div.innerText = d.text;

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// 🔄 GROUP CHAT
function loadGroupMessages(id){
  db.ref("groups/"+id+"/messages").on("value", snap=>{
    messages.innerHTML="";

    snap.forEach(c=>{
      let d = c.val();
      let div = document.createElement("div");

      div.className = d.from === currentUser ? "me" : "other";
      div.innerText = users[d.from] + ": " + d.text;

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// 👥 CREATE GROUP
function openGroup(){
  let name = prompt("Group Name");
  let desc = prompt("Description");

  if(!name) return;

  let id = "group_"+Date.now();

  db.ref("groups/"+id).set({
    name,
    desc,
    members:[currentUser]
  });

  alert("Group Created!");
}

// 🚪 LOGOUT
function logout(){
  auth.signOut().then(()=> location="index.html");
}
