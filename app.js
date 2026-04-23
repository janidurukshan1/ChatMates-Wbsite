import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;

// wait for auth to be ready
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user.email;

  document.getElementById("me").innerText = currentUser;
});

// logout
window.logout = function(){
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
