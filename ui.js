const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID"
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
