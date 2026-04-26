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
  "inuramethnuka879@gmail.com": "Inura",
  "vinupa@gmail.com": "Vinupa",
  "thamiduranmina4@gmail.com": "Thamidu",
  "janoghachamindu@gmail.com": "Chamidu",
  "hashandev20030723@gmail.com": "Hashan Devinda"
};

// LOGIN
auth.onAuthStateChanged(user=>{
  if(!user) location="index.html";

  currentUser = user.email;
  setOnline();
  loadUsers();
});

// ONLINE STATUS
function setOnline(){
  let ref = db.ref("status/"+currentUser);
  ref.set({online:true});

  ref.onDisconnect().set({
    online:false,
    lastSeen:Date.now()
  });
}

// LOAD USERS
function loadUsers(){
  userList.innerHTML="";
  Object.keys(users).forEach(u=>{
    if(u!==currentUser){
      let li=document.createElement("li");
      li.innerText=users[u];
      li.onclick=()=>selectChat(u);
      userList.appendChild(li);
    }
  });
}

// SELECT CHAT
function selectChat(u){
  selectedUser=u;
  chatName.innerText=users[u];

  // show status
  db.ref("status/"+u).on("value",snap=>{
    let s=snap.val();
    if(s?.online){
      statusText.innerText="Online 🟢";
    } else if(s?.lastSeen){
      statusText.innerText="Last seen "+new Date(s.lastSeen).toLocaleTimeString();
    }
  });

  loadMessages();
}

// SEND MSG
function sendMsg(){
  let text=msg.value.trim();
  if(!text || !selectedUser) return;

  let id=[currentUser,selectedUser].sort().join("_");

  db.ref("chats/"+id).push({
    from:currentUser,
    text,
    time:Date.now(),
    seen:false
  });

  msg.value="";
}

// LOAD MSG
function loadMessages(){
  let id=[currentUser,selectedUser].sort().join("_");

  db.ref("chats/"+id).on("value",snap=>{
    messages.innerHTML="";

    snap.forEach(c=>{
      let d=c.val();

      let div=document.createElement("div");
      div.className=d.from===currentUser?"me":"other";

      let time=new Date(d.time).toLocaleTimeString();

      div.innerHTML=`
        ${d.text}
        <div class="meta">
          ${time} ${d.from===currentUser?(d.seen?"✓✓":"✓"):""}
        </div>
      `;

      // mark seen
      if(d.from!==currentUser){
        c.ref.update({seen:true});
      }

      messages.appendChild(div);
    });

    messages.scrollTop=messages.scrollHeight;
  });
}

// TYPING
function typingNow(){
  if(!selectedUser) return;

  db.ref("typing/"+selectedUser).set(currentUser);

  setTimeout(()=>{
    db.ref("typing/"+selectedUser).remove();
  },1500);
}

db.ref("typing").on("value",snap=>{
  if(snap.val()===selectedUser){
    typing.innerText="Typing...";
  } else typing.innerText="";
});

// IMAGE SEND
imgInput.onchange=e=>{
  let file=e.target.files[0];
  let ref=storage.ref("images/"+Date.now());

  ref.put(file).then(()=>{
    ref.getDownloadURL().then(url=>{
      msg.value=url;
      sendMsg();
    });
  });
};

// EMOJI
function addEmoji(){
  msg.value += "😊";
}

// SIDEBAR
function toggleSidebar(){
  sidebar.classList.toggle("hide");
}

// LOGOUT
function logout(){
  if(confirm("Logout?")){
    auth.signOut().then(()=>location="index.html");
  }
}
