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

auth.onAuthStateChanged(user => {
  if (!user) location = "index.html";
  else {
    currentUser = user.email;
    loadUsers();
  }
});

function loadUsers() {
  userList.innerHTML = "";

  Object.keys(users).forEach(u => {
    if (u !== currentUser) {
      let div = document.createElement("div");
      div.className = "user";

      div.innerHTML = `
        <div class="avatar">${users[u][0]}</div>
        <div>${users[u]}</div>
      `;

      div.onclick = () => selectChat(u);
      userList.appendChild(div);
    }
  });
}

function selectChat(user) {
  selectedUser = user;
  chatName.innerText = users[user];
  loadMessages();
}

function sendMsg() {
  let text = msg.value;
  if (!text) return;

  let chatId = [currentUser, selectedUser].sort().join("_");

  db.ref("chats/" + chatId).push({
    from: currentUser,
    text,
    time: Date.now()
  });

  msg.value = "";
}

function loadMessages() {
  let chatId = [currentUser, selectedUser].sort().join("_");

  db.ref("chats/" + chatId).on("value", snap => {
    messages.innerHTML = "";

    snap.forEach(c => {
      let d = c.val();
      let div = document.createElement("div");
      div.className = d.from === currentUser ? "me" : "other";
      div.innerText = d.text;
      messages.appendChild(div);
    });
  });
}

function logout() {
  auth.signOut();
}

window.onload = () => {
  if (localStorage.getItem("firstLogin")) {
    welcomeBox.style.display = "block";
    localStorage.removeItem("firstLogin");
  } else {
    welcomeBox.style.display = "none";
  }
};

function closeWelcome() {
  welcomeBox.classList.add("hide");
  setTimeout(() => {
    welcomeBox.style.display = "none";
  }, 500);
}
