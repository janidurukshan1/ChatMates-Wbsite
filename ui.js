const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://chatmates-e2c70-default-rtdb.firebaseio.com/",
  projectId: "chatmates-e2c70"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser;

// Auth check
auth.onAuthStateChanged(user=>{
  if(!user) location="index.html";
  currentUser = user.email;
});

// Send message
function sendMsg(){
  let text = msg.value;
  if(!text) return;

  db.ref("messages").push({
    user: currentUser,
    text: text
  });

  msg.value="";
}

// Load messages realtime
db.ref("messages").on("value", snap=>{
  messages.innerHTML="";
  snap.forEach(c=>{
    let d = c.val();

    let div = document.createElement("div");
    div.className = d.user === currentUser ? "me" : "other";
    div.innerText = d.text;

    messages.appendChild(div);
  });

  messages.scrollTop = messages.scrollHeight;
});

// Logout
function logout(){
  auth.signOut().then(()=> location="index.html");
}
