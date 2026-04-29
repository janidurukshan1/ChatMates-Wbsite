// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://chatmates-e2c70-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser = "";
let selectedUser = "";

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
  "adheeshamethsilu@gmail.com : Adheesha" ,
  "hashandev20030723@gmail.com": "Hashan Devinda"
};

// AUTH
auth.onAuthStateChanged(user => {
  if (!user) location = "index.html";
  else {
    currentUser = user.email;
    setOnline();
    loadUsers();
  }
});

// ONLINE
function setOnline() {
  const ref = db.ref("status/" + currentUser);
  ref.set({ online: true });

  ref.onDisconnect().set({
    online: false,
    lastSeen: Date.now()
  });
}

// USERS LIST
function loadUsers() {
  userList.innerHTML = "";

  Object.keys(users).forEach(u => {
    if (u !== currentUser) {
      let li = document.createElement("li");
      li.innerHTML = `<div class="avatar">${users[u][0]}</div>${users[u]}`;
      li.onclick = () => selectChat(u, li);
      userList.appendChild(li);
    }
  });
}

// SELECT CHAT
function selectChat(user, el) {
  selectedUser = user;
  chatName.innerText = users[user];

  document.querySelectorAll("li").forEach(l => l.classList.remove("active"));
  el.classList.add("active");

  db.ref("status/" + user).on("value", snap => {
    let s = snap.val();
    if (!s) return;

    statusText.innerText = s.online
      ? "Online 🟢"
      : "Last seen " + new Date(s.lastSeen).toLocaleTimeString();
  });

  loadMessages();
}

// SEND
function sendMsg() {
  let text = msg.value.trim();
  if (!text || !selectedUser) return;

  let chatId = [currentUser, selectedUser].sort().join("_");

  db.ref("chats/" + chatId).push({
    from: currentUser,
    text,
    time: Date.now(),
    seen: false
  });

  msg.value = "";
}

// LOAD
function loadMessages() {
  let chatId = [currentUser, selectedUser].sort().join("_");

  db.ref("chats/" + chatId).on("value", snap => {
    messages.innerHTML = "";

    snap.forEach(child => {
      let d = child.val();

      let div = document.createElement("div");
      div.className = d.from === currentUser ? "me" : "other";

      let time = new Date(d.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

      div.innerHTML = `
        ${d.text || ""}
        <div class="meta">${time} ${d.from===currentUser ? (d.seen?"✓✓":"✓"):""}</div>
      `;

      if (d.from !== currentUser && !d.seen) {
        child.ref.update({ seen: true });
      }

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// TYPING
function typingNow() {
  if (!selectedUser) return;

  db.ref("typing/" + selectedUser).set(currentUser);

  setTimeout(() => {
    db.ref("typing/" + selectedUser).remove();
  }, 1500);
}

db.ref("typing").on("value", snap => {
  let t = snap.val();
  typing.innerText = t === selectedUser ? "Typing..." : "";
});

// LOGOUT
function logout() {
  if (confirm("Logout?")) {
    auth.signOut();
  }
}

// POPUP
window.onload = () => {
  if (localStorage.getItem("firstLogin") === "true") {
    welcomeBox.style.display = "block";
    localStorage.removeItem("firstLogin");
  } else {
    welcomeBox.style.display = "none";
  }
};

function closeWelcome() {
  welcomeBox.style.display = "none";
}
