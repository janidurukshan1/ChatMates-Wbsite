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

// 👥 Your users
const users = [
  "janidurukshan300@gmail.com",
  "sadithapabasara94@gmail.com",
  "SasmithaDinadith335@gmail.com",
  "dulinasadith1127@gmail.com",
  "inura@gmail.com",
  "vinupa@gmail.com",
  "thamiduranmina4@gmail.com",
  "chamidu@gmail.com",
  "hashan@gmail.com"
];

// 🔐 Check login
auth.onAuthStateChanged(user=>{
  if(!user) location="index.html";
  currentUser = user.email;
  loadUsers();
});

// 👥 Load user list
function loadUsers(){
  userList.innerHTML = "";

  users.forEach(u=>{
    if(u !== currentUser){
      let li = document.createElement("li");
      li.innerText = u;
      li.onclick = ()=> selectUser(u);
      userList.appendChild(li);
    }
  });
}

// 🔑 Create chat ID
function getChatId(a,b){
  return [a,b].sort().join("_");
}

// 📥 Select chat
function selectUser(u){
  selectedUser = u;
  chatName.innerText = u;
  loadMessages();
}

// 📤 Send message
function sendMsg(){
  let text = msg.value.trim();
  if(!text || !selectedUser) return;

  let chatId = getChatId(currentUser, selectedUser);

  db.ref("chats/"+chatId).push({
    from: currentUser,
    text: text
  });

  msg.value="";
}

// 🔄 Load messages (REALTIME)
function loadMessages(){
  let chatId = getChatId(currentUser, selectedUser);

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

// 🚪 Logout
function logout(){
  auth.signOut().then(()=> location="index.html");
}
