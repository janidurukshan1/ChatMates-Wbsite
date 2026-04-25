const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://chatmates-e2c70-default-rtdb.firebaseio.com/",
  projectId: "chatmates-e2c70"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

let currentUser, selectedUser;

// USERS
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

// LOGIN CHECK
auth.onAuthStateChanged(user=>{
  if(!user) location="index.html";
  currentUser = user.email;
  loadUsers();
});

// LOAD USERS
function loadUsers(){
  userList.innerHTML="";
  Object.keys(users).forEach(u=>{
    if(u!==currentUser){
      let li=document.createElement("li");
      li.innerText=users[u];
      li.onclick=()=>selectChat(u,false);
      userList.appendChild(li);
    }
  });
}

// SELECT CHAT
function selectChat(id,isGroup){
  selectedUser={id,isGroup};
  chatName.innerText=users[id]||"Group";
  loadMessages();
}

// SEND
function sendMsg(){
  let text=msg.value.trim();
  if(!text||!selectedUser)return;

  let path = selectedUser.isGroup
    ? "groups/"+selectedUser.id+"/messages"
    : "chats/"+[currentUser,selectedUser.id].sort().join("_");

  db.ref(path).push({
    from:currentUser,
    text,
    time:Date.now()
  });

  msg.value="";
}

// LOAD MESSAGES
function loadMessages(){
  let path = selectedUser.isGroup
    ? "groups/"+selectedUser.id+"/messages"
    : "chats/"+[currentUser,selectedUser.id].sort().join("_");

  db.ref(path).on("value",snap=>{
    messages.innerHTML="";
    snap.forEach(c=>{
      let d=c.val();

      // delete after 7 days
      if(Date.now()-d.time>7*24*60*60*1000)return;

      let div=document.createElement("div");
      div.className=d.from===currentUser?"me":"other";
      div.innerText=d.text;
      messages.appendChild(div);
    });
  });
}

// PROFILE PIC
uploadPic.onchange=e=>{
  let file=e.target.files[0];
  let ref=storage.ref("profiles/"+currentUser);

  ref.put(file).then(()=>{
    ref.getDownloadURL().then(url=>{
      profilePic.src=url;
    });
  });
};

// GROUP
function openGroup(){
  groupModal.style.display="block";
}

function createGroup(){
  let name=groupName.value;
  let id="group_"+Date.now();

  db.ref("groups/"+id).set({
    name,
    members:[currentUser]
  });

  groupModal.style.display="none";
}

// STATUS
function setStatus(){
  let text=prompt("Status");
  db.ref("status/"+currentUser).set(text);
}

// LOGOUT
function logout(){
  auth.signOut().then(()=>location="index.html");
}
