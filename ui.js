// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDUvwNFqMNHO_REKwHt0uYL4xOG2TMK0BU",
  authDomain: "chatmates-e2c70.firebaseapp.com",
  databaseURL: "https://chatmates-e2c70-default-rtdb.firebaseio.com/",
  projectId: "chatmates-e2c70"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// 🔔 Notification sound
const notifySound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");

// GLOBAL
let currentUser = "";
let selectedUser = "";
let lastMsgKey = "";

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

// 🔐 AUTH CHECK
auth.onAuthStateChanged(user => {
  if (!user) {
    location = "index.html";
  } else {
    currentUser = user.email;
    setOnline();
    loadUsers();
  }
});

// 🟢 ONLINE STATUS
function setOnline() {
  const ref = db.ref("status/" + currentUser);

  ref.set({ online: true });

  ref.onDisconnect().set({
    online: false,
    lastSeen: Date.now()
  });
}

// 👥 LOAD USERS
function loadUsers() {
  userList.innerHTML = "";

  Object.keys(users).forEach(u => {
    if (u !== currentUser) {
      let li = document.createElement("li");

      li.innerHTML = `
        <div class="avatar">${users[u][0]}</div>
        <div>${users[u]}</div>
      `;

      li.onclick = () => selectChat(u, li);
      userList.appendChild(li);
    }
  });
}

// 💬 SELECT CHAT
function selectChat(user, element) {
  selectedUser = user;
  chatName.innerText = users[user];
  chatAvatar.innerText = users[user][0];

  // active highlight
  document.querySelectorAll("#userList li").forEach(li => li.classList.remove("active"));
  element.classList.add("active");

  // status
  db.ref("status/" + user).on("value", snap => {
    let s = snap.val();
    if (!s) return;

    if (s.online) {
      statusText.innerText = "Online 🟢";
    } else {
      let t = new Date(s.lastSeen).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      statusText.innerText = "Last seen " + t;
    }
  });

  loadMessages();
}

// 📤 SEND TEXT
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

// 📷 SEND IMAGE (BASE64)
imgInput.onchange = e => {
  let file = e.target.files[0];
  if (!file || !selectedUser) return;

  let reader = new FileReader();

  reader.onload = function () {
    let chatId = [currentUser, selectedUser].sort().join("_");

    db.ref("chats/" + chatId).push({
      from: currentUser,
      image: reader.result,
      time: Date.now(),
      seen: false
    });
  };

  reader.readAsDataURL(file);
};

// 📥 LOAD MESSAGES
function loadMessages() {
  let chatId = [currentUser, selectedUser].sort().join("_");

  db.ref("chats/" + chatId).on("value", snap => {
    messages.innerHTML = "";

    snap.forEach(child => {
      let data = child.val();
      let key = child.key;

      let div = document.createElement("div");
      div.className = data.from === currentUser ? "me" : "other";

      let time = new Date(data.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

      let content = data.image
        ? `<img src="${data.image}" style="max-width:200px;border-radius:10px">`
        : data.text;

      div.innerHTML = `
        ${content}
        <div class="meta">
          ${time} ${data.from === currentUser ? (data.seen ? "✓✓" : "✓") : ""}
        </div>
      `;

      // mark seen
      if (data.from !== currentUser && !data.seen) {
        child.ref.update({ seen: true });
      }

      // notification
      if (key !== lastMsgKey && data.from !== currentUser) {
        notifySound.play();
        lastMsgKey = key;
      }

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// ✍️ TYPING
function typingNow() {
  if (!selectedUser) return;

  db.ref("typing/" + selectedUser).set(currentUser);

  setTimeout(() => {
    db.ref("typing/" + selectedUser).remove();
  }, 1500);
}

// 👀 SHOW TYPING
db.ref("typing").on("value", snap => {
  let t = snap.val();

  if (t && t === selectedUser) {
    typing.innerText = "Typing...";
  } else {
    typing.innerText = "";
  }
});

// 😀 EMOJI
function addEmoji() {
  msg.value += "😊";
}

// 📱 SIDEBAR
function toggleSidebar() {
  sidebar.classList.toggle("hide");
}

// 🚪 LOGOUT
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    auth.signOut().then(() => location = "index.html");
  }
}
